// src/contexts/StoreContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Category,
  Company,
  Product,
  Cart,
  CartItemWithProduct,
  Order,
  Coupon,
  User,
  CartTotals,
} from '@/types';

import {
  categories as warehouseCategories,
  companies as warehouseCompanies,
  products as warehouseProducts,
  ensureWarehouseLoaded,
} from '@/data/warehouseAdapter';

import { coupons as seedCoupons, SHIPPING_FEE, FREE_SHIPPING_THRESHOLD, COLD_CHAIN_FEE } from '@/data/seedData';

interface StoreContextType {
  // Categories
  categories: Category[];
  getCategoryById: (id: string) => Category | undefined;

  // Companies
  companies: Company[];
  getCompanyById: (id: string) => Company | undefined;
  getProductsByCompany: (companyId: string) => Product[];

  // Products
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: Cart;
  cartItems: CartItemWithProduct[];
  cartTotals: CartTotals;
  addToCart: (productId: string, weightOptionIndex: number, qty: number) => void;
  updateCartItemQty: (productId: string, weightOptionIndex: number, newQty: number) => void;
  removeFromCart: (productId: string, weightOptionIndex: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  appliedCoupon: Coupon | null;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'number' | 'createdAt' | 'items' | 'totals'>) => Order;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: Order['status']) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;

  // User
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  cart: 'kawther-cart',
  orders: 'kawther-orders',
  coupons: 'kawther-coupons',
  user: 'kawther-user',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function StoreProvider({ children }: { children: ReactNode }) {
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  const [products, setProducts] = useState<Product[]>([]);

  const [cart, setCart] = useState<Cart>(() => loadFromStorage(STORAGE_KEYS.cart, { items: [] }));
  const [orders, setOrders] = useState<Order[]>(() => loadFromStorage(STORAGE_KEYS.orders, []));
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadFromStorage(STORAGE_KEYS.coupons, seedCoupons));
  const [user, setUser] = useState<User | null>(() => loadFromStorage(STORAGE_KEYS.user, null));

  // ✅ Load once from warehouse JSONL (single source of truth)
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await ensureWarehouseLoaded();
        if (!mounted) return;
        setCategories([...warehouseCategories]);
        setCompanies([...warehouseCompanies]);
        setProducts([...warehouseProducts]);
      } catch (error) {
        console.error('Failed to load warehouse products', error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Persist to localStorage
  useEffect(() => saveToStorage(STORAGE_KEYS.cart, cart), [cart]);
  useEffect(() => saveToStorage(STORAGE_KEYS.orders, orders), [orders]);
  useEffect(() => saveToStorage(STORAGE_KEYS.coupons, coupons), [coupons]);
  useEffect(() => saveToStorage(STORAGE_KEYS.user, user), [user]);

  // Categories
  const getCategoryById = useCallback((id: string) => categories.find((c) => c.id === id), [categories]);

  // Companies
  const getCompanyById = useCallback((id: string) => companies.find((c) => c.id === id), [companies]);
  const getProductsByCompany = useCallback(
    (companyId: string) => products.filter((p) => p.companyId === companyId),
    [products],
  );

  // Products
  const getProductById = useCallback((id: string) => products.find((p) => p.id === id), [products]);
  const getProductsByCategory = useCallback(
    (categoryId: string) => products.filter((p) => p.categoryId === categoryId),
    [products],
  );

  const updateProduct = useCallback((product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [...prev, product]);
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Cart computed values
  const cartItems: CartItemWithProduct[] = cart.items
    .map((item: any) => {
      const product = getProductById(item.productId);
      if (!product) return null;

      const selectedWeight = (product as any).weightOptions?.[item.weightOptionIndex];
      const itemPrice = (product as any).price + (selectedWeight?.priceDelta || 0);

      return {
        ...item,
        product,
        selectedWeight,
        itemPrice,
        lineTotal: itemPrice * item.qty,
      };
    })
    .filter(Boolean) as CartItemWithProduct[];

  const appliedCoupon = cart.couponCode
    ? coupons.find((c) => c.code === cart.couponCode && c.active) || null
    : null;

  const cartTotals: CartTotals = (() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const hasFrozen = cartItems.some((item: any) => (item.product as any).isFrozen);
    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const shipping = isFreeShipping ? 0 : SHIPPING_FEE;
    const coldChain = hasFrozen ? COLD_CHAIN_FEE : 0;

    let discount = 0;
    if (appliedCoupon && subtotal >= appliedCoupon.minSubtotal) {
      discount =
        appliedCoupon.type === 'percent'
          ? Math.round((subtotal * appliedCoupon.value) / 100)
          : appliedCoupon.value;
    }

    const total = subtotal + shipping + coldChain - discount;
    return { subtotal, shipping, coldChain, discount, total, hasFrozen, isFreeShipping };
  })();

  // Cart actions
  const addToCart = useCallback((productId: string, weightOptionIndex: number, qty: number) => {
    setCart((prev) => {
      const existingIndex = prev.items.findIndex(
        (item: any) => item.productId === productId && item.weightOptionIndex === weightOptionIndex,
      );

      if (existingIndex >= 0) {
        const newItems = [...prev.items];
        newItems[existingIndex] = { ...newItems[existingIndex], qty: newItems[existingIndex].qty + qty };
        return { ...prev, items: newItems };
      }

      return { ...prev, items: [...prev.items, { productId, weightOptionIndex, qty }] };
    });
  }, []);

  const removeFromCart = useCallback((productId: string, weightOptionIndex: number) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter(
        (item: any) => !(item.productId === productId && item.weightOptionIndex === weightOptionIndex),
      ),
    }));
  }, []);

  const updateCartItemQty = useCallback((productId: string, weightOptionIndex: number, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId, weightOptionIndex);
      return;
    }
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((item: any) =>
        item.productId === productId && item.weightOptionIndex === weightOptionIndex
          ? { ...item, qty: newQty }
          : item,
      ),
    }));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart({ items: [] }), []);

  const applyCoupon = useCallback((code: string) => {
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.active);
    if (!coupon) return { success: false, message: 'Invalid coupon code' };
    if (cartTotals.subtotal < coupon.minSubtotal) {
      return { success: false, message: `Minimum order ${coupon.minSubtotal} required` };
    }
    setCart((prev) => ({ ...prev, couponCode: coupon.code }));
    return { success: true, message: 'Coupon applied!' };
  }, [coupons, cartTotals.subtotal]);

  const removeCoupon = useCallback(() => {
    setCart((prev) => ({ ...prev, couponCode: undefined }));
  }, []);

  // Orders
  const createOrder = useCallback(
    (orderData: Omit<Order, 'id' | 'number' | 'createdAt' | 'items' | 'totals'>) => {
      const id = `order-${Date.now()}`;
      const number = `KW${Date.now().toString().slice(-8)}`;

      const orderItems = cartItems.map((item: any) => ({
        productId: item.productId,
        productName_ar: (item.product as any).name_ar,
        productName_en: (item.product as any).name_en,
        weightOption: item.selectedWeight,
        qty: item.qty,
        unitPrice: item.itemPrice,
        totalPrice: item.lineTotal,
      }));

      const order: Order = {
        ...(orderData as any),
        id,
        number,
        createdAt: new Date().toISOString(),
        items: orderItems,
        totals: { ...cartTotals } as any,
      };

      // Decrement stock (اختياري)
      cartItems.forEach((item: any) => {
        const p = getProductById(item.productId);
        if (p) updateProduct({ ...(p as any), stockQty: Math.max(0, (p as any).stockQty - item.qty) });
      });

      setOrders((prev) => [order, ...prev]);
      clearCart();
      return order;
    },
    [cartItems, cartTotals, getProductById, updateProduct, clearCart],
  );

  const getOrderById = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);

  const updateOrderStatus = useCallback((id: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }, []);

  // Coupons
  const addCoupon = useCallback((coupon: Coupon) => setCoupons((prev) => [...prev, coupon]), []);
  const updateCoupon = useCallback((coupon: Coupon) => setCoupons((prev) => prev.map((c) => (c.code === coupon.code ? coupon : c))), []);
  const deleteCoupon = useCallback((code: string) => setCoupons((prev) => prev.filter((c) => c.code !== code)), []);

  // Auth (demo)
  const login = useCallback(async (email: string, password: string) => {
    if (email === 'admin@kawther.com') {
      setUser({ id: 'admin', email, name: 'Admin', isAdmin: true } as any);
      return true;
    }
    if (email && password) {
      setUser({ id: `user-${Date.now()}`, email, name: email.split('@')[0], isAdmin: false } as any);
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    if (email && password && name) {
      setUser({ id: `user-${Date.now()}`, email, name, isAdmin: false } as any);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setUser(null), []);
  const isAdmin = (user as any)?.isAdmin ?? false;

  return (
    <StoreContext.Provider
      value={{
        categories,
        getCategoryById,
        companies,
        getCompanyById,
        getProductsByCompany,
        products,
        getProductById,
        getProductsByCategory,
        updateProduct,
        addProduct,
        deleteProduct,
        cart,
        cartItems,
        cartTotals,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        appliedCoupon,
        orders,
        createOrder,
        getOrderById,
        updateOrderStatus,
        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        user,
        login,
        register,
        logout,
        isAdmin,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
}

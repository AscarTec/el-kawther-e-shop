// Data Types for EL KAWTHER E-commerce

export interface Category {
  id: string;
  slug: string;
  colorToken: 'frozen' | 'meat' | 'grocery';
  icon: 'snowflake' | 'meat' | 'wheat';
  name_ar: string;
  name_en: string;
}

export interface WeightOption {
  label_ar: string;
  label_en: string;
  grams: number;
  priceDelta: number;
}

export interface Product {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  desc_ar: string;
  desc_en: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  sku: string;
  weightOptions: WeightOption[];
  stockQty: number;
  isFrozen: boolean;
  badges: ('new' | 'bestseller' | 'offer')[];
  tags: string[];
}

export interface CartItem {
  productId: string;
  weightOptionIndex: number;
  qty: number;
}

export interface Cart {
  items: CartItem[];
  couponCode?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName_ar: string;
  productName_en: string;
  weightOption: WeightOption;
  qty: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  address: {
    street: string;
    city: string;
  };
  deliverySlot: string;
  items: OrderItem[];
  payment: {
    method: 'cod' | 'card';
    paid: boolean;
  };
  totals: {
    subtotal: number;
    shipping: number;
    coldChain: number;
    discount: number;
    total: number;
  };
}

export interface Coupon {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  active: boolean;
  minSubtotal: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  isAdmin: boolean;
}

// Computed types
export interface CartItemWithProduct extends CartItem {
  product: Product;
  selectedWeight: WeightOption;
  itemPrice: number;
  lineTotal: number;
}

export interface CartTotals {
  subtotal: number;
  shipping: number;
  coldChain: number;
  discount: number;
  total: number;
  hasFrozen: boolean;
  isFreeShipping: boolean;
}

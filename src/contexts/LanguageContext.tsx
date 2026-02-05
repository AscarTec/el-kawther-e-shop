import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isArabic: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Brand
    'brand.name': 'الكوثر',
    'brand.tagline': 'توريد بثقة',
    
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.categories': 'الأقسام',
    'nav.products': 'المنتجات',
    'nav.companies': 'الشركات',
    'nav.cart': 'السلة',
    'nav.account': 'حسابي',
    'nav.admin': 'لوحة التحكم',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'حساب جديد',
    'nav.logout': 'تسجيل الخروج',
    'nav.orders': 'طلباتي',
    'nav.profile': 'الملف الشخصي',
    
    // Categories
    'cat.frozen': 'مجمّدات',
    'cat.meat': 'لحوم',
    'cat.grocery': 'بقالة',
    'cat.all': 'جميع المنتجات',
    
    // Home
    'home.hero.title': 'الكوثر للتجارة والتوزيع',
    'home.hero.subtitle': 'منتجات غذائية بجودة موثوقة - مجمّدات، لحوم، بقالة',
    'home.hero.cta': 'تسوق الآن',
    'home.categories.title': 'تسوق حسب القسم',
    'home.featured.title': 'منتجات مميزة',
    'home.newshipment': 'وصلت شحنة جديدة',
    'home.benefits.title': 'لماذا الكوثر؟',
    'home.benefit1.title': 'توريد منتظم',
    'home.benefit1.desc': 'نضمن لك وصول المنتجات في موعدها',
    'home.benefit2.title': 'سلسلة تبريد',
    'home.benefit2.desc': 'نحافظ على جودة المنتجات المجمدة',
    'home.benefit3.title': 'جودة موثوقة',
    'home.benefit3.desc': 'منتجات مختارة بعناية من أفضل المصادر',
    
    // Products
    'product.addToCart': 'أضف للسلة',
    'product.outOfStock': 'نفذ المخزون',
    'product.inStock': 'متوفر',
    'product.weight': 'الوزن',
    'product.price': 'السعر',
    'product.quantity': 'الكمية',
    'product.related': 'منتجات مشابهة',
    'product.details': 'تفاصيل المنتج',
    'product.sku': 'رمز المنتج',
    
    // Badges
    'badge.new': 'جديد',
    'badge.bestseller': 'الأكثر مبيعاً',
    'badge.offer': 'عرض',
    'badge.frozen': 'مجمّد',
    
    // Filters
    'filter.title': 'الفلاتر',
    'filter.search': 'بحث...',
    'filter.category': 'القسم',
    'filter.company': 'الشركة',
    'filter.price': 'السعر',
    'filter.availability': 'التوفر',
    'filter.inStockOnly': 'المتوفر فقط',
    'filter.frozenOnly': 'المجمّدات فقط',
    'filter.sort': 'ترتيب',
    'filter.sort.newest': 'الأحدث',
    'filter.sort.priceAsc': 'السعر: من الأقل',
    'filter.sort.priceDesc': 'السعر: من الأعلى',
    'filter.sort.bestselling': 'الأكثر مبيعاً',
    'filter.clear': 'مسح الفلاتر',

    // Companies
    'companies.title': 'الشركات',
    'companies.products': 'منتجات الشركة',
    'company.all': 'جميع الشركات',
    
    // Cart
    'cart.title': 'سلة التسوق',
    'cart.empty': 'السلة فارغة',
    'cart.subtotal': 'المجموع الفرعي',
    'cart.shipping': 'الشحن',
    'cart.coldChain': 'رسوم التبريد',
    'cart.discount': 'الخصم',
    'cart.total': 'الإجمالي',
    'cart.checkout': 'إتمام الطلب',
    'cart.continueShopping': 'متابعة التسوق',
    'cart.coupon': 'كود الخصم',
    'cart.applyCoupon': 'تطبيق',
    'cart.freeShipping': 'شحن مجاني',
    'cart.freeShippingNote': 'شحن مجاني للطلبات أكثر من 1500 جنيه',
    'cart.remove': 'حذف',
    
    // Checkout
    'checkout.title': 'إتمام الطلب',
    'checkout.customer': 'بيانات العميل',
    'checkout.name': 'الاسم',
    'checkout.phone': 'رقم الهاتف',
    'checkout.email': 'البريد الإلكتروني',
    'checkout.address': 'العنوان',
    'checkout.city': 'المدينة',
    'checkout.delivery': 'موعد التوصيل',
    'checkout.payment': 'طريقة الدفع',
    'checkout.cod': 'الدفع عند الاستلام',
    'checkout.card': 'بطاقة ائتمان (تجريبي)',
    'checkout.placeOrder': 'تأكيد الطلب',
    'checkout.orderSummary': 'ملخص الطلب',
    
    // Orders
    'order.success': 'تم الطلب بنجاح!',
    'order.number': 'رقم الطلب',
    'order.date': 'التاريخ',
    'order.status': 'الحالة',
    'order.status.pending': 'قيد الانتظار',
    'order.status.confirmed': 'مؤكد',
    'order.status.shipped': 'تم الشحن',
    'order.status.delivered': 'تم التوصيل',
    'order.status.cancelled': 'ملغي',
    'order.details': 'تفاصيل الطلب',
    'order.history': 'سجل الطلبات',
    'order.noOrders': 'لا يوجد طلبات سابقة',
    
    // Admin
    'admin.dashboard': 'لوحة التحكم',
    'admin.products': 'المنتجات',
    'admin.orders': 'الطلبات',
    'admin.categories': 'الأقسام',
    'admin.coupons': 'كوبونات الخصم',
    'admin.analytics': 'الإحصائيات',
    'admin.lowStock': 'مخزون منخفض',
    'admin.totalSales': 'إجمالي المبيعات',
    'admin.totalOrders': 'إجمالي الطلبات',
    'admin.addProduct': 'إضافة منتج',
    'admin.editProduct': 'تعديل منتج',
    'admin.deleteProduct': 'حذف منتج',
    'admin.pending': 'قيد الانتظار',
    'admin.confirmed': 'مؤكد',
    'admin.shipped': 'تم الشحن',
    'admin.delivered': 'تم التوصيل',
    
    // Common
    'common.currency': 'ج.م',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.add': 'إضافة',
    'common.search': 'بحث',
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
    'common.success': 'تم بنجاح',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.viewAll': 'عرض الكل',
    'common.noResults': 'لا توجد نتائج',
    
    // Footer
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.shipping': 'سياسة الشحن',
    'footer.returns': 'سياسة الإرجاع',
    'footer.privacy': 'سياسة الخصوصية',
    
    // Contact
    'contact.title': 'اتصل بنا',
    'contact.message': 'رسالتك',
    'contact.send': 'إرسال',
    'contact.whatsapp': 'واتساب',
    'contact.phone': 'هاتف',
  },
  en: {
    // Brand
    'brand.name': 'EL KAWTHER',
    'brand.tagline': 'Supply with Trust',
    
    // Navigation
    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.products': 'Products',
    'nav.companies': 'Companies',
    'nav.cart': 'Cart',
    'nav.account': 'Account',
    'nav.admin': 'Dashboard',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.orders': 'My Orders',
    'nav.profile': 'Profile',
    
    // Categories
    'cat.frozen': 'Frozen',
    'cat.meat': 'Meat',
    'cat.grocery': 'Grocery',
    'cat.all': 'All Products',
    
    // Home
    'home.hero.title': 'EL KAWTHER Trading & Distribution',
    'home.hero.subtitle': 'Quality food products - Frozen, Meat, Grocery',
    'home.hero.cta': 'Shop Now',
    'home.categories.title': 'Shop by Category',
    'home.featured.title': 'Featured Products',
    'home.newshipment': 'New Shipment Arrived',
    'home.benefits.title': 'Why EL KAWTHER?',
    'home.benefit1.title': 'Reliable Supply',
    'home.benefit1.desc': 'We ensure timely delivery of products',
    'home.benefit2.title': 'Cold Chain',
    'home.benefit2.desc': 'We maintain quality of frozen products',
    'home.benefit3.title': 'Trusted Quality',
    'home.benefit3.desc': 'Carefully selected products from the best sources',
    
    // Products
    'product.addToCart': 'Add to Cart',
    'product.outOfStock': 'Out of Stock',
    'product.inStock': 'In Stock',
    'product.weight': 'Weight',
    'product.price': 'Price',
    'product.quantity': 'Quantity',
    'product.related': 'Related Products',
    'product.details': 'Product Details',
    'product.sku': 'SKU',
    
    // Badges
    'badge.new': 'New',
    'badge.bestseller': 'Best Seller',
    'badge.offer': 'Offer',
    'badge.frozen': 'Frozen',
    
    // Filters
    'filter.title': 'Filters',
    'filter.search': 'Search...',
    'filter.category': 'Category',
    'filter.company': 'Company',
    'filter.price': 'Price',
    'filter.availability': 'Availability',
    'filter.inStockOnly': 'In Stock Only',
    'filter.frozenOnly': 'Frozen Only',
    'filter.sort': 'Sort',
    'filter.sort.newest': 'Newest',
    'filter.sort.priceAsc': 'Price: Low to High',
    'filter.sort.priceDesc': 'Price: High to Low',
    'filter.sort.bestselling': 'Best Selling',
    'filter.clear': 'Clear Filters',

    // Companies
    'companies.title': 'Companies',
    'companies.products': 'Company products',
    'company.all': 'All companies',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.coldChain': 'Cold Chain Fee',
    'cart.discount': 'Discount',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.continueShopping': 'Continue Shopping',
    'cart.coupon': 'Coupon Code',
    'cart.applyCoupon': 'Apply',
    'cart.freeShipping': 'Free Shipping',
    'cart.freeShippingNote': 'Free shipping on orders over 1500 EGP',
    'cart.remove': 'Remove',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.customer': 'Customer Details',
    'checkout.name': 'Name',
    'checkout.phone': 'Phone',
    'checkout.email': 'Email',
    'checkout.address': 'Address',
    'checkout.city': 'City',
    'checkout.delivery': 'Delivery Time',
    'checkout.payment': 'Payment Method',
    'checkout.cod': 'Cash on Delivery',
    'checkout.card': 'Credit Card (Demo)',
    'checkout.placeOrder': 'Place Order',
    'checkout.orderSummary': 'Order Summary',
    
    // Orders
    'order.success': 'Order Placed Successfully!',
    'order.number': 'Order Number',
    'order.date': 'Date',
    'order.status': 'Status',
    'order.status.pending': 'Pending',
    'order.status.confirmed': 'Confirmed',
    'order.status.shipped': 'Shipped',
    'order.status.delivered': 'Delivered',
    'order.status.cancelled': 'Cancelled',
    'order.details': 'Order Details',
    'order.history': 'Order History',
    'order.noOrders': 'No orders yet',
    
    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.products': 'Products',
    'admin.orders': 'Orders',
    'admin.categories': 'Categories',
    'admin.coupons': 'Coupons',
    'admin.analytics': 'Analytics',
    'admin.lowStock': 'Low Stock',
    'admin.totalSales': 'Total Sales',
    'admin.totalOrders': 'Total Orders',
    'admin.addProduct': 'Add Product',
    'admin.editProduct': 'Edit Product',
    'admin.deleteProduct': 'Delete Product',
    
    // Common
    'common.currency': 'EGP',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.viewAll': 'View All',
    'common.noResults': 'No results found',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.shipping': 'Shipping Policy',
    'footer.returns': 'Returns Policy',
    'footer.privacy': 'Privacy Policy',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.message': 'Your Message',
    'contact.send': 'Send',
    'contact.whatsapp': 'WhatsApp',
    'contact.phone': 'Phone',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('kawther-language');
    return (saved as Language) || 'ar';
  });

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';
  const isArabic = language === 'ar';

  useEffect(() => {
    localStorage.setItem('kawther-language', language);
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t, isArabic }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

import React from 'react';
import { 
  Package, ShoppingCart, DollarSign, AlertTriangle, 
  TrendingUp, Clock, CheckCircle, Truck 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';
import { Order } from '@/types';

export default function AdminDashboard() {
  const { t, isArabic } = useLanguage();
  const { products, orders, categories } = useStore();

  // Analytics calculations
  const totalSales = orders.reduce((sum, order) => sum + order.totals.total, 0);
  const totalOrders = orders.length;
  const lowStockProducts = products.filter(p => p.stockQty < 10);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  // Recent orders
  const recentOrders = orders.slice(0, 5);

  // Products by category
  const productsByCategory = categories.map(cat => ({
    ...cat,
    count: products.filter(p => p.categoryId === cat.id).length,
  }));

  const stats = [
    {
      title: isArabic ? 'إجمالي المبيعات' : 'Total Sales',
      value: `${totalSales.toLocaleString()} ${t('common.currency')}`,
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: isArabic ? 'إجمالي الطلبات' : 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: isArabic ? 'طلبات معلقة' : 'Pending Orders',
      value: pendingOrders,
      icon: Clock,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      title: isArabic ? 'مخزون منخفض' : 'Low Stock',
      value: lowStockProducts.length,
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-900/30',
    },
  ];

  const statusColors: Record<Order['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('admin.dashboard')}</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isArabic ? 'حالة الطلبات' : 'Order Status Overview'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="h-8 w-8 mx-auto text-yellow-600 dark:text-yellow-400 mb-2" />
              <p className="text-2xl font-bold">{pendingOrders}</p>
              <p className="text-sm text-muted-foreground">{t('order.status.pending')}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <CheckCircle className="h-8 w-8 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
              <p className="text-2xl font-bold">{confirmedOrders}</p>
              <p className="text-sm text-muted-foreground">{t('order.status.confirmed')}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Truck className="h-8 w-8 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
              <p className="text-2xl font-bold">{shippedOrders}</p>
              <p className="text-sm text-muted-foreground">{t('order.status.shipped')}</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto text-green-600 dark:text-green-400 mb-2" />
              <p className="text-2xl font-bold">{deliveredOrders}</p>
              <p className="text-sm text-muted-foreground">{t('order.status.delivered')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isArabic ? 'أحدث الطلبات' : 'Recent Orders'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {isArabic ? 'لا توجد طلبات بعد' : 'No orders yet'}
              </p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-mono font-semibold text-sm">{order.number}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                    </div>
                    <div className="text-end">
                      <Badge className={statusColors[order.status]}>
                        {t(`order.status.${order.status}`)}
                      </Badge>
                      <p className="text-sm font-semibold mt-1">
                        {order.totals.total} {t('common.currency')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              {isArabic ? 'تنبيه المخزون المنخفض' : 'Low Stock Alert'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {isArabic ? 'جميع المنتجات متوفرة' : 'All products are well stocked'}
              </p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 5).map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.images[0]} 
                        alt="" 
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm">
                          {isArabic ? product.name_ar : product.name_en}
                        </p>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                      </div>
                    </div>
                    <Badge variant="destructive" className="font-mono">
                      {product.stockQty} {isArabic ? 'قطعة' : 'units'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Products by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isArabic ? 'المنتجات حسب القسم' : 'Products by Category'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {productsByCategory.map(cat => (
              <div key={cat.id} className="text-center p-4 border rounded-lg">
                <Package className={`h-8 w-8 mx-auto mb-2 text-${cat.colorToken}`} />
                <p className="text-2xl font-bold">{cat.count}</p>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? cat.name_ar : cat.name_en}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

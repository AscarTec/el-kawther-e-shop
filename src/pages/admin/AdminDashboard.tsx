import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Package, ShoppingCart, DollarSign, AlertTriangle, 
  TrendingUp, Clock, CheckCircle, Truck, Users, 
  BarChart3, ArrowUpRight, ArrowDownRight, Boxes,
  Calendar, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';
import { Order } from '@/types';
import { cn } from '@/lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function AdminDashboard() {
  const { t, isArabic } = useLanguage();
  const { products, orders, categories, companies } = useStore();

  // Analytics calculations
  const totalSales = orders.reduce((sum, order) => sum + order.totals.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stockQty > 0 && p.stockQty < 10);
  const outOfStockProducts = products.filter(p => p.stockQty === 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
  
  // Calculate trends (mock data for demo)
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
  const frozenProducts = products.filter(p => p.isFrozen).length;
  const totalStock = products.reduce((sum, p) => sum + p.stockQty, 0);

  // Recent orders
  const recentOrders = orders.slice(0, 5);

  // Products by category
  const productsByCategory = categories.map(cat => ({
    ...cat,
    count: products.filter(p => p.categoryId === cat.id).length,
    value: products.filter(p => p.categoryId === cat.id).reduce((sum, p) => sum + (p.price * p.stockQty), 0),
  }));
  
  // Sales chart data (simulated weekly data)
  const salesChartData = [
    { name: isArabic ? 'السبت' : 'Sat', sales: 4200, orders: 12 },
    { name: isArabic ? 'الأحد' : 'Sun', sales: 3800, orders: 10 },
    { name: isArabic ? 'الإثنين' : 'Mon', sales: 5100, orders: 15 },
    { name: isArabic ? 'الثلاثاء' : 'Tue', sales: 4600, orders: 14 },
    { name: isArabic ? 'الأربعاء' : 'Wed', sales: 5800, orders: 18 },
    { name: isArabic ? 'الخميس' : 'Thu', sales: 6200, orders: 20 },
    { name: isArabic ? 'الجمعة' : 'Fri', sales: 3200, orders: 8 },
  ];
  
  // Order status pie chart
  const orderStatusData = [
    { name: t('order.status.pending'), value: pendingOrders, color: '#eab308' },
    { name: t('order.status.confirmed'), value: confirmedOrders, color: '#3b82f6' },
    { name: t('order.status.shipped'), value: shippedOrders, color: '#8b5cf6' },
    { name: t('order.status.delivered'), value: deliveredOrders, color: '#22c55e' },
    { name: t('order.status.cancelled'), value: cancelledOrders, color: '#ef4444' },
  ].filter(d => d.value > 0);
  
  // Stock distribution
  const stockData = productsByCategory.map(cat => ({
    name: isArabic ? cat.name_ar : cat.name_en,
    stock: products.filter(p => p.categoryId === cat.id).reduce((sum, p) => sum + p.stockQty, 0),
  }));

  const mainStats = [
    {
      title: isArabic ? 'إجمالي المبيعات' : 'Total Sales',
      value: `${totalSales.toLocaleString()} ${t('common.currency')}`,
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
      trend: '+12.5%',
      trendUp: true,
    },
    {
      title: isArabic ? 'إجمالي الطلبات' : 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      trend: '+8.2%',
      trendUp: true,
    },
    {
      title: isArabic ? 'متوسط قيمة الطلب' : 'Avg. Order Value',
      value: `${avgOrderValue.toLocaleString()} ${t('common.currency')}`,
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      trend: '+5.1%',
      trendUp: true,
    },
    {
      title: isArabic ? 'إجمالي المنتجات' : 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      trend: '+3',
      trendUp: true,
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
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('admin.dashboard')}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isArabic ? 'نظرة شاملة على أداء متجرك' : 'Overview of your store performance'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            {isArabic ? 'آخر 7 أيام' : 'Last 7 days'}
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className={cn(
                      'flex items-center gap-1 text-xs font-medium',
                      stat.trendUp ? 'text-green-600' : 'text-red-600'
                    )}>
                      {stat.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {stat.trend}
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {isArabic ? 'المبيعات الأسبوعية' : 'Weekly Sales'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesChartData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fill="url(#salesGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {isArabic ? 'حالة الطلبات' : 'Order Status'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {orderStatusData.slice(0, 4).map((status, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                  <span className="text-muted-foreground truncate">{status.name}</span>
                  <span className="font-semibold ms-auto">{status.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Inventory Alerts */}
      <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Boxes className="h-5 w-5 text-primary" />
              {isArabic ? 'ملخص المخزون' : 'Inventory Summary'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{isArabic ? 'إجمالي الوحدات' : 'Total Units'}</span>
              <span className="font-bold text-lg">{totalStock.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{isArabic ? 'منتجات مجمدة' : 'Frozen Products'}</span>
              <span className="font-semibold">{frozenProducts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{isArabic ? 'علامات تجارية' : 'Brands'}</span>
              <span className="font-semibold">{companies.length}</span>
            </div>
            <hr className="border-border" />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  {isArabic ? 'مخزون منخفض' : 'Low Stock'}
                </span>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                  {lowStockProducts.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  {isArabic ? 'نفد المخزون' : 'Out of Stock'}
                </span>
                <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">
                  {outOfStockProducts.length}
                </Badge>
              </div>
            </div>
            <Link to="/admin/inventory">
              <Button variant="outline" className="w-full mt-2 gap-2">
                <Package className="h-4 w-4" />
                {isArabic ? 'إدارة المخزون' : 'Manage Inventory'}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">
              {isArabic ? 'أحدث الطلبات' : 'Recent Orders'}
            </CardTitle>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                {isArabic ? 'عرض الكل' : 'View All'}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">
                  {isArabic ? 'لا توجد طلبات بعد' : 'No orders yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <motion.div 
                    key={order.id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    whileHover={{ x: isArabic ? -4 : 4 }}
                  >
                    <div>
                      <p className="font-mono font-semibold text-sm text-primary">{order.number}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={statusColors[order.status]}>
                        {t(`order.status.${order.status}`)}
                      </Badge>
                      <p className="text-sm font-bold min-w-[80px] text-end">
                        {order.totals.total} {t('common.currency')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Stock by Category */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isArabic ? 'المخزون حسب القسم' : 'Stock by Category'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="stock" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="h-5 w-5" />
                {isArabic ? 'تنبيه: منتجات تحتاج إعادة تخزين' : 'Alert: Products Need Restocking'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {lowStockProducts.slice(0, 6).map(product => (
                  <div key={product.id} className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                    <img 
                      src={product.images[0] || '/assets/products/placeholder.png'}
                      alt="" 
                      onError={(event) => {
                        event.currentTarget.src = '/assets/products/placeholder.png';
                      }}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {isArabic ? product.name_ar : product.name_en}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={(product.stockQty / 10) * 100} className="h-1.5 flex-1" />
                        <span className="text-xs font-mono text-yellow-600">{product.stockQty}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

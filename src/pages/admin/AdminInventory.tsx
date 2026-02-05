 import React, { useState, useMemo } from 'react';
 import { motion } from 'framer-motion';
 import { 
   Package, Search, AlertTriangle, Filter, Download, 
   ArrowUpDown, Boxes, TrendingDown, CheckCircle, XCircle,
   BarChart3, RefreshCw
 } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { Input } from '@/components/ui/input';
 import { Progress } from '@/components/ui/progress';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from '@/components/ui/table';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { useStore } from '@/contexts/StoreContext';
 import { cn } from '@/lib/utils';
 
 type StockFilter = 'all' | 'low' | 'out' | 'healthy';
 type SortField = 'name' | 'stock' | 'price' | 'category';
 type SortOrder = 'asc' | 'desc';
 
 const containerVariants = {
   hidden: { opacity: 0 },
   visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
 };
 
 const itemVariants = {
   hidden: { opacity: 0, y: 20 },
   visible: { opacity: 1, y: 0 }
 };
 
 export default function AdminInventory() {
   const { t, isArabic } = useLanguage();
   const { products, categories, updateProduct } = useStore();
   
   const [searchQuery, setSearchQuery] = useState('');
   const [categoryFilter, setCategoryFilter] = useState<string>('all');
   const [stockFilter, setStockFilter] = useState<StockFilter>('all');
   const [sortField, setSortField] = useState<SortField>('stock');
   const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
   
   // Inventory stats
   const stats = useMemo(() => {
     const totalProducts = products.length;
     const totalStock = products.reduce((sum, p) => sum + p.stockQty, 0);
     const lowStock = products.filter(p => p.stockQty > 0 && p.stockQty < 10).length;
     const outOfStock = products.filter(p => p.stockQty === 0).length;
     const healthyStock = products.filter(p => p.stockQty >= 10).length;
     const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockQty), 0);
     
     return { totalProducts, totalStock, lowStock, outOfStock, healthyStock, totalValue };
   }, [products]);
   
   // Filtered and sorted products
   const filteredProducts = useMemo(() => {
     let result = [...products];
     
     // Search filter
     if (searchQuery) {
       const query = searchQuery.toLowerCase();
       result = result.filter(p => 
         p.name_ar.includes(searchQuery) ||
         p.name_en.toLowerCase().includes(query) ||
         p.sku.toLowerCase().includes(query)
       );
     }
     
     // Category filter
     if (categoryFilter !== 'all') {
       result = result.filter(p => p.categoryId === categoryFilter);
     }
     
     // Stock filter
     if (stockFilter === 'low') {
       result = result.filter(p => p.stockQty > 0 && p.stockQty < 10);
     } else if (stockFilter === 'out') {
       result = result.filter(p => p.stockQty === 0);
     } else if (stockFilter === 'healthy') {
       result = result.filter(p => p.stockQty >= 10);
     }
     
     // Sort
     result.sort((a, b) => {
       let comparison = 0;
       
       switch (sortField) {
         case 'name':
           comparison = (isArabic ? a.name_ar : a.name_en).localeCompare(isArabic ? b.name_ar : b.name_en);
           break;
         case 'stock':
           comparison = a.stockQty - b.stockQty;
           break;
         case 'price':
           comparison = a.price - b.price;
           break;
         case 'category':
           comparison = a.categoryId.localeCompare(b.categoryId);
           break;
       }
       
       return sortOrder === 'asc' ? comparison : -comparison;
     });
     
     return result;
   }, [products, searchQuery, categoryFilter, stockFilter, sortField, sortOrder, isArabic]);
   
   // Category stats
   const categoryStats = useMemo(() => {
     return categories.map(cat => {
       const catProducts = products.filter(p => p.categoryId === cat.id);
       const totalStock = catProducts.reduce((sum, p) => sum + p.stockQty, 0);
       const lowStock = catProducts.filter(p => p.stockQty > 0 && p.stockQty < 10).length;
       const outOfStock = catProducts.filter(p => p.stockQty === 0).length;
       
       return {
         ...cat,
         productCount: catProducts.length,
         totalStock,
         lowStock,
         outOfStock,
       };
     });
   }, [products, categories]);
   
   const getCategoryName = (categoryId: string) => {
     const category = categories.find(c => c.id === categoryId);
     return category ? (isArabic ? category.name_ar : category.name_en) : categoryId;
   };
   
   const getStockStatus = (qty: number) => {
     if (qty === 0) return { label: isArabic ? 'نفد' : 'Out', color: 'destructive' as const };
     if (qty < 10) return { label: isArabic ? 'منخفض' : 'Low', color: 'outline' as const, className: 'border-yellow-500 text-yellow-600' };
     return { label: isArabic ? 'متوفر' : 'In Stock', color: 'secondary' as const };
   };
   
   const handleQuickStockUpdate = (productId: string, newQty: number) => {
     const product = products.find(p => p.id === productId);
     if (product) {
       updateProduct({ ...product, stockQty: Math.max(0, newQty) });
     }
   };
   
   const toggleSort = (field: SortField) => {
     if (sortField === field) {
       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
     } else {
       setSortField(field);
       setSortOrder('asc');
     }
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
           <h1 className="text-2xl font-bold flex items-center gap-2">
             <Boxes className="h-7 w-7 text-primary" />
             {isArabic ? 'إدارة المخزون' : 'Inventory Management'}
           </h1>
           <p className="text-muted-foreground text-sm mt-1">
             {isArabic ? 'تتبع وإدارة مخزون المنتجات' : 'Track and manage product stock'}
           </p>
         </div>
         <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="gap-2">
             <Download className="h-4 w-4" />
             {isArabic ? 'تصدير' : 'Export'}
           </Button>
           <Button variant="outline" size="icon" className="h-9 w-9">
             <RefreshCw className="h-4 w-4" />
           </Button>
         </div>
       </motion.div>
 
       {/* Stats Cards */}
       <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                 <Package className="h-5 w-5 text-blue-600" />
               </div>
               <div>
                 <p className="text-xs text-muted-foreground">{isArabic ? 'إجمالي المنتجات' : 'Products'}</p>
                 <p className="text-xl font-bold">{stats.totalProducts}</p>
               </div>
             </div>
           </CardContent>
         </Card>
         
         <Card>
           <CardContent className="p-4">
             <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                 <Boxes className="h-5 w-5 text-purple-600" />
               </div>
               <div>
                 <p className="text-xs text-muted-foreground">{isArabic ? 'إجمالي الوحدات' : 'Total Units'}</p>
                 <p className="text-xl font-bold">{stats.totalStock.toLocaleString()}</p>
               </div>
             </div>
           </CardContent>
         </Card>
         
         <Card className="border-yellow-500/30 bg-yellow-500/5">
           <CardContent className="p-4">
             <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                 <TrendingDown className="h-5 w-5 text-yellow-600" />
               </div>
               <div>
                 <p className="text-xs text-muted-foreground">{isArabic ? 'مخزون منخفض' : 'Low Stock'}</p>
                 <p className="text-xl font-bold text-yellow-600">{stats.lowStock}</p>
               </div>
             </div>
           </CardContent>
         </Card>
         
         <Card className="border-red-500/30 bg-red-500/5">
           <CardContent className="p-4">
             <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                 <XCircle className="h-5 w-5 text-red-600" />
               </div>
               <div>
                 <p className="text-xs text-muted-foreground">{isArabic ? 'نفد المخزون' : 'Out of Stock'}</p>
                 <p className="text-xl font-bold text-red-600">{stats.outOfStock}</p>
               </div>
             </div>
           </CardContent>
         </Card>
         
         <Card className="border-green-500/30 bg-green-500/5">
           <CardContent className="p-4">
             <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                 <CheckCircle className="h-5 w-5 text-green-600" />
               </div>
               <div>
                 <p className="text-xs text-muted-foreground">{isArabic ? 'متوفر' : 'In Stock'}</p>
                 <p className="text-xl font-bold text-green-600">{stats.healthyStock}</p>
               </div>
             </div>
           </CardContent>
         </Card>
       </motion.div>
 
       {/* Tabs */}
       <motion.div variants={itemVariants}>
         <Tabs defaultValue="products" className="space-y-4">
           <TabsList>
             <TabsTrigger value="products" className="gap-2">
               <Package className="h-4 w-4" />
               {isArabic ? 'المنتجات' : 'Products'}
             </TabsTrigger>
             <TabsTrigger value="categories" className="gap-2">
               <BarChart3 className="h-4 w-4" />
               {isArabic ? 'حسب القسم' : 'By Category'}
             </TabsTrigger>
           </TabsList>
 
           <TabsContent value="products" className="space-y-4">
             {/* Filters */}
             <Card>
               <CardContent className="p-4">
                 <div className="flex flex-col lg:flex-row gap-4">
                   <div className="relative flex-1">
                     <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input
                       placeholder={isArabic ? 'بحث بالاسم أو الكود...' : 'Search by name or SKU...'}
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="ps-9"
                     />
                   </div>
                   
                   <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                     <SelectTrigger className="w-[180px]">
                       <SelectValue placeholder={t('filter.category')} />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">{t('cat.all')}</SelectItem>
                       {categories.map(cat => (
                         <SelectItem key={cat.id} value={cat.id}>
                           {isArabic ? cat.name_ar : cat.name_en}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                   
                   <Select value={stockFilter} onValueChange={(v) => setStockFilter(v as StockFilter)}>
                     <SelectTrigger className="w-[150px]">
                       <Filter className="h-4 w-4 me-2" />
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">{isArabic ? 'الكل' : 'All'}</SelectItem>
                       <SelectItem value="healthy">{isArabic ? 'متوفر' : 'In Stock'}</SelectItem>
                       <SelectItem value="low">{isArabic ? 'منخفض' : 'Low Stock'}</SelectItem>
                       <SelectItem value="out">{isArabic ? 'نفد' : 'Out of Stock'}</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </CardContent>
             </Card>
 
             {/* Products Table */}
             <Card>
               <CardContent className="p-0">
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>{isArabic ? 'المنتج' : 'Product'}</TableHead>
                       <TableHead 
                         className="cursor-pointer hover:bg-muted/50"
                         onClick={() => toggleSort('category')}
                       >
                         <div className="flex items-center gap-1">
                           {isArabic ? 'القسم' : 'Category'}
                           <ArrowUpDown className="h-3 w-3" />
                         </div>
                       </TableHead>
                       <TableHead 
                         className="cursor-pointer hover:bg-muted/50"
                         onClick={() => toggleSort('price')}
                       >
                         <div className="flex items-center gap-1">
                           {isArabic ? 'السعر' : 'Price'}
                           <ArrowUpDown className="h-3 w-3" />
                         </div>
                       </TableHead>
                       <TableHead 
                         className="cursor-pointer hover:bg-muted/50"
                         onClick={() => toggleSort('stock')}
                       >
                         <div className="flex items-center gap-1">
                           {isArabic ? 'المخزون' : 'Stock'}
                           <ArrowUpDown className="h-3 w-3" />
                         </div>
                       </TableHead>
                       <TableHead>{isArabic ? 'الحالة' : 'Status'}</TableHead>
                       <TableHead>{isArabic ? 'تحديث سريع' : 'Quick Update'}</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {filteredProducts.length === 0 ? (
                       <TableRow>
                         <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                           <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                           {isArabic ? 'لا توجد منتجات' : 'No products found'}
                         </TableCell>
                       </TableRow>
                     ) : (
                       filteredProducts.map(product => {
                         const status = getStockStatus(product.stockQty);
                         return (
                           <TableRow key={product.id} className={cn(
                             product.stockQty === 0 && 'bg-red-500/5',
                             product.stockQty > 0 && product.stockQty < 10 && 'bg-yellow-500/5'
                           )}>
                             <TableCell>
                               <div className="flex items-center gap-3">
                                 <img
                                   src={product.images[0] || '/assets/products/placeholder.png'}
                                   alt=""
                                   onError={(e) => { e.currentTarget.src = '/assets/products/placeholder.png'; }}
                                   className="w-10 h-10 rounded-lg object-cover"
                                 />
                                 <div>
                                   <p className="font-medium text-sm">
                                     {isArabic ? product.name_ar : product.name_en}
                                   </p>
                                   <p className="text-xs text-muted-foreground">{product.sku}</p>
                                 </div>
                               </div>
                             </TableCell>
                             <TableCell>
                               <Badge variant="outline">{getCategoryName(product.categoryId)}</Badge>
                             </TableCell>
                             <TableCell className="font-semibold">
                               {product.price} {t('common.currency')}
                             </TableCell>
                             <TableCell>
                               <div className="flex items-center gap-2">
                                 <Progress 
                                   value={Math.min((product.stockQty / 100) * 100, 100)} 
                                   className={cn(
                                     'h-2 w-16',
                                     product.stockQty === 0 && '[&>div]:bg-red-500',
                                     product.stockQty > 0 && product.stockQty < 10 && '[&>div]:bg-yellow-500',
                                     product.stockQty >= 10 && '[&>div]:bg-green-500'
                                   )}
                                 />
                                 <span className="font-mono text-sm font-semibold">{product.stockQty}</span>
                               </div>
                             </TableCell>
                             <TableCell>
                               <Badge 
                                 variant={status.color} 
                                 className={status.className}
                               >
                                 {status.label}
                               </Badge>
                             </TableCell>
                             <TableCell>
                               <div className="flex items-center gap-1">
                                 <Button 
                                   variant="outline" 
                                   size="icon" 
                                   className="h-7 w-7"
                                   onClick={() => handleQuickStockUpdate(product.id, product.stockQty - 1)}
                                 >
                                   -
                                 </Button>
                                 <Input
                                   type="number"
                                   value={product.stockQty}
                                   onChange={(e) => handleQuickStockUpdate(product.id, parseInt(e.target.value) || 0)}
                                   className="w-16 h-7 text-center text-sm"
                                 />
                                 <Button 
                                   variant="outline" 
                                   size="icon" 
                                   className="h-7 w-7"
                                   onClick={() => handleQuickStockUpdate(product.id, product.stockQty + 1)}
                                 >
                                   +
                                 </Button>
                               </div>
                             </TableCell>
                           </TableRow>
                         );
                       })
                     )}
                   </TableBody>
                 </Table>
               </CardContent>
             </Card>
           </TabsContent>
 
           <TabsContent value="categories" className="space-y-4">
             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {categoryStats.map(cat => (
                 <Card key={cat.id} className="overflow-hidden">
                   <CardHeader className={cn(
                     'pb-3',
                     {
                       frozen: 'bg-frozen/10',
                       meat: 'bg-meat/10',
                       grocery: 'bg-grocery/10',
                       dairy: 'bg-dairy/10',
                     }[cat.colorToken] ?? 'bg-muted/20'
                   )}>
                     <CardTitle className="text-lg flex items-center justify-between">
                       <span>{isArabic ? cat.name_ar : cat.name_en}</span>
                       <Badge variant="secondary">{cat.productCount} {isArabic ? 'منتج' : 'items'}</Badge>
                     </CardTitle>
                   </CardHeader>
                   <CardContent className="pt-4 space-y-3">
                     <div className="flex items-center justify-between text-sm">
                       <span className="text-muted-foreground">{isArabic ? 'إجمالي الوحدات' : 'Total Units'}</span>
                       <span className="font-bold">{cat.totalStock.toLocaleString()}</span>
                     </div>
                     
                     <div className="flex items-center justify-between text-sm">
                       <span className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-yellow-500" />
                         {isArabic ? 'مخزون منخفض' : 'Low Stock'}
                       </span>
                       <span className="font-semibold text-yellow-600">{cat.lowStock}</span>
                     </div>
                     
                     <div className="flex items-center justify-between text-sm">
                       <span className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-red-500" />
                         {isArabic ? 'نفد المخزون' : 'Out of Stock'}
                       </span>
                       <span className="font-semibold text-red-600">{cat.outOfStock}</span>
                     </div>
                     
                     <Progress 
                       value={cat.productCount > 0 ? ((cat.productCount - cat.outOfStock) / cat.productCount) * 100 : 100}
                       className="h-2 mt-2"
                     />
                     <p className="text-xs text-muted-foreground text-center">
                       {Math.round(cat.productCount > 0 ? ((cat.productCount - cat.outOfStock) / cat.productCount) * 100 : 100)}% {isArabic ? 'متوفر' : 'available'}
                     </p>
                   </CardContent>
                 </Card>
               ))}
             </div>
           </TabsContent>
         </Tabs>
       </motion.div>
     </motion.div>
   );
 }
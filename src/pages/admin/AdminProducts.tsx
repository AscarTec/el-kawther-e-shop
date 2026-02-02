import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';
import { Product, WeightOption } from '@/types';
import { toast } from 'sonner';

const EMPTY_PRODUCT: Partial<Product> = {
  name_ar: '',
  name_en: '',
  desc_ar: '',
  desc_en: '',
  categoryId: 'frozen',
  price: 0,
  currency: 'EGP',
  images: [],
  sku: '',
  weightOptions: [{ label_ar: '500 جرام', label_en: '500g', grams: 500, priceDelta: 0 }],
  stockQty: 0,
  isFrozen: false,
  badges: [],
  tags: [],
};

export default function AdminProducts() {
  const { t, isArabic } = useLanguage();
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name_ar.includes(searchQuery) ||
      product.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.categoryId === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleSave = () => {
    if (!editingProduct) return;

    if (!editingProduct.name_ar || !editingProduct.name_en || !editingProduct.sku) {
      toast.error(isArabic ? 'الرجاء ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    if (isCreating) {
      const newProduct: Product = {
        ...EMPTY_PRODUCT,
        ...editingProduct,
        id: `product-${Date.now()}`,
        slug: editingProduct.name_en?.toLowerCase().replace(/\s+/g, '-') || '',
      } as Product;
      addProduct(newProduct);
      toast.success(isArabic ? 'تم إضافة المنتج' : 'Product added');
    } else {
      updateProduct(editingProduct as Product);
      toast.success(isArabic ? 'تم تحديث المنتج' : 'Product updated');
    }

    setEditingProduct(null);
    setIsCreating(false);
  };

  const handleDelete = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId);
      toast.success(isArabic ? 'تم حذف المنتج' : 'Product deleted');
      setDeletingProductId(null);
    }
  };

  const openCreateDialog = () => {
    setEditingProduct({ ...EMPTY_PRODUCT });
    setIsCreating(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct({ ...product });
    setIsCreating(false);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? (isArabic ? category.name_ar : category.name_en) : categoryId;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">{t('admin.products')}</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 me-2" />
          {t('admin.addProduct')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isArabic ? 'الصورة' : 'Image'}</TableHead>
                <TableHead>{isArabic ? 'المنتج' : 'Product'}</TableHead>
                <TableHead>{isArabic ? 'القسم' : 'Category'}</TableHead>
                <TableHead>{isArabic ? 'السعر' : 'Price'}</TableHead>
                <TableHead>{isArabic ? 'المخزون' : 'Stock'}</TableHead>
                <TableHead>{isArabic ? 'إجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    {isArabic ? 'لا توجد منتجات' : 'No products found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.images[0]}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {isArabic ? product.name_ar : product.name_en}
                        </p>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getCategoryName(product.categoryId)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {product.price} {t('common.currency')}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={product.stockQty < 10 ? 'destructive' : 'secondary'}
                        className="font-mono"
                      >
                        {product.stockQty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeletingProductId(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => { setEditingProduct(null); setIsCreating(false); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? t('admin.addProduct') : t('admin.editProduct')}
            </DialogTitle>
          </DialogHeader>

          {editingProduct && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isArabic ? 'الاسم (عربي) *' : 'Name (Arabic) *'}</Label>
                  <Input
                    value={editingProduct.name_ar || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name_ar: e.target.value })}
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isArabic ? 'الاسم (إنجليزي) *' : 'Name (English) *'}</Label>
                  <Input
                    value={editingProduct.name_en || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name_en: e.target.value })}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isArabic ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
                  <Textarea
                    value={editingProduct.desc_ar || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, desc_ar: e.target.value })}
                    dir="rtl"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isArabic ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
                  <Textarea
                    value={editingProduct.desc_en || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, desc_en: e.target.value })}
                    dir="ltr"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{isArabic ? 'كود المنتج *' : 'SKU *'}</Label>
                  <Input
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isArabic ? 'السعر الأساسي *' : 'Base Price *'}</Label>
                  <Input
                    type="number"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isArabic ? 'المخزون *' : 'Stock *'}</Label>
                  <Input
                    type="number"
                    value={editingProduct.stockQty || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockQty: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('filter.category')}</Label>
                  <Select
                    value={editingProduct.categoryId || 'frozen'}
                    onValueChange={(value) => setEditingProduct({ ...editingProduct, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {isArabic ? cat.name_ar : cat.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{isArabic ? 'السعر قبل الخصم' : 'Compare at Price'}</Label>
                  <Input
                    type="number"
                    value={editingProduct.compareAtPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, compareAtPrice: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editingProduct.isFrozen || false}
                    onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, isFrozen: checked })}
                  />
                  <Label>{isArabic ? 'منتج مجمد' : 'Frozen Product'}</Label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditingProduct(null); setIsCreating(false); }}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSave}>
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingProductId} onOpenChange={() => setDeletingProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isArabic ? 'هل أنت متأكد؟' : 'Are you sure?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic 
                ? 'سيتم حذف هذا المنتج نهائياً. لا يمكن التراجع عن هذا الإجراء.'
                : 'This product will be permanently deleted. This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

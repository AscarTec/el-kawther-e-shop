import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Ticket, Percent, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';
import { Coupon } from '@/types';
import { toast } from 'sonner';

const EMPTY_COUPON: Coupon = {
  code: '',
  type: 'percent',
  value: 0,
  active: true,
  minSubtotal: 0,
};

export default function AdminCoupons() {
  const { t, isArabic } = useLanguage();
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useStore();
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingCouponCode, setDeletingCouponCode] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSave = () => {
    if (!editingCoupon) return;

    if (!editingCoupon.code || editingCoupon.value <= 0) {
      toast.error(isArabic ? 'الرجاء ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    if (isCreating) {
      // Check if code already exists
      if (coupons.some(c => c.code.toUpperCase() === editingCoupon.code.toUpperCase())) {
        toast.error(isArabic ? 'هذا الكود موجود بالفعل' : 'This code already exists');
        return;
      }
      addCoupon({ ...editingCoupon, code: editingCoupon.code.toUpperCase() });
      toast.success(isArabic ? 'تم إضافة الكوبون' : 'Coupon added');
    } else {
      updateCoupon(editingCoupon);
      toast.success(isArabic ? 'تم تحديث الكوبون' : 'Coupon updated');
    }

    setEditingCoupon(null);
    setIsCreating(false);
  };

  const handleDelete = () => {
    if (deletingCouponCode) {
      deleteCoupon(deletingCouponCode);
      toast.success(isArabic ? 'تم حذف الكوبون' : 'Coupon deleted');
      setDeletingCouponCode(null);
    }
  };

  const openCreateDialog = () => {
    setEditingCoupon({ ...EMPTY_COUPON });
    setIsCreating(true);
  };

  const openEditDialog = (coupon: Coupon) => {
    setEditingCoupon({ ...coupon });
    setIsCreating(false);
  };

  const toggleCouponActive = (coupon: Coupon) => {
    updateCoupon({ ...coupon, active: !coupon.active });
    toast.success(isArabic ? 'تم تحديث حالة الكوبون' : 'Coupon status updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">{t('admin.coupons')}</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 me-2" />
          {isArabic ? 'إضافة كوبون' : 'Add Coupon'}
        </Button>
      </div>

      {/* Coupons Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isArabic ? 'الكود' : 'Code'}</TableHead>
                <TableHead>{isArabic ? 'النوع' : 'Type'}</TableHead>
                <TableHead>{isArabic ? 'القيمة' : 'Value'}</TableHead>
                <TableHead>{isArabic ? 'الحد الأدنى' : 'Min. Order'}</TableHead>
                <TableHead>{isArabic ? 'الحالة' : 'Status'}</TableHead>
                <TableHead>{isArabic ? 'إجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    <Ticket className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    {isArabic ? 'لا توجد كوبونات' : 'No coupons found'}
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map(coupon => (
                  <TableRow key={coupon.code}>
                    <TableCell className="font-mono font-bold text-primary">
                      {coupon.code}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {coupon.type === 'percent' ? (
                          <>
                            <Percent className="h-4 w-4 text-muted-foreground" />
                            <span>{isArabic ? 'نسبة مئوية' : 'Percentage'}</span>
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>{isArabic ? 'مبلغ ثابت' : 'Fixed Amount'}</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {coupon.type === 'percent' 
                        ? `${coupon.value}%` 
                        : `${coupon.value} ${t('common.currency')}`}
                    </TableCell>
                    <TableCell>
                      {coupon.minSubtotal > 0 
                        ? `${coupon.minSubtotal} ${t('common.currency')}`
                        : (isArabic ? 'لا يوجد' : 'None')}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={coupon.active}
                        onCheckedChange={() => toggleCouponActive(coupon)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(coupon)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeletingCouponCode(coupon.code)}
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
      <Dialog open={!!editingCoupon} onOpenChange={() => { setEditingCoupon(null); setIsCreating(false); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isCreating 
                ? (isArabic ? 'إضافة كوبون جديد' : 'Add New Coupon')
                : (isArabic ? 'تعديل الكوبون' : 'Edit Coupon')}
            </DialogTitle>
          </DialogHeader>

          {editingCoupon && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{isArabic ? 'كود الكوبون *' : 'Coupon Code *'}</Label>
                <Input
                  value={editingCoupon.code}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="SUMMER2024"
                  className="font-mono"
                  disabled={!isCreating}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isArabic ? 'نوع الخصم' : 'Discount Type'}</Label>
                  <Select
                    value={editingCoupon.type}
                    onValueChange={(value: 'percent' | 'fixed') => setEditingCoupon({ ...editingCoupon, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">
                        {isArabic ? 'نسبة مئوية (%)' : 'Percentage (%)'}
                      </SelectItem>
                      <SelectItem value="fixed">
                        {isArabic ? 'مبلغ ثابت (ج.م)' : 'Fixed Amount (EGP)'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{isArabic ? 'القيمة *' : 'Value *'}</Label>
                  <Input
                    type="number"
                    value={editingCoupon.value}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, value: Number(e.target.value) })}
                    min={0}
                    max={editingCoupon.type === 'percent' ? 100 : undefined}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{isArabic ? 'الحد الأدنى للطلب' : 'Minimum Order Amount'}</Label>
                <Input
                  type="number"
                  value={editingCoupon.minSubtotal}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, minSubtotal: Number(e.target.value) })}
                  min={0}
                />
                <p className="text-xs text-muted-foreground">
                  {isArabic ? 'اتركه 0 لعدم وجود حد أدنى' : 'Leave 0 for no minimum'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingCoupon.active}
                  onCheckedChange={(checked) => setEditingCoupon({ ...editingCoupon, active: checked })}
                />
                <Label>{isArabic ? 'كوبون نشط' : 'Active Coupon'}</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditingCoupon(null); setIsCreating(false); }}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSave}>
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingCouponCode} onOpenChange={() => setDeletingCouponCode(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isArabic ? 'هل أنت متأكد؟' : 'Are you sure?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isArabic 
                ? 'سيتم حذف هذا الكوبون نهائياً. لا يمكن التراجع عن هذا الإجراء.'
                : 'This coupon will be permanently deleted. This action cannot be undone.'}
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

import React, { useState } from 'react';
import { Eye, ChevronDown, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from '@/components/ui/dialog';
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
import { Order, OrderStatus } from '@/types';

const ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const { t, isArabic } = useLanguage();
  const { orders, updateOrderStatus } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">{t('admin.orders')}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{filteredOrders.length}</span>
          <span>{isArabic ? 'طلب' : 'orders'}</span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isArabic ? 'بحث برقم الطلب أو اسم العميل...' : 'Search by order number or customer name...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 me-2" />
                <SelectValue placeholder={isArabic ? 'الحالة' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isArabic ? 'الكل' : 'All'}</SelectItem>
                {ORDER_STATUSES.map(status => (
                  <SelectItem key={status} value={status}>
                    {t(`order.status.${status}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isArabic ? 'رقم الطلب' : 'Order #'}</TableHead>
                <TableHead>{isArabic ? 'العميل' : 'Customer'}</TableHead>
                <TableHead>{isArabic ? 'التاريخ' : 'Date'}</TableHead>
                <TableHead>{isArabic ? 'الإجمالي' : 'Total'}</TableHead>
                <TableHead>{isArabic ? 'الحالة' : 'Status'}</TableHead>
                <TableHead>{isArabic ? 'إجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {isArabic ? 'لا توجد طلبات' : 'No orders found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-semibold">
                      {order.number}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US')}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {order.totals.total} {t('common.currency')}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                      >
                        <SelectTrigger className={`w-[140px] ${statusColors[order.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map(status => (
                            <SelectItem key={status} value={status}>
                              {t(`order.status.${status}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span>{t('order.details')}</span>
              <Badge className={statusColors[selectedOrder?.status || 'pending']}>
                {t(`order.status.${selectedOrder?.status}`)}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('order.number')}</p>
                  <p className="font-mono font-bold">{selectedOrder.number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('order.date')}</p>
                  <p className="font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleString(isArabic ? 'ar-EG' : 'en-US')}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-2">{t('checkout.customer')}</h3>
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p><span className="text-muted-foreground">{t('checkout.name')}:</span> {selectedOrder.customer.name}</p>
                  <p><span className="text-muted-foreground">{t('checkout.phone')}:</span> {selectedOrder.customer.phone}</p>
                  <p><span className="text-muted-foreground">{t('checkout.email')}:</span> {selectedOrder.customer.email}</p>
                  <p><span className="text-muted-foreground">{t('checkout.address')}:</span> {selectedOrder.address.street}, {selectedOrder.address.city}</p>
                  <p><span className="text-muted-foreground">{t('checkout.delivery')}:</span> {selectedOrder.deliverySlot}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-2">{isArabic ? 'المنتجات' : 'Items'}</h3>
                <div className="border rounded-lg divide-y">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {isArabic ? item.productName_ar : item.productName_en}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {isArabic ? item.weightOption.label_ar : item.weightOption.label_en} × {item.qty}
                        </p>
                      </div>
                      <p className="font-semibold">{item.totalPrice} {t('common.currency')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                  <span>{selectedOrder.totals.subtotal} {t('common.currency')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.shipping')}</span>
                  <span>{selectedOrder.totals.shipping} {t('common.currency')}</span>
                </div>
                {selectedOrder.totals.coldChain > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('cart.coldChain')}</span>
                    <span>{selectedOrder.totals.coldChain} {t('common.currency')}</span>
                  </div>
                )}
                {selectedOrder.totals.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t('cart.discount')}</span>
                    <span>-{selectedOrder.totals.discount} {t('common.currency')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>{t('cart.total')}</span>
                  <span className="text-primary">{selectedOrder.totals.total} {t('common.currency')}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>{t('checkout.payment')}</span>
                  <div className="flex items-center gap-2">
                    <span>{selectedOrder.payment.method === 'cod' ? t('checkout.cod') : t('checkout.card')}</span>
                    <Badge variant={selectedOrder.payment.paid ? 'default' : 'outline'}>
                      {selectedOrder.payment.paid 
                        ? (isArabic ? 'مدفوع' : 'Paid') 
                        : (isArabic ? 'غير مدفوع' : 'Unpaid')}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{isArabic ? 'تغيير الحالة:' : 'Update Status:'}</span>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => {
                    handleStatusChange(selectedOrder.id, value as OrderStatus);
                    setSelectedOrder({ ...selectedOrder, status: value as OrderStatus });
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map(status => (
                      <SelectItem key={status} value={status}>
                        {t(`order.status.${status}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

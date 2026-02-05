// src/data/seedData.ts
import { Coupon } from '@/types';

export const coupons: Coupon[] = [
  { code: 'KAWTHAR10', type: 'percent', value: 10, active: true, minSubtotal: 500 },
  { code: 'FROZEN25', type: 'fixed', value: 25, active: true, minSubtotal: 800 },
];

export const SHIPPING_FEE = 40;
export const FREE_SHIPPING_THRESHOLD = 1500;
export const COLD_CHAIN_FEE = 25;
export const LOW_STOCK_THRESHOLD = 10;

export const DELIVERY_SLOTS = [
  { value: '10-13', label_ar: '10:00 - 13:00', label_en: '10:00 AM - 1:00 PM' },
  { value: '13-16', label_ar: '13:00 - 16:00', label_en: '1:00 PM - 4:00 PM' },
  { value: '16-19', label_ar: '16:00 - 19:00', label_en: '4:00 PM - 7:00 PM' },
];

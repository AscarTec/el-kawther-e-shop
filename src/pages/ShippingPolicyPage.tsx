 import React from 'react';
 import { motion } from 'framer-motion';
 import { Truck, Clock, MapPin, CreditCard, Package, Info } from 'lucide-react';
 import { Layout } from '@/components/layout/Layout';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { useLanguage } from '@/contexts/LanguageContext';
 
 export default function ShippingPolicyPage() {
   const { isArabic } = useLanguage();
 
   const sections = [
     {
       icon: MapPin,
       title: isArabic ? 'مناطق التوصيل' : 'Delivery Areas',
       content: isArabic
         ? 'نقوم بالتوصيل إلى جميع أنحاء القاهرة الكبرى والجيزة. يمكننا التوصيل إلى المحافظات الأخرى حسب الطلب مع رسوم إضافية.'
         : 'We deliver to all areas of Greater Cairo and Giza. Delivery to other governorates is available upon request with additional fees.',
     },
     {
       icon: Clock,
       title: isArabic ? 'مواعيد التوصيل' : 'Delivery Times',
       content: isArabic
         ? 'التوصيل متاح من السبت إلى الخميس، من الساعة 9 صباحاً حتى 9 مساءً. يمكنك اختيار الفترة الزمنية المناسبة لك عند الطلب.'
         : 'Delivery is available Saturday to Thursday, from 9 AM to 9 PM. You can choose your preferred time slot when ordering.',
     },
     {
       icon: Truck,
       title: isArabic ? 'رسوم الشحن' : 'Shipping Fees',
       content: isArabic
         ? 'الشحن مجاني للطلبات فوق 500 جنيه. للطلبات الأقل، رسوم الشحن 35 جنيه. المنتجات المجمدة تتطلب رسوم سلسلة تبريد إضافية 15 جنيه.'
         : 'Free shipping for orders over 500 EGP. For smaller orders, shipping fee is 35 EGP. Frozen products require an additional cold chain fee of 15 EGP.',
     },
     {
       icon: Package,
       title: isArabic ? 'تتبع الطلب' : 'Order Tracking',
       content: isArabic
         ? 'بمجرد شحن طلبك، ستتلقى رسالة تأكيد مع رقم التتبع. يمكنك متابعة حالة طلبك من صفحة "طلباتي".'
         : 'Once your order is shipped, you will receive a confirmation message with a tracking number. You can track your order status from the "My Orders" page.',
     },
     {
       icon: CreditCard,
       title: isArabic ? 'طرق الدفع' : 'Payment Methods',
       content: isArabic
         ? 'نقبل الدفع عند الاستلام نقداً أو بالبطاقة. كما يمكنك الدفع أونلاين بالبطاقة الائتمانية أو المدينة.'
         : 'We accept cash on delivery or card payment. You can also pay online using credit or debit card.',
     },
     {
       icon: Info,
       title: isArabic ? 'ملاحظات هامة' : 'Important Notes',
       content: isArabic
         ? 'يرجى التأكد من توفر شخص لاستلام الطلب في العنوان المحدد. في حالة عدم التواجد، سيتم إعادة جدولة التوصيل.'
         : 'Please ensure someone is available to receive the order at the specified address. If no one is available, delivery will be rescheduled.',
     },
   ];
 
   return (
     <Layout>
       <div className="container py-12">
         <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-12"
         >
           <h1 className="text-3xl md:text-4xl font-bold mb-4">
             {isArabic ? 'سياسة الشحن والتوصيل' : 'Shipping & Delivery Policy'}
           </h1>
           <p className="text-muted-foreground max-w-2xl mx-auto">
             {isArabic
               ? 'كل ما تحتاج معرفته عن خدمة التوصيل لدينا'
               : 'Everything you need to know about our delivery service'}
           </p>
         </motion.div>
 
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
         >
           {sections.map((section, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 * index }}
             >
               <Card className="h-full hover:shadow-md transition-shadow">
                 <CardHeader className="pb-3">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-primary/10 rounded-lg">
                       <section.icon className="h-5 w-5 text-primary" />
                     </div>
                     <CardTitle className="text-lg">{section.title}</CardTitle>
                   </div>
                 </CardHeader>
                 <CardContent>
                   <p className="text-muted-foreground leading-relaxed">
                     {section.content}
                   </p>
                 </CardContent>
               </Card>
             </motion.div>
           ))}
         </motion.div>
       </div>
     </Layout>
   );
 }
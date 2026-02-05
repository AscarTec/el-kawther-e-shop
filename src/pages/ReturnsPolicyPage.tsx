 import React from 'react';
 import { motion } from 'framer-motion';
 import { RotateCcw, AlertCircle, CheckCircle, XCircle, Clock, Phone } from 'lucide-react';
 import { Layout } from '@/components/layout/Layout';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { useLanguage } from '@/contexts/LanguageContext';
 
 export default function ReturnsPolicyPage() {
   const { isArabic } = useLanguage();
 
   const acceptedReturns = isArabic
     ? [
         'المنتج تالف أو معيب',
         'المنتج مختلف عن الطلب',
         'المنتج منتهي الصلاحية',
         'كمية المنتج غير مطابقة',
       ]
     : [
         'Product is damaged or defective',
         'Product is different from order',
         'Product is expired',
         'Quantity mismatch',
       ];
 
   const notAcceptedReturns = isArabic
     ? [
         'المنتجات المفتوحة أو المستخدمة',
         'المنتجات المجمدة بعد استلامها',
         'المنتجات الطازجة بعد 24 ساعة',
         'تغيير الرأي بعد الاستلام',
       ]
     : [
         'Opened or used products',
         'Frozen products after receipt',
         'Fresh products after 24 hours',
         'Change of mind after delivery',
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
             {isArabic ? 'سياسة الإرجاع والاستبدال' : 'Return & Exchange Policy'}
           </h1>
           <p className="text-muted-foreground max-w-2xl mx-auto">
             {isArabic
               ? 'رضاكم هو هدفنا الأول. تعرف على سياسة الإرجاع لدينا'
               : 'Your satisfaction is our priority. Learn about our return policy'}
           </p>
         </motion.div>
 
         <div className="max-w-4xl mx-auto space-y-8">
           {/* Return Period */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
           >
             <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
               <CardContent className="p-6 flex items-center gap-4">
                 <div className="p-4 bg-primary/10 rounded-full">
                   <Clock className="h-8 w-8 text-primary" />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold mb-1">
                     {isArabic ? 'فترة الإرجاع' : 'Return Period'}
                   </h3>
                   <p className="text-muted-foreground">
                     {isArabic
                       ? 'يمكنك إرجاع المنتج خلال 48 ساعة من استلام الطلب'
                       : 'You can return products within 48 hours of receiving your order'}
                   </p>
                 </div>
               </CardContent>
             </Card>
           </motion.div>
 
           {/* Accepted & Not Accepted */}
           <div className="grid md:grid-cols-2 gap-6">
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
             >
               <Card className="h-full border-green-500/20">
                 <CardHeader>
                   <div className="flex items-center gap-2 text-green-600">
                     <CheckCircle className="h-5 w-5" />
                     <CardTitle className="text-lg">
                       {isArabic ? 'حالات مقبولة للإرجاع' : 'Accepted Returns'}
                     </CardTitle>
                   </div>
                 </CardHeader>
                 <CardContent>
                   <ul className="space-y-3">
                     {acceptedReturns.map((item, index) => (
                       <li key={index} className="flex items-start gap-2">
                         <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                         <span className="text-muted-foreground">{item}</span>
                       </li>
                     ))}
                   </ul>
                 </CardContent>
               </Card>
             </motion.div>
 
             <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
             >
               <Card className="h-full border-red-500/20">
                 <CardHeader>
                   <div className="flex items-center gap-2 text-red-600">
                     <XCircle className="h-5 w-5" />
                     <CardTitle className="text-lg">
                       {isArabic ? 'حالات غير مقبولة' : 'Non-Returnable'}
                     </CardTitle>
                   </div>
                 </CardHeader>
                 <CardContent>
                   <ul className="space-y-3">
                     {notAcceptedReturns.map((item, index) => (
                       <li key={index} className="flex items-start gap-2">
                         <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                         <span className="text-muted-foreground">{item}</span>
                       </li>
                     ))}
                   </ul>
                 </CardContent>
               </Card>
             </motion.div>
           </div>
 
           {/* How to Return */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
           >
             <Card>
               <CardHeader>
                 <div className="flex items-center gap-2">
                   <RotateCcw className="h-5 w-5 text-primary" />
                   <CardTitle>
                     {isArabic ? 'كيفية طلب الإرجاع' : 'How to Request a Return'}
                   </CardTitle>
                 </div>
               </CardHeader>
               <CardContent className="space-y-4">
                 <p className="text-muted-foreground">
                   {isArabic
                     ? 'لطلب إرجاع منتج، يرجى اتباع الخطوات التالية:'
                     : 'To request a return, please follow these steps:'}
                 </p>
                 <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                   <li>
                     {isArabic
                       ? 'تواصل معنا عبر الواتساب أو الهاتف خلال 48 ساعة'
                       : 'Contact us via WhatsApp or phone within 48 hours'}
                   </li>
                   <li>
                     {isArabic
                       ? 'أرسل صورة للمنتج مع وصف المشكلة'
                       : 'Send a photo of the product with a description of the issue'}
                   </li>
                   <li>
                     {isArabic
                       ? 'انتظر موافقة فريق خدمة العملاء'
                       : 'Wait for approval from customer service'}
                   </li>
                   <li>
                     {isArabic
                       ? 'سيتم ترتيب استلام المنتج أو استبداله'
                       : 'Product pickup or replacement will be arranged'}
                   </li>
                 </ol>
               </CardContent>
             </Card>
           </motion.div>
 
           {/* Contact for Returns */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
           >
             <Card className="bg-muted/30">
               <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
                 <AlertCircle className="h-10 w-10 text-amber-500 shrink-0" />
                 <div className="text-center sm:text-start flex-1">
                   <p className="font-medium mb-1">
                     {isArabic
                       ? 'هل لديك استفسار عن الإرجاع؟'
                       : 'Have questions about returns?'}
                   </p>
                   <p className="text-sm text-muted-foreground">
                     {isArabic
                       ? 'تواصل مع خدمة العملاء وسنساعدك'
                       : 'Contact customer service and we will help you'}
                   </p>
                 </div>
                 <a
                   href="https://wa.me/201234567890"
                   className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                 >
                   <Phone className="h-4 w-4" />
                   {isArabic ? 'تواصل معنا' : 'Contact Us'}
                 </a>
               </CardContent>
             </Card>
           </motion.div>
         </div>
       </div>
     </Layout>
   );
 }
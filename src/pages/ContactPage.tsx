 import React, { useState } from 'react';
 import { motion } from 'framer-motion';
 import { Phone, Mail, MapPin, Clock, Send, MessageCircle, CheckCircle } from 'lucide-react';
 import { Layout } from '@/components/layout/Layout';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Textarea } from '@/components/ui/textarea';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { useLanguage } from '@/contexts/LanguageContext';
 import { useToast } from '@/hooks/use-toast';
 
 const containerVariants = {
   hidden: { opacity: 0 },
   visible: {
     opacity: 1,
     transition: { staggerChildren: 0.1 }
   }
 };
 
 const itemVariants = {
   hidden: { opacity: 0, y: 20 },
   visible: { opacity: 1, y: 0 }
 };
 
 export default function ContactPage() {
   const { t, isArabic } = useLanguage();
   const { toast } = useToast();
   const [formData, setFormData] = useState({
     name: '',
     email: '',
     phone: '',
     subject: '',
     message: ''
   });
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isSuccess, setIsSuccess] = useState(false);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsSubmitting(true);
     
     // Simulate form submission
     await new Promise(resolve => setTimeout(resolve, 1500));
     
     setIsSubmitting(false);
     setIsSuccess(true);
     toast({
       title: isArabic ? 'تم الإرسال بنجاح' : 'Message Sent!',
       description: isArabic ? 'سنتواصل معك قريباً' : 'We will get back to you soon.',
     });
     
     setTimeout(() => {
       setIsSuccess(false);
       setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
     }, 3000);
   };
 
   const contactInfo = [
     {
       icon: Phone,
       title: isArabic ? 'اتصل بنا' : 'Call Us',
       value: '+20 123 456 7890',
       link: 'tel:+201234567890',
     },
     {
       icon: MessageCircle,
       title: isArabic ? 'واتساب' : 'WhatsApp',
       value: '+20 123 456 7890',
       link: 'https://wa.me/201234567890',
       color: 'text-green-500',
     },
     {
       icon: Mail,
       title: isArabic ? 'البريد الإلكتروني' : 'Email',
       value: 'info@elkawther.com',
       link: 'mailto:info@elkawther.com',
     },
     {
       icon: MapPin,
       title: isArabic ? 'العنوان' : 'Address',
       value: isArabic ? 'القاهرة، مصر' : 'Cairo, Egypt',
     },
     {
       icon: Clock,
       title: isArabic ? 'ساعات العمل' : 'Working Hours',
       value: isArabic ? 'السبت - الخميس: 9 ص - 9 م' : 'Sat - Thu: 9 AM - 9 PM',
     },
   ];
 
   return (
     <Layout>
       <div className="container py-12">
         {/* Header */}
         <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-12"
         >
           <h1 className="text-3xl md:text-4xl font-bold mb-4">
             {isArabic ? 'تواصل معنا' : 'Contact Us'}
           </h1>
           <p className="text-muted-foreground max-w-2xl mx-auto">
             {isArabic
               ? 'نحن هنا لمساعدتك! تواصل معنا بأي طريقة تناسبك'
               : 'We are here to help! Reach out to us in any way that suits you'}
           </p>
         </motion.div>
 
         <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
           {/* Contact Info Cards */}
           <motion.div
             variants={containerVariants}
             initial="hidden"
             animate="visible"
             className="space-y-6"
           >
             {/* WhatsApp CTA */}
             <motion.a
               href="https://wa.me/201234567890"
               target="_blank"
               rel="noopener noreferrer"
               variants={itemVariants}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="block"
             >
               <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 cursor-pointer overflow-hidden relative group">
                 <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                 <CardContent className="relative p-6 flex items-center gap-4">
                   <div className="p-4 bg-white/20 rounded-full">
                     <MessageCircle className="h-8 w-8" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold mb-1">
                       {isArabic ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
                     </h3>
                     <p className="text-white/80">
                       {isArabic ? 'اضغط للمحادثة الفورية' : 'Click for instant chat'}
                     </p>
                   </div>
                   <motion.div 
                     className="ms-auto"
                     animate={{ x: [0, 5, 0] }}
                     transition={{ repeat: Infinity, duration: 1.5 }}
                   >
                     <Send className="h-6 w-6" />
                   </motion.div>
                 </CardContent>
               </Card>
             </motion.a>
 
             {/* Contact Info Grid */}
             <div className="grid sm:grid-cols-2 gap-4">
               {contactInfo.filter(info => info.icon !== MessageCircle).map((info, index) => (
                 <motion.div key={index} variants={itemVariants}>
                   <Card className="h-full hover:shadow-md transition-shadow">
                     <CardContent className="p-5">
                       {info.link ? (
                         <a href={info.link} className="flex items-start gap-3 group">
                           <div className={`p-2 rounded-lg bg-primary/10 ${info.color || 'text-primary'}`}>
                             <info.icon className="h-5 w-5" />
                           </div>
                           <div>
                             <p className="text-sm text-muted-foreground">{info.title}</p>
                             <p className="font-medium group-hover:text-primary transition-colors" dir="ltr">
                               {info.value}
                             </p>
                           </div>
                         </a>
                       ) : (
                         <div className="flex items-start gap-3">
                           <div className="p-2 rounded-lg bg-primary/10 text-primary">
                             <info.icon className="h-5 w-5" />
                           </div>
                           <div>
                             <p className="text-sm text-muted-foreground">{info.title}</p>
                             <p className="font-medium">{info.value}</p>
                           </div>
                         </div>
                       )}
                     </CardContent>
                   </Card>
                 </motion.div>
               ))}
             </div>
 
             {/* Map placeholder */}
             <motion.div variants={itemVariants}>
               <Card className="overflow-hidden">
                 <div className="h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                   <div className="text-center text-muted-foreground">
                     <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                     <p>{isArabic ? 'الخريطة' : 'Map Location'}</p>
                   </div>
                 </div>
               </Card>
             </motion.div>
           </motion.div>
 
           {/* Contact Form */}
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
           >
             <Card>
               <CardHeader>
                 <CardTitle>
                   {isArabic ? 'أرسل لنا رسالة' : 'Send us a Message'}
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <form onSubmit={handleSubmit} className="space-y-5">
                   <div className="grid sm:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <label className="text-sm font-medium">
                         {isArabic ? 'الاسم' : 'Name'} *
                       </label>
                       <Input
                         required
                         value={formData.name}
                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                         placeholder={isArabic ? 'اسمك الكامل' : 'Your full name'}
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-medium">
                         {isArabic ? 'البريد الإلكتروني' : 'Email'} *
                       </label>
                       <Input
                         type="email"
                         required
                         value={formData.email}
                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                         placeholder="email@example.com"
                       />
                     </div>
                   </div>
 
                   <div className="grid sm:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <label className="text-sm font-medium">
                         {isArabic ? 'رقم الهاتف' : 'Phone'}
                       </label>
                       <Input
                         type="tel"
                         value={formData.phone}
                         onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                         placeholder="+20 xxx xxx xxxx"
                         dir="ltr"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-medium">
                         {isArabic ? 'الموضوع' : 'Subject'} *
                       </label>
                       <Input
                         required
                         value={formData.subject}
                         onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                         placeholder={isArabic ? 'موضوع الرسالة' : 'Message subject'}
                       />
                     </div>
                   </div>
 
                   <div className="space-y-2">
                     <label className="text-sm font-medium">
                       {isArabic ? 'الرسالة' : 'Message'} *
                     </label>
                     <Textarea
                       required
                       rows={5}
                       value={formData.message}
                       onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                       placeholder={isArabic ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                     />
                   </div>
 
                   <Button
                     type="submit"
                     size="lg"
                     className="w-full gap-2"
                     disabled={isSubmitting || isSuccess}
                   >
                     {isSuccess ? (
                       <>
                         <CheckCircle className="h-5 w-5" />
                         {isArabic ? 'تم الإرسال!' : 'Sent!'}
                       </>
                     ) : isSubmitting ? (
                       <>
                         <motion.div
                           animate={{ rotate: 360 }}
                           transition={{ repeat: Infinity, duration: 1 }}
                         >
                           <Send className="h-5 w-5" />
                         </motion.div>
                         {isArabic ? 'جاري الإرسال...' : 'Sending...'}
                       </>
                     ) : (
                       <>
                         <Send className="h-5 w-5" />
                         {isArabic ? 'إرسال الرسالة' : 'Send Message'}
                       </>
                     )}
                   </Button>
                 </form>
               </CardContent>
             </Card>
           </motion.div>
         </div>
       </div>
     </Layout>
   );
 }
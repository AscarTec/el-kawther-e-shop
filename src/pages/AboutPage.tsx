 import React from 'react';
 import { motion } from 'framer-motion';
 import { Award, Users, Truck, Shield, Target, Heart } from 'lucide-react';
 import { Layout } from '@/components/layout/Layout';
 import { Card, CardContent } from '@/components/ui/card';
 import { useLanguage } from '@/contexts/LanguageContext';
 
 const containerVariants = {
   hidden: { opacity: 0 },
   visible: {
     opacity: 1,
     transition: { staggerChildren: 0.15 }
   }
 };
 
 const itemVariants = {
   hidden: { opacity: 0, y: 30 },
   visible: { opacity: 1, y: 0 }
 };
 
 export default function AboutPage() {
   const { isArabic } = useLanguage();
 
   const features = [
     {
       icon: Award,
       title: isArabic ? 'جودة عالية' : 'Premium Quality',
       desc: isArabic
         ? 'نقدم أفضل المنتجات الغذائية من أشهر العلامات التجارية'
         : 'We offer the finest food products from renowned brands',
     },
     {
       icon: Truck,
       title: isArabic ? 'توصيل سريع' : 'Fast Delivery',
       desc: isArabic
         ? 'نوصل طلبك بأسرع وقت مع الحفاظ على جودة المنتجات'
         : 'Quick delivery while maintaining product quality',
     },
     {
       icon: Shield,
       title: isArabic ? 'ضمان الجودة' : 'Quality Guarantee',
       desc: isArabic
         ? 'نضمن جودة جميع المنتجات وسلامتها'
         : 'We guarantee the quality and safety of all products',
     },
     {
       icon: Users,
       title: isArabic ? 'خدمة عملاء متميزة' : 'Excellent Service',
       desc: isArabic
         ? 'فريق متخصص لخدمتك على مدار الساعة'
         : 'Dedicated team to serve you around the clock',
     },
   ];
 
   const stats = [
     { value: '10K+', label: isArabic ? 'عميل سعيد' : 'Happy Customers' },
     { value: '500+', label: isArabic ? 'منتج' : 'Products' },
     { value: '50+', label: isArabic ? 'علامة تجارية' : 'Brands' },
     { value: '24/7', label: isArabic ? 'دعم فني' : 'Support' },
   ];
 
   return (
     <Layout>
       {/* Hero Section */}
       <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background py-16 md:py-24 overflow-hidden">
         <div className="absolute inset-0 opacity-5">
           <div className="absolute top-20 right-20 w-72 h-72 bg-primary rounded-full blur-3xl" />
           <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
         </div>
         
         <div className="container relative">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             className="max-w-3xl mx-auto text-center"
           >
             <h1 className="text-4xl md:text-5xl font-bold mb-6">
               {isArabic ? 'من نحن' : 'About Us'}
             </h1>
             <p className="text-xl text-muted-foreground leading-relaxed">
               {isArabic
                 ? 'الكوثر هي وجهتك الأولى للمنتجات الغذائية عالية الجودة. نسعى دائماً لتقديم أفضل المنتجات بأفضل الأسعار مع خدمة توصيل سريعة وموثوقة.'
                 : 'EL KAWTHER is your premier destination for high-quality food products. We strive to offer the best products at competitive prices with fast and reliable delivery service.'}
             </p>
           </motion.div>
         </div>
       </section>
 
       {/* Mission & Vision */}
       <section className="py-16 container">
         <div className="grid md:grid-cols-2 gap-8">
           <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
           >
             <Card className="h-full bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
               <CardContent className="p-8">
                 <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                   <Target className="h-8 w-8 text-primary" />
                 </div>
                 <h2 className="text-2xl font-bold mb-4">
                   {isArabic ? 'رسالتنا' : 'Our Mission'}
                 </h2>
                 <p className="text-muted-foreground leading-relaxed">
                   {isArabic
                     ? 'توفير منتجات غذائية عالية الجودة لكل بيت مصري، مع الالتزام بأعلى معايير الجودة والسلامة الغذائية، وتقديم تجربة تسوق سهلة وممتعة.'
                     : 'To provide high-quality food products to every Egyptian home, while adhering to the highest quality and food safety standards, and offering an easy and enjoyable shopping experience.'}
                 </p>
               </CardContent>
             </Card>
           </motion.div>
 
           <motion.div
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
           >
             <Card className="h-full bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
               <CardContent className="p-8">
                 <div className="p-3 bg-accent/10 rounded-xl w-fit mb-4">
                   <Heart className="h-8 w-8 text-accent" />
                 </div>
                 <h2 className="text-2xl font-bold mb-4">
                   {isArabic ? 'رؤيتنا' : 'Our Vision'}
                 </h2>
                 <p className="text-muted-foreground leading-relaxed">
                   {isArabic
                     ? 'أن نصبح الخيار الأول والأفضل لكل عائلة تبحث عن منتجات غذائية طازجة وعالية الجودة في مصر والمنطقة العربية.'
                     : 'To become the first and best choice for every family looking for fresh, high-quality food products in Egypt and the Arab region.'}
                 </p>
               </CardContent>
             </Card>
           </motion.div>
         </div>
       </section>
 
       {/* Stats */}
       <section className="py-12 bg-muted/30">
         <div className="container">
           <motion.div
             variants={containerVariants}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             className="grid grid-cols-2 md:grid-cols-4 gap-6"
           >
             {stats.map((stat, index) => (
               <motion.div key={index} variants={itemVariants} className="text-center">
                 <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                   {stat.value}
                 </div>
                 <div className="text-muted-foreground">{stat.label}</div>
               </motion.div>
             ))}
           </motion.div>
         </div>
       </section>
 
       {/* Features */}
       <section className="py-16 container">
         <motion.h2
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           className="text-3xl font-bold text-center mb-12"
         >
           {isArabic ? 'لماذا تختارنا؟' : 'Why Choose Us?'}
         </motion.h2>
 
         <motion.div
           variants={containerVariants}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
         >
           {features.map((feature, index) => (
             <motion.div key={index} variants={itemVariants}>
               <Card className="h-full text-center group hover:shadow-lg transition-shadow">
                 <CardContent className="p-6">
                   <motion.div
                     whileHover={{ scale: 1.1, rotate: 5 }}
                     className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4"
                   >
                     <feature.icon className="h-8 w-8 text-primary" />
                   </motion.div>
                   <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                   <p className="text-sm text-muted-foreground">{feature.desc}</p>
                 </CardContent>
               </Card>
             </motion.div>
           ))}
         </motion.div>
       </section>
     </Layout>
   );
 }
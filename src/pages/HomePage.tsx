import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, Snowflake, Award, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ProductCard";
import { CategoryTile } from "@/components/CategoryTile";
import { FullBleedBackgroundSlider } from "@/components/FullBleedBackgroundSlider";

import { useLanguage } from "@/contexts/LanguageContext";
import { useStore } from "@/contexts/StoreContext";

import {
  slide1,
  slide2,
  slide3,
  slide4,
  slide5,
  slide6,
  slide7,
  slide8,
} from "@/assets/slides";

export default function HomePage() {
  const { t, isArabic } = useLanguage();
  const { products, categories, getProductsByCategory } = useStore();

  const featuredProducts = products
    .filter((p) => p.badges.includes("bestseller") || p.badges.includes("new"))
    .slice(0, 8);

  const getCategoryCount = (catId: string) => getProductsByCategory(catId).length;

  const benefits = [
    { icon: Truck, title: t("home.benefit1.title"), desc: t("home.benefit1.desc") },
    { icon: Snowflake, title: t("home.benefit2.title"), desc: t("home.benefit2.desc") },
    { icon: Award, title: t("home.benefit3.title"), desc: t("home.benefit3.desc") },
  ];

  const bgSlides = [
    { src: slide1, alt: "slide 1" },
    { src: slide2, alt: "slide 2" },
    { src: slide3, alt: "slide 3" },
    { src: slide4, alt: "slide 4" },
    { src: slide5, alt: "slide 5" },
    { src: slide6, alt: "slide 6" },
    { src: slide7, alt: "slide 7" },
    { src: slide8, alt: "slide 8" },
  ];

  return (
    <Layout>
      {/* HERO: Full width + responsive height */}
      <section className="relative w-full  overflow-hidden">
        <FullBleedBackgroundSlider
          images={bgSlides}
          isArabic={isArabic}
          autoMs={5500}
          className={[
            "rounded-none",
            // ✅ Responsive heights (اختيار 1: ارتفاع متدرّج)
            "h-[320px] sm:h-[420px] md:h-[520px] lg:h-[640px]",
            // ✅ لو عايزها Full Screen على الموبايل بدل السطر اللي فوق:
            // "h-[100svh] md:h-[70vh] lg:h-[80vh]",
          ].join(" ")}
          showArrows
          showDots
        />
      </section>

      {/* Categories Section */}
      <section className="py-10 sm:py-14 md:py-16 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              {t("home.categories.title")}
            </h2>
            <Link to="/categories" className="text-primary hover:underline flex items-center gap-1">
              {t("common.viewAll")}
              <ArrowRight className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {categories.map((cat) => (
              <CategoryTile
                key={cat.id}
                category={cat}
                productCount={getCategoryCount(cat.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-10 sm:py-14 md:py-16 bg-secondary/50">
        <div className="container">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            {t("home.benefits.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-7 pb-6 px-6 space-y-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* New Shipment Banner */}
      <section className="py-5 sm:py-6 bg-accent text-accent-foreground">
        <div className="container flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Package className="h-6 w-6" />
          <span className="text-base sm:text-lg font-semibold">{t("home.newshipment")}</span>
          <Link to="/products?sort=newest">
            <Button
              variant="outline"
              size="sm"
              className="border-accent-foreground/30 hover:bg-accent-foreground/10"
            >
              {t("common.viewAll")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-10 sm:py-14 md:py-16 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              {t("home.featured.title")}
            </h2>
            <Link to="/products" className="text-primary hover:underline flex items-center gap-1">
              {t("common.viewAll")}
              <ArrowRight className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container text-center space-y-5 md:space-y-6">
          <h2 className="text-2xl md:text-4xl font-bold">
            {isArabic ? "جاهز للطلب؟" : "Ready to Order?"}
          </h2>
          <p className="text-base md:text-xl opacity-90 max-w-2xl mx-auto">
            {isArabic
              ? "تسوق الآن واستمتع بأفضل المنتجات الغذائية مع توصيل سريع"
              : "Shop now and enjoy the best food products with fast delivery"}
          </p>
          <Link to="/products">
            <Button size="lg" variant="secondary" className="text-lg">
              {t("home.hero.cta")}
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

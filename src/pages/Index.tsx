import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import PromoBanner from '@/components/home/PromoBanner';
import ProductGrid from '@/components/products/ProductGrid';
import CartSidebar from '@/components/cart/CartSidebar';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import StoreClosedBanner from '@/components/common/StoreClosedBanner';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <StoreClosedBanner />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PromoBanner />
        <section id="menu">
          <ProductGrid />
        </section>
      </main>
      <Footer />
      <CartSidebar />
      <WhatsAppButton />
    </div>
  );
};

export default Index;

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import PromoBanner from '@/components/home/PromoBanner';
import ProductGrid from '@/components/products/ProductGrid';
import CartSidebar from '@/components/cart/CartSidebar';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import StoreClosedBanner from '@/components/common/StoreClosedBanner';
import CinematicLoader from '@/components/common/CinematicLoader';
import FilmGrain from '@/components/common/FilmGrain';
import { motion, AnimatePresence } from 'framer-motion';

const Index: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Cinematic Page Loader */}
      <AnimatePresence>
        {isLoading && (
          <CinematicLoader 
            onComplete={() => setIsLoading(false)} 
            minDuration={2500}
          />
        )}
      </AnimatePresence>

      {/* Film Grain Overlay - Always present */}
      <FilmGrain />

      {/* Main Content */}
      <motion.div 
        className="min-h-screen flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      >
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
      </motion.div>
    </>
  );
};

export default Index;

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import ProductCard from '@/components/products/ProductCard';
import { Link } from 'react-router-dom';

const NewProductsSection: React.FC = () => {
  const { data: products } = useProducts();
  const { data: settings } = useStoreSettings();

  // Show newest 4 products
  const newProducts = products
    ?.slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  const menuImages = settings?.menu_images || [];

  return (
    <section className="py-12 md:py-20 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-1/4 top-1/3 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--brand-gold) / 0.08) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="container relative z-10">
        {/* Menu Images Section */}
        {menuImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                Our <span className="text-gradient-gold">Menu</span>
              </h2>
              <div className="mt-3 h-0.5 w-16 mx-auto rounded-full" style={{ background: 'linear-gradient(to right, transparent, hsl(var(--brand-gold)), transparent)' }} />
            </div>
            <div className={`grid gap-4 ${menuImages.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : menuImages.length === 2 ? 'grid-cols-2 max-w-2xl mx-auto' : menuImages.length === 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
              {menuImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-xl overflow-hidden border border-border/50 shadow-lg aspect-[3/4]"
                >
                  <img src={img} alt={`Menu page ${i + 1}`} className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* New Products */}
        {newProducts && newProducts.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold">
                New <span className="text-gradient-gold">Products</span>
              </h2>
              <div className="mt-3 h-0.5 w-16 mx-auto rounded-full" style={{ background: 'linear-gradient(to right, transparent, hsl(var(--brand-gold)), transparent)' }} />
              <p className="text-muted-foreground mt-4 max-w-md mx-auto">
                Check out our latest additions to the menu
              </p>
            </motion.div>

            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              {newProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center mt-8"
            >
              <Link to="/shop">
                <Button
                  size="lg"
                  className="font-bold shadow-gold-glow gap-2"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--brand-gold)) 0%, hsl(35 80% 48%) 100%)',
                    color: 'hsl(0 0% 5%)',
                  }}
                >
                  Go to Shop
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default NewProductsSection;

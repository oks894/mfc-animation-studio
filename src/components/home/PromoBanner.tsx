import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useActivePromotions } from '@/hooks/usePromotions';
import { cn } from '@/lib/utils';

const PromoBanner: React.FC = () => {
  const { data: promotions } = useActivePromotions();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (!promotions || promotions.length === 0) return null;

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % promotions.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  const currentPromo = promotions[currentIndex];

  return (
    <section className="py-10 bg-gradient-to-r from-primary via-primary/90 to-primary relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating ember particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, -80],
              x: [0, (i % 2 === 0 ? 20 : -20)],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: i * 0.4,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              bottom: '20%',
              background: 'hsl(45 100% 60%)',
              boxShadow: '0 0 6px hsl(45 100% 50% / 0.8)',
            }}
          />
        ))}
        
        {/* Warm glow */}
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse, hsl(45 100% 50% / 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      <div className="container relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPromo.id}
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="flex items-center justify-between gap-4"
          >
            {promotions.length > 1 && (
              <motion.div
                whileHover={{ scale: 1.1, x: -4 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prev}
                  className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              </motion.div>
            )}

            <div className="flex-1 text-center text-primary-foreground">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-center gap-3">
                  <motion.span 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-3xl"
                  >
                    🎉
                  </motion.span>
                  <h3 className="text-xl font-bold md:text-2xl lg:text-3xl">{currentPromo.title}</h3>
                  <motion.span 
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-3xl"
                  >
                    🎉
                  </motion.span>
                </div>
                {currentPromo.description && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-primary-foreground/90 max-w-lg mx-auto"
                  >
                    {currentPromo.description}
                  </motion.p>
                )}
                {currentPromo.discount_percentage > 0 && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                    className="inline-block relative"
                  >
                    {/* Glow effect behind badge */}
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          '0 0 20px hsl(45 100% 50% / 0.4)',
                          '0 0 40px hsl(45 100% 50% / 0.6)',
                          '0 0 20px hsl(45 100% 50% / 0.4)',
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="rounded-full bg-secondary px-8 py-2.5 font-bold text-secondary-foreground text-lg shadow-lg"
                    >
                      {currentPromo.discount_percentage}% OFF
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {promotions.length > 1 && (
              <motion.div
                whileHover={{ scale: 1.1, x: 4 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={next}
                  className="text-primary-foreground hover:bg-primary-foreground/20 rounded-full"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Dots with animated indicator */}
        {promotions.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {promotions.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  index === currentIndex
                    ? "bg-primary-foreground w-8"
                    : "bg-primary-foreground/40 w-2 hover:bg-primary-foreground/60"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PromoBanner;

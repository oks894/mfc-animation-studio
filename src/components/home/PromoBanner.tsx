import React from 'react';
import { motion } from 'framer-motion';
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
    <section className="py-8 bg-gradient-to-r from-primary to-primary/80">
      <div className="container">
        <motion.div
          key={currentPromo.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="flex items-center justify-between gap-4"
        >
          {promotions.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={prev}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}

          <div className="flex-1 text-center text-primary-foreground">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl">🎉</span>
                <h3 className="text-xl font-bold md:text-2xl">{currentPromo.title}</h3>
                <span className="text-3xl">🎉</span>
              </div>
              {currentPromo.description && (
                <p className="text-primary-foreground/80">{currentPromo.description}</p>
              )}
              {currentPromo.discount_percentage > 0 && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block rounded-full bg-secondary px-6 py-2 font-bold text-secondary-foreground"
                >
                  {currentPromo.discount_percentage}% OFF
                </motion.div>
              )}
            </motion.div>
          </div>

          {promotions.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}
        </motion.div>

        {/* Dots */}
        {promotions.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  index === currentIndex
                    ? "bg-primary-foreground w-6"
                    : "bg-primary-foreground/40"
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

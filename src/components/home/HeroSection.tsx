import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock } from 'lucide-react';
import { useActivePromotions } from '@/hooks/usePromotions';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const HeroSection: React.FC = () => {
  const { data: promotions } = useActivePromotions();
  const { data: settings } = useStoreSettings();

  const activePromo = promotions?.[0];

  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
        />
      </div>

      <div className="container relative py-20 md:py-32">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Store Status */}
            {settings && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge
                  variant={settings.is_open ? "default" : "destructive"}
                  className="text-sm py-1 px-3"
                >
                  <Clock className="mr-1 h-3 w-3" />
                  {settings.is_open ? 'We are Open!' : 'Currently Closed'}
                  {settings.use_scheduled_hours && settings.is_open && (
                    <span className="ml-2 opacity-75">
                      Until {settings.closing_time}
                    </span>
                  )}
                </Badge>
              </motion.div>
            )}

            {/* Promo Banner */}
            {activePromo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2 text-sm font-medium"
              >
                <span className="animate-pulse">🔥</span>
                {activePromo.title} - {activePromo.discount_percentage}% OFF!
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            >
              Crispy, Juicy{' '}
              <span className="text-primary">Fried Chicken</span>
              <br />
              Made Fresh Daily
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-muted-foreground max-w-md"
            >
              Experience the perfect crunch with our signature fried chicken. 
              Made with love, served with joy at Viewland Zone II.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" onClick={scrollToMenu} className="group">
                View Menu
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <a
                href={`https://wa.me/${settings?.whatsapp_primary?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="bg-green-50 border-green-600 text-green-700 hover:bg-green-100">
                  📞 Call to Order
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-square">
              {/* Decorative rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-4 border-dashed border-primary/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 rounded-full border-4 border-dashed border-secondary/20"
              />
              
              {/* Main image container */}
              <div className="absolute inset-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden shadow-2xl">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-9xl"
                >
                  🍗
                </motion.div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-10 right-10 text-4xl"
              >
                🍟
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0], x: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute bottom-20 left-5 text-4xl"
              >
                🍔
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-10 right-20 text-3xl"
              >
                🥤
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

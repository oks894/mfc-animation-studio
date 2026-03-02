import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock } from 'lucide-react';
import { useActivePromotions } from '@/hooks/usePromotions';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const HeroSection: React.FC = () => {
  const { data: promotions } = useActivePromotions();
  const { data: settings } = useStoreSettings();
  const { scrollYProgress } = useScroll();
  
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);

  const activePromo = promotions?.[0];

  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Floating food emojis with parallax
  const floatingItems = ['🍗', '🍟', '🍔', '🥤', '🌶️', '🍗'];

  return (
    <motion.section 
      style={{ y: heroY, opacity: heroOpacity }}
      className="relative min-h-[90vh] flex items-center overflow-hidden"
    >
      {/* Dark cinematic gradient background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, hsl(0 70% 15%) 0%, hsl(0 50% 8%) 40%, hsl(0 0% 5%) 100%)',
      }} />

      {/* Radial light bloom */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(0 60% 30% / 0.3) 0%, hsl(0 50% 15% / 0.1) 50%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Smoke/steam particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`smoke-${i}`}
          animate={{
            y: [0, -200],
            opacity: [0, 0.15, 0],
            scale: [0.8, 2],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            delay: i * 1.2,
            ease: 'easeOut',
          }}
          className="absolute w-32 h-48 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            bottom: '10%',
            background: 'radial-gradient(ellipse, hsl(0 0% 100% / 0.08) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />
      ))}

      {/* Floating food emojis with parallax */}
      {floatingItems.map((emoji, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20 - i * 5, 0],
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
            rotate: [0, i % 2 === 0 ? 10 : -10, 0],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
          className="absolute text-3xl md:text-5xl select-none opacity-20 md:opacity-30"
          style={{
            left: `${10 + i * 15}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
        >
          {emoji}
        </motion.div>
      ))}

      <div className="container relative z-10 py-20 md:py-32">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="space-y-8">
            {/* Live open/close badge */}
            {settings && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              >
                <Badge
                  variant={settings.is_open ? "default" : "destructive"}
                  className="text-sm py-2 px-5 shadow-lg gap-2"
                >
                  {settings.is_open && (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                    </span>
                  )}
                  <Clock className="h-3.5 w-3.5" />
                  {settings.is_open ? 'We are Open!' : 'Currently Closed'}
                  {settings.use_scheduled_hours && settings.is_open && (
                    <span className="ml-1 opacity-75">Until {settings.closing_time}</span>
                  )}
                </Badge>
              </motion.div>
            )}

            {/* Promo */}
            {activePromo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-5 py-2.5 text-sm font-medium backdrop-blur-sm border border-primary/30 text-white"
              >
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>🔥</motion.span>
                {activePromo.title} - {activePromo.discount_percentage}% OFF!
              </motion.div>
            )}

            {/* Headline - animated text */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              <motion.span
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="block"
              >
                Crispy, Juicy
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.8 }}
                className="block text-primary drop-shadow-[0_0_30px_hsl(0_70%_40%/0.6)]"
              >
                Fried Chicken
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="block text-3xl md:text-4xl lg:text-5xl font-medium text-white/70 mt-2"
              >
                Made Fresh Daily
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.8 }}
              className="text-lg text-white/60 max-w-md"
            >
              Experience the perfect crunch with our signature fried chicken. 
              Made with love, served with joy at Viewland Zone II.
            </motion.p>

            {/* CTA buttons with hover glow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" onClick={scrollToMenu} className="group shadow-brand text-base px-8 py-6">
                  View Menu
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <a
                  href={`https://wa.me/${settings?.whatsapp_primary?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300 text-base px-8 py-6">
                    📞 Call to Order
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Hero visual - large chicken with glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="relative hidden md:block"
          >
            <div className="relative aspect-square">
              {/* Crimson glow behind */}
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-16 rounded-full"
                style={{
                  background: 'radial-gradient(circle, hsl(0 70% 35% / 0.4) 0%, transparent 70%)',
                  filter: 'blur(60px)',
                }}
              />
              
              {/* Decorative rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-8 rounded-full border border-dashed border-primary/10"
              />
              
              {/* Main food emoji */}
              <motion.div 
                className="absolute inset-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shadow-crimson-glow"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-[120px] select-none">🍗</span>
              </motion.div>

              {/* Side food items */}
              <motion.div animate={{ y: [0, -15, 0], x: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-8 right-8 text-5xl select-none drop-shadow-2xl">🍟</motion.div>
              <motion.div animate={{ y: [0, 12, 0], x: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute bottom-20 left-4 text-5xl select-none drop-shadow-2xl">🍔</motion.div>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} className="absolute bottom-8 right-16 text-4xl select-none drop-shadow-2xl">🥤</motion.div>

              {/* Ember particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [20, -80],
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.4,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    left: `${35 + i * 6}%`,
                    bottom: '25%',
                    background: 'hsl(0 70% 50%)',
                    boxShadow: '0 0 8px hsl(0 70% 50% / 0.6)',
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;

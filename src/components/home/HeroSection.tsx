import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock } from 'lucide-react';
import { useActivePromotions } from '@/hooks/usePromotions';
import { useStoreSettings } from '@/hooks/useStoreSettings';

// Word reveal component for cinematic text animation
const WordReveal: React.FC<{ text: string; delay?: number; className?: string }> = ({ 
  text, 
  delay = 0, 
  className = '' 
}) => {
  const words = text.split(' ');
  
  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: delay + index * 0.15,
            ease: [0.19, 1, 0.22, 1]
          }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

const HeroSection: React.FC = () => {
  const { data: promotions } = useActivePromotions();
  const { data: settings } = useStoreSettings();
  const { scrollYProgress } = useScroll();
  
  // Parallax effects based on scroll
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  const activePromo = promotions?.[0];

  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.section 
      style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
      className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10"
    >
      {/* Ambient Heat Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Warm bloom center */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(35 100% 50% / 0.08) 0%, hsl(15 90% 40% / 0.04) 50%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        
        {/* Animated warm gradients */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-secondary/20 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-primary/15 blur-3xl"
        />
        
        {/* Subtle steam rising */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-8">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -120],
                opacity: [0, 0.15, 0],
                scale: [0.8, 1.2],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.8,
                ease: 'easeOut',
              }}
              className="w-16 h-32 rounded-full bg-foreground/5 blur-xl"
            />
          ))}
        </div>
      </div>

      <div className="container relative py-24 md:py-36">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Content */}
          <div className="space-y-6">
            {/* Store Status */}
            {settings && (
              <motion.div
                initial={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              >
                <Badge
                  variant={settings.is_open ? "default" : "destructive"}
                  className="text-sm py-1.5 px-4 shadow-lg"
                >
                  <Clock className="mr-1.5 h-3.5 w-3.5" />
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
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-5 py-2.5 text-sm font-medium backdrop-blur-sm border border-secondary/30"
              >
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🔥
                </motion.span>
                {activePromo.title} - {activePromo.discount_percentage}% OFF!
              </motion.div>
            )}

            {/* Headline with word-by-word reveal */}
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <WordReveal text="Crispy, Juicy" delay={0.6} />
              <br />
              <span className="text-primary">
                <WordReveal text="Fried Chicken" delay={0.9} />
              </span>
              <br />
              <WordReveal text="Made Fresh Daily" delay={1.2} />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 1.6, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="text-lg text-muted-foreground max-w-md"
            >
              Experience the perfect crunch with our signature fried chicken. 
              Made with love, served with joy at Viewland Zone II.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="flex flex-wrap gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              >
                <Button size="lg" onClick={scrollToMenu} className="group shadow-brand">
                  View Menu
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              >
                <a
                  href={`https://wa.me/${settings?.whatsapp_primary?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="outline" className="bg-green-50 border-green-600 text-green-700 hover:bg-green-100 shadow-lg">
                    📞 Call to Order
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Hero Image - Cinematic Reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="relative"
          >
            <div className="relative aspect-square">
              {/* Oil shine sweep effect */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 2, delay: 1.5, ease: [0.19, 1, 0.22, 1] }}
                className="absolute inset-0 z-20 w-1/4 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
              />
              
              {/* Decorative rings with slow confident rotation */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-primary/15"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 rounded-full border-2 border-dashed border-secondary/15"
              />
              
              {/* Main image container with depth */}
              <motion.div 
                className="absolute inset-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden shadow-warm-glow"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-9xl select-none">🍗</span>
              </motion.div>

              {/* Floating food elements with weighted motion */}
              <motion.div
                animate={{ y: [0, -12, 0], x: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-10 right-10 text-4xl select-none drop-shadow-lg"
              >
                🍟
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0], x: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-20 left-5 text-4xl select-none drop-shadow-lg"
              >
                🍔
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5, ease: 'easeInOut' }}
                className="absolute bottom-10 right-20 text-3xl select-none drop-shadow-lg"
              >
                🥤
              </motion.div>
              
              {/* Ember particles around food */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [20, -60],
                    x: [0, (i % 2 === 0 ? 15 : -15)],
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    left: `${40 + i * 8}%`,
                    bottom: '30%',
                    background: 'hsl(35 100% 55%)',
                    boxShadow: '0 0 8px hsl(35 100% 50% / 0.6)',
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

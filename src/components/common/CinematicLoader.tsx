import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicLoaderProps {
  onComplete: () => void;
  minDuration?: number;
}

const CinematicLoader: React.FC<CinematicLoaderProps> = ({ 
  onComplete, 
  minDuration = 2500 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Start content reveal after initial darkness
    const contentTimer = setTimeout(() => setShowContent(true), 300);
    
    // Complete loader after minimum duration
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 600); // Wait for exit animation
    }, minDuration);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(completeTimer);
    };
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{ background: 'hsl(0 0% 5%)' }}
        >
          {/* Grain Texture */}
          <div 
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Ember Particles */}
          {showContent && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 0, 
                    y: '100%',
                    x: `${20 + Math.random() * 60}%`,
                    scale: 0.5 + Math.random() * 0.5
                  }}
                  animate={{ 
                    opacity: [0, 1, 0.5, 0], 
                    y: [100, -100],
                    x: `${20 + Math.random() * 60}%`
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 1.5,
                    ease: 'easeOut',
                    repeat: Infinity
                  }}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ 
                    background: `hsl(${25 + Math.random() * 20} 90% ${50 + Math.random() * 20}%)`,
                    boxShadow: `0 0 ${4 + Math.random() * 4}px hsl(35 100% 50% / 0.6)`
                  }}
                />
              ))}
            </div>
          )}

          {/* Central Warm Bloom */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={showContent ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(35 100% 50% / 0.15) 0%, hsl(15 90% 40% / 0.08) 40%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />

          {/* Rising Steam */}
          {showContent && (
            <div className="absolute inset-0 flex justify-center">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 100, scale: 0.8 }}
                  animate={{ 
                    opacity: [0, 0.3, 0], 
                    y: [-50, -250],
                    scale: [0.8, 1.5]
                  }}
                  transition={{ 
                    duration: 3,
                    delay: 0.5 + i * 0.3,
                    ease: 'easeOut',
                    repeat: Infinity
                  }}
                  className="absolute bottom-1/3 w-20 h-40 rounded-full"
                  style={{
                    left: `${35 + i * 8}%`,
                    background: 'radial-gradient(ellipse, hsl(0 0% 100% / 0.1) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                  }}
                />
              ))}
            </div>
          )}

          {/* Logo Reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, filter: 'blur(10px)' }}
            animate={showContent ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Oil Shine Effect */}
            <div className="relative overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={showContent ? { x: '200%' } : {}}
                transition={{ duration: 1.5, delay: 1.2, ease: [0.19, 1, 0.22, 1] }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
              
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-ember">
                <span className="text-4xl font-bold">M</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={showContent ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.19, 1, 0.22, 1] }}
              className="mt-6 text-center"
            >
              <h1 className="text-3xl font-bold text-primary">MFC</h1>
              <p className="mt-1 text-sm text-muted-foreground">Makyo Fried Chicken</p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
              className="mt-8 h-0.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full"
              style={{ maxWidth: '120px' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicLoader;

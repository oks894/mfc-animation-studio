import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Phone, Clock } from 'lucide-react';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const Footer: React.FC = () => {
  const { data: settings } = useStoreSettings();
  const { scrollYProgress } = useScroll();
  
  // Slow down motion as footer approaches
  const footerY = useTransform(scrollYProgress, [0.8, 1], [50, 0]);
  const footerOpacity = useTransform(scrollYProgress, [0.85, 1], [0.5, 1]);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.footer
      style={{ y: footerY, opacity: footerOpacity }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="border-t bg-gradient-to-b from-muted/30 to-muted/70 relative overflow-hidden"
    >
      {/* Ambient warm glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-32 -bottom-32 w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -right-32 -bottom-32 w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--secondary) / 0.1) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="container py-12 relative z-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="flex items-center gap-2 mb-4">
              <motion.div 
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-brand"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-xl font-bold">M</span>
              </motion.div>
              <div>
                <span className="text-lg font-bold text-primary">MFC</span>
                <p className="text-xs text-muted-foreground">Makyo Fried Chicken</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Crispy, juicy, and full of flavor! Your favorite fried chicken, made with love.
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div 
            id="contact"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          >
            <h3 className="mb-4 font-semibold">Contact Us</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <motion.div 
                className="flex items-start gap-2 group"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.3 }}
              >
                <MapPin className="h-4 w-4 mt-0.5 text-primary transition-transform group-hover:scale-110" />
                <span className="group-hover:text-foreground transition-colors">Viewland Zone II</span>
              </motion.div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <motion.a 
                    href={`tel:${settings?.whatsapp_primary}`} 
                    className="hover:text-primary transition-colors duration-300"
                    whileHover={{ x: 4 }}
                  >
                    {settings?.whatsapp_primary || '+91 97740 46387'}
                  </motion.a>
                  <motion.a 
                    href={`tel:${settings?.whatsapp_secondary}`} 
                    className="hover:text-primary transition-colors duration-300"
                    whileHover={{ x: 4 }}
                  >
                    {settings?.whatsapp_secondary || '+91 9366372647'}
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          >
            <h3 className="mb-4 font-semibold">Hours</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>
                  {settings?.opening_time || '09:00'} - {settings?.closing_time || '21:00'}
                </span>
              </div>
              {settings?.open_days && (
                <div className="flex gap-1.5 flex-wrap">
                  {dayNames.map((day, index) => (
                    <motion.span
                      key={day}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-300 ${
                        settings.open_days.includes(index)
                          ? 'bg-primary/15 text-primary'
                          : 'bg-muted text-muted-foreground/50'
                      }`}
                    >
                      {day}
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-10 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground space-y-2"
        >
          <motion.p
            animate={{ scale: [1, 1.005, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            © 2026 MFC - Makyo Fried Chicken. All rights reserved.
          </motion.p>
          <p className="text-xs opacity-70">Developed By Jihal Shimray eX Holdings PVT LTD.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;

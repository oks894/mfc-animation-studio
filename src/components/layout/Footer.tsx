import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Phone, Clock } from 'lucide-react';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const Footer: React.FC = () => {
  const { data: settings } = useStoreSettings();
  const { scrollYProgress } = useScroll();
  const footerY = useTransform(scrollYProgress, [0.8, 1], [50, 0]);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.footer
      className="border-t relative overflow-hidden"
      style={{ y: footerY, background: 'linear-gradient(180deg, hsl(0 0% 6%) 0%, hsl(0 30% 5%) 100%)' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -left-32 -bottom-32 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
      </div>

      <div className="container py-12 relative z-10">
        <div className="grid gap-8 md:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-crimson-glow">
                <span className="text-xl font-bold">M</span>
              </div>
              <div>
                <span className="text-lg font-bold text-primary">MFC</span>
                <p className="text-xs text-white/50">Makyo Fried Chicken</p>
              </div>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              Crispy, juicy, and full of flavor! Your favorite fried chicken, made with love.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h3 className="mb-4 font-semibold text-white">Contact Us</h3>
            <div className="space-y-3 text-sm text-white/50">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>Viewland Zone II</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <a href={`tel:${settings?.whatsapp_primary}`} className="hover:text-primary transition-colors">{settings?.whatsapp_primary || '+91 97740 46387'}</a>
                  <a href={`tel:${settings?.whatsapp_secondary}`} className="hover:text-primary transition-colors">{settings?.whatsapp_secondary || '+91 9366372647'}</a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h3 className="mb-4 font-semibold text-white">Hours</h3>
            <div className="space-y-3 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{settings?.opening_time || '09:00'} - {settings?.closing_time || '21:00'}</span>
              </div>
              {settings?.open_days && (
                <div className="flex gap-1.5 flex-wrap">
                  {dayNames.map((day, index) => (
                    <span
                      key={day}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                        settings.open_days.includes(index)
                          ? 'bg-primary/20 text-primary'
                          : 'bg-white/5 text-white/30'
                      }`}
                    >
                      {day}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 text-center text-sm text-white/30 space-y-2">
          <p>© 2026 MFC - Makyo Fried Chicken. All rights reserved.</p>
          <p className="text-xs opacity-70">Developed By Jihal Shimray eX Holdings PVT LTD.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;

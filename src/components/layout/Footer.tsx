import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock } from 'lucide-react';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const Footer: React.FC = () => {
  const { data: settings } = useStoreSettings();

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="border-t bg-muted/50"
    >
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-xl font-bold">M</span>
              </div>
              <div>
                <span className="text-lg font-bold text-primary">MFC</span>
                <p className="text-xs text-muted-foreground">Makyo Fried Chicken</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Crispy, juicy, and full of flavor! Your favorite fried chicken, made with love.
            </p>
          </div>

          {/* Contact */}
          <div id="contact">
            <h3 className="mb-4 font-semibold">Contact Us</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>Viewland Zone II</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <a href={`tel:${settings?.whatsapp_primary}`} className="hover:text-primary">
                    {settings?.whatsapp_primary || '+91 97740 46387'}
                  </a>
                  <a href={`tel:${settings?.whatsapp_secondary}`} className="hover:text-primary">
                    {settings?.whatsapp_secondary || '+91 9366372647'}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="mb-4 font-semibold">Hours</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>
                  {settings?.opening_time || '09:00'} - {settings?.closing_time || '21:00'}
                </span>
              </div>
              {settings?.open_days && (
                <div className="flex gap-1 flex-wrap">
                  {dayNames.map((day, index) => (
                    <span
                      key={day}
                      className={`px-2 py-1 rounded text-xs ${
                        settings.open_days.includes(index)
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground/50'
                      }`}
                    >
                      {day}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground space-y-1">
          <p>© 2026 MFC - Makyo Fried Chicken. All rights reserved.</p>
          <p className="text-xs">Developed By Jihal Shimray eX Holdings PVT LTD.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;

import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, Clock, Phone } from 'lucide-react';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { Button } from '@/components/ui/button';

const StoreClosedBanner: React.FC = () => {
  const { data: settings } = useStoreSettings();

  // Calculate if store is actually open based on schedule
  const isStoreCurrentlyOpen = React.useMemo(() => {
    if (!settings) return true;
    if (!settings.is_open) return false;
    if (!settings.use_scheduled_hours) return settings.is_open;

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5);

    const isDayOpen = settings.open_days.includes(currentDay);
    const isWithinHours = currentTime >= settings.opening_time && currentTime <= settings.closing_time;

    return isDayOpen && isWithinHours;
  }, [settings]);

  if (!settings || isStoreCurrentlyOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-destructive/10 border-b border-destructive/20"
    >
      <div className="container py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            <span className="font-medium">Store is Currently Closed</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {settings.use_scheduled_hours && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Opens at {settings.opening_time}</span>
              </div>
            )}
            <a
              href={`https://wa.me/${settings.whatsapp_primary?.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-1">
                <Phone className="h-3 w-3" />
                Contact Us
              </Button>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StoreClosedBanner;

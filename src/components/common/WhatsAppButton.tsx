import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useStoreSettings } from '@/hooks/useStoreSettings';

const WhatsAppButton: React.FC = () => {
  const { data: settings } = useStoreSettings();

  const whatsappNumber = settings?.whatsapp_primary?.replace(/[^0-9]/g, '') || '919774046387';

  return (
    <motion.a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors"
    >
      <MessageCircle className="h-7 w-7" />
      
      {/* Pulse animation */}
      <span className="absolute -inset-1 rounded-full bg-green-500/30 animate-ping" />
    </motion.a>
  );
};

export default WhatsAppButton;

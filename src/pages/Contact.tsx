import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { Skeleton } from '@/components/ui/skeleton';
import FilmGrain from '@/components/common/FilmGrain';

const Contact: React.FC = () => {
  const { data: content, isLoading } = useSiteContent('contact');
  const { data: settings } = useStoreSettings();

  const contactContent = content as {
    title: string;
    content: string;
    address: string | null;
    email: string | null;
    phone_1: string | null;
    phone_2: string | null;
    map_embed_url: string | null;
    image_url: string | null;
  } | undefined;

  const contactInfo = [
    {
      icon: MapPin,
      label: 'Address',
      value: contactContent?.address || 'Viewland Zone II',
      delay: 0.1,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: contactContent?.phone_1 || settings?.whatsapp_primary || '+91 97740 46387',
      href: `tel:${contactContent?.phone_1 || settings?.whatsapp_primary}`,
      delay: 0.2,
    },
    {
      icon: Phone,
      label: 'Alternate',
      value: contactContent?.phone_2 || settings?.whatsapp_secondary || '+91 9366372647',
      href: `tel:${contactContent?.phone_2 || settings?.whatsapp_secondary}`,
      delay: 0.3,
    },
    {
      icon: Mail,
      label: 'Email',
      value: contactContent?.email || 'contact@mfc.com',
      href: `mailto:${contactContent?.email || 'contact@mfc.com'}`,
      delay: 0.4,
    },
    {
      icon: Clock,
      label: 'Hours',
      value: `${settings?.opening_time || '09:00'} - ${settings?.closing_time || '21:00'}`,
      delay: 0.5,
    },
  ];

  const whatsappNumber = (settings?.whatsapp_primary || '+919774046387').replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FilmGrain opacity={0.06} />
      
      {/* Warm ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(var(--secondary) / 0.2) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Menu
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-16 relative z-10">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          {isLoading ? (
            <>
              <Skeleton className="h-16 w-64 mx-auto mb-6" />
              <Skeleton className="h-6 w-full max-w-xl mx-auto" />
            </>
          ) : (
            <>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"
              >
                {contactContent?.title || 'Contact Us'}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
                className="text-lg md:text-xl text-muted-foreground leading-relaxed"
              >
                {contactContent?.content || 'We would love to hear from you!'}
              </motion.p>
            </>
          )}
        </motion.section>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            {contactInfo.map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: item.delay,
                  ease: [0.19, 1, 0.22, 1] 
                }}
                whileHover={{ x: 8, scale: 1.02 }}
                className="group p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 hover:border-primary/30 transition-all duration-500"
              >
                <div className="flex items-start gap-4">
                  <div className="relative p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <item.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                    {/* Glow on hover */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)',
                        filter: 'blur(8px)',
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                    {item.href ? (
                      <a 
                        href={item.href}
                        className="text-lg font-medium hover:text-primary transition-colors duration-300"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-lg font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* WhatsApp CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="pt-4"
            >
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hi! I'd like to place an order.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="w-full shadow-lg gap-2"
                  style={{ backgroundColor: 'hsl(142 76% 36%)', color: 'white' }}
                >
                  <MessageCircle className="h-5 w-5" />
                  Chat on WhatsApp
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square lg:aspect-auto lg:h-full min-h-[400px]"
          >
            {contactContent?.map_embed_url ? (
              <iframe
                src={contactContent.map_embed_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Store Location"
                className="absolute inset-0"
              />
            ) : (
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Map coming soon</p>
                </div>
              </div>
            )}
            {/* Warm overlay on map */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, hsl(var(--background) / 0.3), transparent 30%)',
              }}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Contact;

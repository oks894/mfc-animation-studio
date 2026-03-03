import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Snowflake, Truck, Heart } from 'lucide-react';

const values = [
  { icon: Flame, title: 'Secret Spice Blend', desc: 'Our signature mix of 12 hand-selected spices creates a flavor you won\'t find anywhere else.' },
  { icon: Snowflake, title: 'Fresh, Never Frozen', desc: 'Every piece is prepared fresh daily with locally sourced, premium-quality chicken.' },
  { icon: Truck, title: 'Fast & Hot Delivery', desc: 'From our kitchen to your table in minutes — always crispy, always hot.' },
  { icon: Heart, title: 'Family Recipe', desc: 'A treasured recipe passed down since day one, made with love every single time.' },
];

const WhyChooseSection: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, hsl(var(--brand-gold)) 0%, transparent 70%)',
            filter: 'blur(120px)',
          }}
        />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Why Choose <span className="text-gradient-gold">MFC</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            We don't just serve chicken — we serve an experience.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 text-center transition-all duration-500 hover:border-[hsl(var(--brand-gold)/0.3)]"
              style={{
                boxShadow: 'inset 0 1px 0 0 hsl(0 0% 100% / 0.03)',
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at center, hsl(var(--brand-gold) / 0.06) 0%, transparent 70%)',
                }}
              />

              <div className="relative mb-4 mx-auto w-14 h-14 rounded-xl flex items-center justify-center bg-card border border-border/50 group-hover:border-[hsl(var(--brand-gold)/0.3)] transition-colors duration-500">
                <item.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;

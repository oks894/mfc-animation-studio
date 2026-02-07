import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Heart, Flame, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSiteContent } from '@/hooks/useSiteContent';
import { Skeleton } from '@/components/ui/skeleton';
import FilmGrain from '@/components/common/FilmGrain';

const features = [
  { icon: Flame, label: 'Authentic Recipes', delay: 0.2 },
  { icon: Heart, label: 'Made with Love', delay: 0.3 },
  { icon: Award, label: 'Premium Quality', delay: 0.4 },
  { icon: Users, label: 'Family Tradition', delay: 0.5 },
];

const About: React.FC = () => {
  const { data: content, isLoading } = useSiteContent('about');
  const { scrollYProgress } = useScroll();
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);

  const aboutContent = content as { title: string; content: string; image_url: string | null } | undefined;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FilmGrain opacity={0.06} />
      
      {/* Warm ambient background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, hsl(var(--secondary) / 0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </motion.div>

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
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-4xl mx-auto text-center mb-20"
          style={{ opacity: textOpacity }}
        >
          {isLoading ? (
            <>
              <Skeleton className="h-16 w-80 mx-auto mb-6" />
              <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
            </>
          ) : (
            <>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent"
              >
                {aboutContent?.title || 'About Us'}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
                className="text-lg md:text-xl text-muted-foreground leading-relaxed"
              >
                {aboutContent?.content || 'Welcome to MFC - where tradition meets taste.'}
              </motion.p>
            </>
          )}
        </motion.section>

        {/* Featured Image with Parallax */}
        {aboutContent?.image_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
            style={{ scale: imageScale }}
            className="relative aspect-video max-w-4xl mx-auto mb-20 rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src={aboutContent.image_url}
              alt="About MFC"
              className="w-full h-full object-cover"
            />
            {/* Warm overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </motion.div>
        )}

        {/* Features Grid with Stroke-Draw Icons */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                delay: feature.delay,
                ease: [0.19, 1, 0.22, 1] 
              }}
              whileHover={{ y: -8 }}
              className="flex flex-col items-center text-center group"
            >
              <motion.div
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: feature.delay + 0.2 }}
                className="relative mb-4 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-500"
              >
                <feature.icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)',
                    filter: 'blur(10px)',
                  }}
                />
              </motion.div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                {feature.label}
              </span>
            </motion.div>
          ))}
        </motion.section>

        {/* Story Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-3xl mx-auto mt-24 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            From humble beginnings to becoming your neighborhood's favorite fried chicken spot, 
            MFC has always been about one thing: serving the crispiest, juiciest fried chicken 
            that brings families together. Every piece is made with our secret blend of spices 
            and cooked to golden perfection.
          </p>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mt-16"
        >
          <Link to="/">
            <Button size="lg" className="shadow-brand">
              Order Now
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default About;

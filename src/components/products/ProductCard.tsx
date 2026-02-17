import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product, Category } from '@/types/database';
import { useCart } from '@/contexts/CartContext';
import { useActivePromotions } from '@/hooks/usePromotions';

interface ProductCardProps {
  product: Product & { category?: Category | null };
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addItem } = useCart();
  const { data: promotions } = useActivePromotions();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageCount = product.images?.length || 0;

  const activeDiscount = promotions?.find(
    p => p.applies_to_all || p.product_ids?.includes(product.id)
  );
  const discountPercentage = activeDiscount?.discount_percentage || 0;
  const discountedPrice = product.price * (1 - discountPercentage / 100);

  const handleAddToCart = () => {
    if (product.in_stock && !isAdding) {
      setIsAdding(true);
      addItem(product);
      
      // Reset after animation
      setTimeout(() => setIsAdding(false), 600);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.8, 
        ease: [0.19, 1, 0.22, 1] 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-xl border bg-card transition-all duration-700 ease-cinematic"
      style={{
        boxShadow: isHovered 
          ? '0 25px 50px -12px hsl(25 95% 55% / 0.2), 0 0 30px hsl(45 100% 50% / 0.1)'
          : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
      }}
    >
      {/* Warm glow effect on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="absolute -inset-1 rounded-xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, hsl(35 100% 50% / 0.15) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.images && product.images.length > 0 ? (
          <>
            <motion.img
              key={currentImageIndex}
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="h-full w-full object-cover"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform 0.7s cubic-bezier(0.19, 1, 0.22, 1)',
              }}
            />
            {/* Image navigation arrows */}
            {imageCount > 1 && isHovered && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => (i - 1 + imageCount) % imageCount); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 backdrop-blur-sm rounded-full p-1 shadow-md hover:bg-background/90 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => (i + 1) % imageCount); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/70 backdrop-blur-sm rounded-full p-1 shadow-md hover:bg-background/90 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
            {/* Dot indicators */}
            {imageCount > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                    className={`w-2 h-2 rounded-full transition-colors ${i === currentImageIndex ? 'bg-primary' : 'bg-background/60'}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <motion.div 
            className="flex h-full w-full items-center justify-center text-6xl select-none"
            animate={{ scale: isHovered ? 1.06 : 1 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          >
            🍗
          </motion.div>
        )}

        {/* Oil shine sweep on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Ember sparks on hover */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    y: 20, 
                    x: 20 + i * 30, 
                    opacity: 0,
                    scale: 0 
                  }}
                  animate={{ 
                    y: -40, 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0.5]
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.15,
                    ease: 'easeOut',
                  }}
                  className="absolute bottom-8 w-1 h-1 rounded-full pointer-events-none"
                  style={{
                    background: 'hsl(35 100% 55%)',
                    boxShadow: '0 0 6px hsl(35 100% 50% / 0.8)',
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <motion.div
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="absolute left-3 top-3"
          >
            <Badge className="bg-primary text-primary-foreground font-bold shadow-lg">
              -{discountPercentage}%
            </Badge>
          </motion.div>
        )}

        {/* Out of Stock Overlay */}
        {!product.in_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Badge variant="destructive" className="text-sm shadow-lg">
              Out of Stock
            </Badge>
          </div>
        )}

        {/* Add to Cart Button (slides up on hover) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            y: isHovered ? 0 : 30 
          }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/70 to-transparent p-4"
        >
          <motion.div
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className="w-full shadow-lg"
              size="sm"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4 relative">
        {product.category && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            {product.category.name}
          </motion.span>
        )}
        <h3 className="mt-1 font-semibold line-clamp-1">{product.name}</h3>
        {product.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <motion.span 
              key={discountedPrice}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-bold text-primary"
            >
              ₹{discountedPrice.toFixed(2)}
            </motion.span>
            {discountPercentage > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>

          <motion.div 
            whileHover={{ scale: 1.08 }} 
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
          >
            <Button
              variant="secondary"
              size="icon"
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className="h-9 w-9 shadow-md"
            >
              <motion.div
                animate={isAdding ? { rotate: [0, 15, -15, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <Plus className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

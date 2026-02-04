import React from 'react';
import { motion } from 'framer-motion';
import { Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product, Category } from '@/types/database';
import { useCart } from '@/contexts/CartContext';
import { useActivePromotions } from '@/hooks/usePromotions';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product & { category?: Category | null };
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addItem } = useCart();
  const { data: promotions } = useActivePromotions();

  const activeDiscount = promotions?.find(
    p => p.applies_to_all || p.product_ids?.includes(product.id)
  );
  const discountPercentage = activeDiscount?.discount_percentage || 0;
  const discountedPrice = product.price * (1 - discountPercentage / 100);

  const handleAddToCart = () => {
    if (product.in_stock) {
      addItem(product);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-card-hover"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.images?.[0] ? (
          <motion.img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-6xl">
            🍗
          </div>
        )}

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute left-3 top-3"
          >
            <Badge className="bg-primary text-primary-foreground font-bold">
              -{discountPercentage}%
            </Badge>
          </motion.div>
        )}

        {/* Out of Stock Overlay */}
        {!product.in_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Badge variant="destructive" className="text-sm">
              Out of Stock
            </Badge>
          </div>
        )}

        {/* Add to Cart Button (Hover) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Button
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            className="w-full"
            size="sm"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        {product.category && (
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {product.category.name}
          </span>
        )}
        <h3 className="mt-1 font-semibold line-clamp-1">{product.name}</h3>
        {product.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              ₹{discountedPrice.toFixed(2)}
            </span>
            {discountPercentage > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className="h-9 w-9"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

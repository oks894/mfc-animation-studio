import React from 'react';
import { motion } from 'framer-motion';
import { Home, UtensilsCrossed, ShoppingCart, Phone, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useIsMobile } from '@/hooks/use-mobile';

const tabs = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: UtensilsCrossed, label: 'Menu', path: '/shop' },
  { icon: ShoppingCart, label: 'Cart', path: '__cart__' },
  { icon: Search, label: 'Track', path: '/track-order' },
  { icon: Phone, label: 'Contact', path: '/contact' },
];

const BottomTabBar: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems, setIsCartOpen } = useCart();

  if (!isMobile) return null;

  const handleTabPress = (path: string) => {
    if (path === '__cart__') {
      setIsCartOpen(true);
    } else {
      navigate(path);
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'hsl(0 0% 6% / 0.95)',
        backdropFilter: 'blur(24px) saturate(180%)',
        borderTop: '1px solid hsl(0 0% 100% / 0.06)',
        paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="flex items-center justify-around px-1 pt-1.5 pb-0.5">
        {tabs.map((tab) => {
          const isActive = tab.path !== '__cart__' && location.pathname === tab.path;
          const isCart = tab.path === '__cart__';

          return (
            <button
              key={tab.label}
              onClick={() => handleTabPress(tab.path)}
              className="relative flex flex-col items-center justify-center flex-1 py-1 gap-0.5 transition-colors"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1.5 w-5 h-0.5 rounded-full"
                  style={{ background: 'hsl(var(--brand-gold))' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              <div className="relative">
                <tab.icon
                  className="transition-colors duration-200"
                  style={{
                    width: 22,
                    height: 22,
                    color: isActive
                      ? 'hsl(var(--brand-gold))'
                      : isCart && totalItems > 0
                        ? 'hsl(var(--primary))'
                        : 'hsl(0 0% 45%)',
                  }}
                />
                {isCart && totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </div>

              <span
                className="text-[10px] font-medium transition-colors duration-200"
                style={{
                  color: isActive ? 'hsl(var(--brand-gold))' : 'hsl(0 0% 45%)',
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomTabBar;

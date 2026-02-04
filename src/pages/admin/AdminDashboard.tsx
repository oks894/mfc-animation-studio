import React from 'react';
import { motion } from 'framer-motion';
import { Package, Tag, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { usePromotions, useActivePromotions } from '@/hooks/usePromotions';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Badge } from '@/components/ui/badge';

const AdminDashboard: React.FC = () => {
  const { data: products } = useProducts();
  const { data: promotions } = usePromotions();
  const { data: activePromotions } = useActivePromotions();
  const { data: settings } = useStoreSettings();

  const stats = [
    {
      title: 'Total Products',
      value: products?.length || 0,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'In Stock',
      value: products?.filter(p => p.in_stock).length || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: 'Active Promotions',
      value: activePromotions?.length || 0,
      icon: Tag,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
    {
      title: 'Store Status',
      value: settings?.is_open ? 'Open' : 'Closed',
      icon: DollarSign,
      color: settings?.is_open ? 'text-green-600' : 'text-red-600',
      bg: settings?.is_open ? 'bg-green-100' : 'bg-red-100',
    },
  ];

  return (
    <AdminSidebar>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to MFC Admin Panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-full p-2 ${stat.bg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Info */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Products */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {products?.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <span>🍗</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">₹{product.price}</p>
                      </div>
                    </div>
                    <Badge variant={product.in_stock ? "default" : "destructive"}>
                      {product.in_stock ? 'In Stock' : 'Out'}
                    </Badge>
                  </div>
                ))}
                {(!products || products.length === 0) && (
                  <p className="text-muted-foreground text-sm">No products yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Promotions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Promotions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activePromotions?.map((promo) => (
                  <div key={promo.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{promo.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {promo.applies_to_all ? 'All Products' : 'Selected Products'}
                      </p>
                    </div>
                    <Badge className="bg-secondary text-secondary-foreground">
                      {promo.discount_percentage}% OFF
                    </Badge>
                  </div>
                ))}
                {(!activePromotions || activePromotions.length === 0) && (
                  <p className="text-muted-foreground text-sm">No active promotions</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminSidebar>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Heart, Package, LogOut, Plus, Trash2, Edit2, Check, Gift, Star, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useLoyaltyPoints, useLoyaltyTransactions, useReferralCode } from '@/hooks/useLoyalty';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomTabBar from '@/components/common/BottomTabBar';

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  items: any;
  customer_name: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, refreshProfile, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const { data: loyalty } = useLoyaltyPoints();
  const { data: loyaltyTx } = useLoyaltyTransactions();
  const { data: referral } = useReferralCode();

  useEffect(() => {
    if (!loading && !user) navigate('/auth', { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    // Fetch user orders
    supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setOrders((data as Order[]) || []));

    // Fetch favorites with product details
    supabase
      .from('favorite_items')
      .select('*, products(*)')
      .eq('user_id', user.id)
      .then(({ data }) => setFavorites(data || []));
  }, [user]);

  useEffect(() => {
    if (profile) setNameInput(profile.display_name || '');
  }, [profile]);

  const handleSaveName = async () => {
    if (!user) return;
    await supabase.from('profiles').update({ display_name: nameInput }).eq('user_id', user.id);
    await refreshProfile();
    setEditingName(false);
    toast.success('Name updated');
  };

  const addAddress = async () => {
    if (!user || !newAddress.trim()) return;
    const addresses = [...(profile?.saved_addresses || []), newAddress.trim()];
    await supabase.from('profiles').update({ saved_addresses: addresses }).eq('user_id', user.id);
    await refreshProfile();
    setNewAddress('');
    toast.success('Address saved');
  };

  const removeAddress = async (index: number) => {
    if (!user) return;
    const addresses = [...(profile?.saved_addresses || [])];
    addresses.splice(index, 1);
    await supabase.from('profiles').update({ saved_addresses: addresses }).eq('user_id', user.id);
    await refreshProfile();
    toast.success('Address removed');
  };

  const removeFavorite = async (productId: string) => {
    if (!user) return;
    await supabase.from('favorite_items').delete().eq('user_id', user.id).eq('product_id', productId);
    setFavorites(prev => prev.filter(f => f.product_id !== productId));
    toast.success('Removed from favorites');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-600';
      case 'preparing': case 'confirmed': return 'bg-yellow-600';
      case 'on_the_way': return 'bg-blue-600';
      case 'cancelled': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-6 pb-24">
        <div className="container max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Profile Header */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    {editingName ? (
                      <div className="flex gap-2">
                        <Input
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          className="h-8"
                        />
                        <Button size="sm" onClick={handleSaveName}>
                          <Check className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold">{profile?.display_name || 'User'}</h2>
                        <button onClick={() => setEditingName(true)}>
                          <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-1" /> Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Loyalty Banner */}
            {loyalty && (
              <Card className="border-border/50" style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--brand-gold) / 0.1))' }}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: 'hsl(var(--brand-gold) / 0.2)' }}>
                        <Star className="h-5 w-5" style={{ color: 'hsl(var(--brand-gold))' }} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{loyalty.balance}</p>
                        <p className="text-xs text-muted-foreground">Loyalty Points</p>
                      </div>
                    </div>
                    {referral && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Your referral code</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(referral.code);
                            toast.success('Referral code copied!');
                          }}
                          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-mono font-bold hover:bg-card transition-colors"
                        >
                          {referral.code}
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        </button>
                        <p className="text-[10px] text-muted-foreground mt-1">{referral.uses_count} referrals</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tabs */}
            <Tabs defaultValue="orders">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="orders" className="gap-1 text-xs">
                  <Package className="h-3.5 w-3.5" /> Orders
                </TabsTrigger>
                <TabsTrigger value="rewards" className="gap-1 text-xs">
                  <Gift className="h-3.5 w-3.5" /> Rewards
                </TabsTrigger>
                <TabsTrigger value="addresses" className="gap-1 text-xs">
                  <MapPin className="h-3.5 w-3.5" /> Address
                </TabsTrigger>
                <TabsTrigger value="favorites" className="gap-1 text-xs">
                  <Heart className="h-3.5 w-3.5" /> Favs
                </TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders" className="mt-4 space-y-3">
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No orders yet</p>
                    <Button className="mt-3" onClick={() => navigate('/shop')}>
                      Start Ordering
                    </Button>
                  </div>
                ) : (
                  orders.map(order => (
                    <Card key={order.id}>
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </span>
                          <Badge className={statusColor(order.status)}>
                            {order.status.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          {Array.isArray(order.items) && order.items.map((item: any, i: number) => (
                            <span key={i}>
                              {item.name || item.product?.name} ×{item.quantity}
                              {i < order.items.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="font-semibold">₹{order.total}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() => navigate(`/track-order?phone=${encodeURIComponent(order.customer_name)}`)}
                          >
                            Track →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses" className="mt-4 space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new address..."
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                  />
                  <Button onClick={addAddress} disabled={!newAddress.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {(profile?.saved_addresses || []).length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No saved addresses</p>
                  </div>
                ) : (
                  (profile?.saved_addresses || []).map((addr: string, i: number) => (
                    <Card key={i}>
                      <CardContent className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm">{addr}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeAddress(i)}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="mt-4 space-y-3">
                {favorites.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No favorites yet</p>
                    <Button className="mt-3" variant="outline" onClick={() => navigate('/shop')}>
                      Browse Menu
                    </Button>
                  </div>
                ) : (
                  favorites.map(fav => (
                    <Card key={fav.id}>
                      <CardContent className="py-3 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-md bg-muted overflow-hidden flex-shrink-0">
                          {fav.products?.images?.[0] ? (
                            <img src={fav.products.images[0]} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">🍗</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{fav.products?.name}</p>
                          <p className="text-xs text-muted-foreground">₹{fav.products?.price}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeFavorite(fav.product_id)}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              {/* Rewards Tab */}
              <TabsContent value="rewards" className="mt-4 space-y-4">
                <Card>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-sm mb-2">How it works</h3>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <p>🍗 Earn <strong className="text-foreground">1 point per ₹10</strong> spent</p>
                      <p>💰 Redeem <strong className="text-foreground">10 points = ₹1</strong> discount</p>
                      <p>🎁 Refer a friend and both get <strong className="text-foreground">₹50 reward</strong></p>
                    </div>
                  </CardContent>
                </Card>

                {referral && (
                  <Card>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold text-sm mb-2 flex items-center gap-1">
                        <Share2 className="h-4 w-4" /> Share & Earn
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        Share your code with friends. When they place their first order, you both get ₹{referral.reward_amount}!
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          const text = `Order delicious fried chicken from MFC! Use my referral code ${referral.code} to get ₹${referral.reward_amount} off your first order. Order now: ${window.location.origin}`;
                          if (navigator.share) {
                            navigator.share({ text });
                          } else {
                            navigator.clipboard.writeText(text);
                            toast.success('Referral message copied!');
                          }
                        }}
                      >
                        <Share2 className="h-4 w-4 mr-2" /> Share Referral Code
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Points History</h3>
                  {(!loyaltyTx || loyaltyTx.length === 0) ? (
                    <p className="text-xs text-muted-foreground text-center py-6">No transactions yet. Place an order to earn points!</p>
                  ) : (
                    loyaltyTx.map(tx => (
                      <Card key={tx.id}>
                        <CardContent className="py-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{tx.description}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {new Date(tx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                          <span className={`text-sm font-bold ${tx.points > 0 ? 'text-green-500' : 'text-destructive'}`}>
                            {tx.points > 0 ? '+' : ''}{tx.points}
                          </span>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      <Footer />
      <BottomTabBar />
    </div>
  );
};

export default Profile;

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useLoyaltyPoints = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['loyalty-points', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', user.id)
        .single();
      return data as { id: string; user_id: string; balance: number; total_earned: number } | null;
    },
    enabled: !!user,
  });
};

export const useLoyaltyTransactions = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['loyalty-transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('loyalty_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      return (data || []) as Array<{
        id: string;
        points: number;
        type: string;
        description: string | null;
        created_at: string;
      }>;
    },
    enabled: !!user,
  });
};

export const useReferralCode = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['referral-code', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('user_id', user.id)
        .single();
      return data as { id: string; code: string; reward_amount: number; uses_count: number } | null;
    },
    enabled: !!user,
  });
};

export const earnPoints = async (userId: string, orderId: string, orderTotal: number) => {
  // 1 point per ₹10 spent
  const points = Math.floor(orderTotal / 10);
  if (points <= 0) return;

  await supabase.from('loyalty_transactions').insert({
    user_id: userId,
    points,
    type: 'earn',
    description: `Earned from order`,
    order_id: orderId,
  });

  // Update balance
  const { data: current } = await supabase
    .from('loyalty_points')
    .select('balance, total_earned')
    .eq('user_id', userId)
    .single();

  if (current) {
    await supabase.from('loyalty_points').update({
      balance: (current as any).balance + points,
      total_earned: (current as any).total_earned + points,
    }).eq('user_id', userId);
  }
};

export const redeemPoints = async (userId: string, points: number): Promise<number> => {
  // 10 points = ₹1 discount
  const discount = Math.floor(points / 10);
  
  const { data: current } = await supabase
    .from('loyalty_points')
    .select('balance')
    .eq('user_id', userId)
    .single();

  if (!current || (current as any).balance < points) throw new Error('Insufficient points');

  await supabase.from('loyalty_points').update({
    balance: (current as any).balance - points,
  }).eq('user_id', userId);

  await supabase.from('loyalty_transactions').insert({
    user_id: userId,
    points: -points,
    type: 'redeem',
    description: `Redeemed ₹${discount} discount`,
  });

  return discount;
};

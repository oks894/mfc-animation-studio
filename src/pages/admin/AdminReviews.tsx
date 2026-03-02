import React from 'react';
import { motion } from 'framer-motion';
import { Star, Check, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  is_approved: boolean;
  created_at: string;
}

const AdminReviews: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('reviews').update({ is_approved: !currentStatus }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: currentStatus ? 'Review hidden' : 'Review approved' });
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['approved-reviews'] });
    }
  };

  const deleteReview = async (id: string) => {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Review deleted' });
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['approved-reviews'] });
    }
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading reviews...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customer Reviews</h1>
        <p className="text-muted-foreground">Manage and moderate customer reviews</p>
      </div>

      <div className="grid gap-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No reviews yet</div>
        ) : reviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-lg border bg-card p-4 flex flex-col sm:flex-row sm:items-start gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{review.customer_name}</span>
                <Badge variant={review.is_approved ? 'default' : 'secondary'} className="text-xs">
                  {review.is_approved ? 'Approved' : 'Pending'}
                </Badge>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`h-4 w-4 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{review.review_text}</p>
              <p className="text-xs text-muted-foreground/50 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant={review.is_approved ? 'outline' : 'default'} onClick={() => toggleApproval(review.id, review.is_approved)}>
                {review.is_approved ? <><EyeOff className="h-3.5 w-3.5 mr-1" /> Hide</> : <><Check className="h-3.5 w-3.5 mr-1" /> Approve</>}
              </Button>
              <Button size="sm" variant="destructive" onClick={() => deleteReview(review.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;

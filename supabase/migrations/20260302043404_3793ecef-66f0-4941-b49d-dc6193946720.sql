
-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved reviews
CREATE POLICY "Anyone can read approved reviews"
ON public.reviews FOR SELECT
USING (is_approved = true);

-- Admins can read all reviews
CREATE POLICY "Admins can read all reviews"
ON public.reviews FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can submit a review
CREATE POLICY "Anyone can submit reviews"
ON public.reviews FOR INSERT
WITH CHECK (true);

-- Admins can update reviews (approve/reject)
CREATE POLICY "Admins can update reviews"
ON public.reviews FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete reviews
CREATE POLICY "Admins can delete reviews"
ON public.reviews FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

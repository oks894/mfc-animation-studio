-- Create site_content table for About and Contact management
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL UNIQUE CHECK (section IN ('about', 'contact')),
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  address TEXT,
  email TEXT,
  phone_1 TEXT,
  phone_2 TEXT,
  map_embed_url TEXT,
  image_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read site content (public pages)
CREATE POLICY "Anyone can read site content"
ON public.site_content
FOR SELECT
USING (true);

-- Only admins can insert
CREATE POLICY "Admins can insert site content"
ON public.site_content
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update
CREATE POLICY "Admins can update site content"
ON public.site_content
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Seed initial content
INSERT INTO public.site_content (section, title, content)
VALUES 
  ('about', 'About MFC', 'Welcome to Makyo Fried Chicken - where tradition meets taste. Our story began with a simple passion for creating the perfect fried chicken using authentic recipes passed down through generations.'),
  ('contact', 'Contact Us', 'We would love to hear from you! Reach out to us for orders, feedback, or just to say hello.');
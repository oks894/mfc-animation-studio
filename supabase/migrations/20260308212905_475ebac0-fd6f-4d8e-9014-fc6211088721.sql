
ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS directions_url text;

CREATE TABLE public.notification_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  sent_by uuid,
  sent_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage notifications" ON public.notification_history
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

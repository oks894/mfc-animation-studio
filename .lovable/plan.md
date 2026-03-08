

## Plan: Fix Product Card, Add Store Map, Build Notification Center, Debug Orders API

### 1. Redesign Product Card (Modern, Clean)

The current card has issues: the Sheet component renders a default X close button from Radix AND a custom X button in ProductDetailSheet (double X). The card layout feels dated.

**ProductCard.tsx** - Complete redesign:
- Modern vertical card layout on both mobile and desktop (like Swiggy/Zomato style)
- Larger image area with rounded corners, subtle gradient overlay at bottom
- Clean typography: product name, short description, price row with ADD button
- Remove the "Tap for details" text
- Keep the quantity stepper but make it more compact and modern

**ProductDetailSheet.tsx** - Fix double X:
- Add `SheetTitle` (hidden with `VisuallyHidden`) to fix the accessibility console error
- Remove the custom X button since `SheetContent` already renders one from sheet.tsx (line 60-63)
- OR remove the default one from SheetContent and keep the custom styled one

**sheet.tsx** - Best approach: keep the custom X in ProductDetailSheet (it's styled nicely), suppress the default one by making SheetContent optionally hide its built-in close button via a prop `hideClose`.

### 2. Add Store Map in Admin (Get Directions)

The contact page already shows a Google Maps embed. The admin already has a `map_embed_url` field in the Contact tab of AdminContent.

**What to add:**
- In `AdminSettings.tsx`, add a "Store Location" card with a "Get Directions" Google Maps link field (separate from the embed iframe)
- OR more practically: add a `directions_url` field to `site_content` contact section so customers can tap "Get Directions" and open Google Maps natively
- Add a "Get Directions" button on the Contact page that opens Google Maps directions

**Database migration:** Add `directions_url` column to `site_content` table.

**AdminContent.tsx:** Add a "Google Maps Directions Link" input field in the Contact tab.

**Contact.tsx:** Add a "Get Directions" button that opens the directions URL.

### 3. Build Admin Notification Center

Currently notifications are only sent when order status changes. Need a dedicated admin page to compose and broadcast custom messages/promos.

**New page: `AdminNotifications.tsx`**
- Form with Title and Message body fields
- "Send to All Subscribers" button
- History of sent notifications (new DB table)
- Uses the existing `sendNotification` function from `usePushNotifications`

**Database migration:** Create `notification_history` table:
```sql
CREATE TABLE public.notification_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  sent_by uuid REFERENCES auth.users(id),
  sent_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage notifications" ON public.notification_history
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
```

**AdminSidebar.tsx:** Add "Notifications" nav item with Bell icon.

**App.tsx:** Add route `/admin/notifications`.

### 4. Debug Orders API

The edge function code looks correct. Potential issues:
- CORS headers missing newer Supabase client headers (`x-supabase-client-platform`, etc.) - the delivery app may be sending these
- The function uses `verify_jwt = false` which is correct for API key auth
- Need to test the function to check if it's deployed and responding

**Fix:** Update CORS headers in `orders-api/index.ts` to include the full set of allowed headers. Redeploy the function.

### Summary of Changes

| File | Change |
|------|--------|
| `ProductCard.tsx` | Modern vertical card redesign, cleaner layout |
| `ProductDetailSheet.tsx` | Remove duplicate X button, add hidden SheetTitle for accessibility |
| `sheet.tsx` | Add optional `hideClose` prop to SheetContent |
| `site_content` migration | Add `directions_url` column |
| `AdminContent.tsx` | Add Directions URL input in Contact tab |
| `Contact.tsx` | Add "Get Directions" button |
| `notification_history` migration | New table for notification logs |
| `AdminNotifications.tsx` (new) | Admin page to compose/send broadcast notifications with history |
| `AdminSidebar.tsx` | Add Notifications nav item |
| `App.tsx` | Add `/admin/notifications` route |
| `orders-api/index.ts` | Fix CORS headers, redeploy and test |


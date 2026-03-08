

## Plan: Checkout Redesign, Order Confirmation Page, Animated Product Badges

Three design upgrades selected by the user. Here is the implementation plan.

---

### 1. Checkout Page Redesign (`src/pages/Checkout.tsx`)

Replace the current two-column form with a modern **multi-step wizard** layout:

**Step 1 - Review Order**: Show cart items as mini cards with images, quantities, and prices. Editable quantities inline. Progress bar at top showing "Review → Details → Payment → Confirm".

**Step 2 - Delivery Details**: Clean single-column form with name, phone, address, distance, and special instructions. Floating labels or modern input styling.

**Step 3 - Payment**: Payment method selection with larger, tappable cards (GPay/UPI vs COD). UPI ID section with copy button.

**Step 4 - Summary & Place Order**: Final breakdown (subtotal, discount, packaging, delivery, total) with animated gold total. "Place Order via WhatsApp" button.

**UI details:**
- Sticky progress indicator at top (4 dots/steps with labels)
- Framer Motion `AnimatePresence` transitions between steps (slide left/right)
- Mobile-first: single column, full-width inputs, large touch targets
- Order summary sidebar on desktop (sticky), hidden on mobile (shown in step 4)
- Back/Next buttons at bottom of each step

### 2. Order Confirmation Page (`src/pages/OrderConfirmation.tsx` - NEW)

After placing an order, instead of redirecting to home, navigate to a dedicated confirmation page.

**Design:**
- Animated checkmark (Framer Motion scale + fade) at center
- "Order Placed Successfully!" heading with gold gradient
- Order details card: items list, total, payment method
- Estimated time: "Your order will be ready in ~20-30 minutes" (static text)
- Two CTA buttons: "Track on WhatsApp" (opens WhatsApp) and "Back to Menu"
- Confetti-like subtle gold particle animation on mount
- Share button to copy order summary text

**Changes needed:**
- Create `src/pages/OrderConfirmation.tsx`
- Add route `/order-confirmation` in `App.tsx`
- Modify `Checkout.tsx` handleSubmit: store order details in state/URL params, navigate to `/order-confirmation` instead of `/`
- Pass order data via `useNavigate` state

### 3. Animated Product Badges (`src/components/products/ProductCard.tsx`)

Add contextual badges on product cards:

**Badge types:**
- **"NEW"** - Products created within last 7 days (compare `created_at` to now). Gold badge with subtle pulse glow animation.
- **"BEST SELLER"** - Products flagged with a new `is_bestseller` boolean column. Crimson badge with fire icon.
- **"🌶 SPICY"** - Products flagged with a new `is_spicy` boolean column. Red-orange badge.

**Database migration:** Add two columns to `products` table:
```sql
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_bestseller boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_spicy boolean DEFAULT false;
```

**Badge rendering in ProductCard.tsx:**
- Positioned absolute top-left of the image area, stacked vertically with gap
- Subtle entrance animation (`scale-in` + `fade-in`)
- "NEW" badge: `animate-pulse-glow` class (already defined in CSS)
- Small, rounded-full pill badges with icon + text

**Admin support in AdminProducts.tsx:**
- Add "Best Seller" and "Spicy" toggle switches in the product edit form so admins can flag items

---

### Summary of File Changes

| File | Action |
|------|--------|
| `src/pages/Checkout.tsx` | Redesign as multi-step wizard |
| `src/pages/OrderConfirmation.tsx` | **New** - animated confirmation page |
| `src/App.tsx` | Add `/order-confirmation` route |
| `src/components/products/ProductCard.tsx` | Add animated badges (New, Best Seller, Spicy) |
| `src/pages/admin/AdminProducts.tsx` | Add Best Seller / Spicy toggles |
| DB migration | Add `is_bestseller`, `is_spicy` columns to `products` |


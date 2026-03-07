

# MFC Updates: APK Install, Product Details, Checkout Fees, Contact Map Fix

## 1. Install App → APK Download (not PWA "Add to Home Screen")

Replace the current PWA install prompt on `/install` and hero section with a direct APK download approach. Since we can't compile a native APK from Lovable, the best approach is:
- Use a **Trusted Web Activity (TWA) wrapper** concept — provide a pre-built APK or link to a service like [ApeliApps/Nicegram-style PWA-to-APK wrapper]
- For now, the practical solution: generate the APK using an external tool (like PWABuilder or BubbleWrap) and host the `.apk` file in the project's public storage
- Update the Install page to show a **"Download APK"** button that downloads the APK file directly
- Update HeroSection's "Install App" button to link to the APK download
- Keep iOS instructions as fallback (since APK is Android-only)

**Files:** `src/pages/Install.tsx`, `src/components/home/HeroSection.tsx`

## 2. Product Detail Modal (click product → show details + ratings)

When a user taps a product card, open a **product detail sheet/dialog** showing:
- Full product image carousel (swipeable if multiple images)
- Product name, description, category
- Price with discount
- Add to cart / quantity stepper
- Product-specific reviews/ratings (from the reviews table, or a general "rating" display)

**New file:** `src/components/products/ProductDetailSheet.tsx`
**Edit:** `src/components/products/ProductCard.tsx` — add click handler to open detail sheet

## 3. Checkout: Add Packaging Fee ₹60 + Delivery Fees

Update the checkout order summary to include:
- **Packaging Fee: ₹60** (fixed)
- **Delivery Base Fee: ₹100** (Hashtag Dropee base)
- **Delivery Per KM: ₹50/km** (show as info, user enters distance or it's estimated)
- Add a **distance input** (km) so the delivery cost can be calculated
- Update total calculation: `subtotal - discount + packaging(60) + deliveryBase(100) + (km × 50)`
- Update WhatsApp message to include these fees
- Update the database order record to include packaging and delivery fees

Also update **CartSidebar** to show packaging fee in the summary.

**Files:** `src/pages/Checkout.tsx`, `src/lib/whatsapp.ts`, `src/components/cart/CartSidebar.tsx`

## 4. Fix Contact Page Map 404

The map shows "Map coming soon" because `contactContent?.map_embed_url` is null in the database. Fix by:
- Providing a **default Google Maps embed URL** for "Viewland Zone II, Ukhrul" as fallback directly in the Contact component
- The fallback URL: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.5!2d94.3667!3d25.1167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDA3JzAwLjEiTiA5NMKwMjInMDAuMSJF!5e0!3m2!1sen!2sin!4v1`

**File:** `src/pages/Contact.tsx`

## 5. UI/UX Polish on Product Cards

Enhance the existing product cards:
- Make the entire card tappable (opens detail sheet)
- Add a subtle "tap for details" hint on mobile
- Slightly larger images on mobile for better visual appeal

**File:** `src/components/products/ProductCard.tsx`

---

## Files to Create
1. `src/components/products/ProductDetailSheet.tsx`

## Files to Edit
1. `src/pages/Install.tsx` — APK download instead of PWA prompt
2. `src/components/home/HeroSection.tsx` — update Install App button
3. `src/components/products/ProductCard.tsx` — add click-to-detail, UI polish
4. `src/pages/Checkout.tsx` — add packaging ₹60, delivery base ₹100, ₹50/km with distance input
5. `src/components/cart/CartSidebar.tsx` — show packaging fee in summary
6. `src/lib/whatsapp.ts` — include fees in WhatsApp message
7. `src/pages/Contact.tsx` — hardcode default Google Maps embed URL as fallback


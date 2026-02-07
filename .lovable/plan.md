
# Admin Sign-in Fix + About & Contact Content Management

## Issue Identified: Admin Sign-in

After investigation, I found there are **two user accounts** in the system:

| Email | User ID | Has Admin Role? |
|-------|---------|-----------------|
| hashtagdropee@gmail.com | e7ca4f29-1930-420d-898e-d6c97b81357b | Yes |
| jihalshimray1@gmail.com | f6e38e77-0d9f-4adb-84e5-b3d16238ef35 | **No** |

If you're trying to log in with `jihalshimray1@gmail.com`, that account doesn't have admin access yet. I'll add the admin role to this account as well.

---

## New Feature: About & Contact Content Management

I'll create an admin-manageable content system for "About" and "Contact" sections that will appear on the main website.

### Database Changes

**New Table: `site_content`**
```text
+------------------+-------------------+--------------------------------+
| Column           | Type              | Description                    |
+------------------+-------------------+--------------------------------+
| id               | uuid (PK)         | Primary key                    |
| section          | text              | 'about' or 'contact'           |
| title            | text              | Section heading                |
| content          | text              | Main content (supports rich)   |
| address          | text (nullable)   | For contact section            |
| email            | text (nullable)   | Contact email                  |
| phone_1          | text (nullable)   | Primary phone                  |
| phone_2          | text (nullable)   | Secondary phone                |
| map_embed_url    | text (nullable)   | Google Maps embed URL          |
| image_url        | text (nullable)   | Featured image                 |
| updated_at       | timestamptz       | Last update timestamp          |
+------------------+-------------------+--------------------------------+
```

**RLS Policies:**
- Anyone can READ (public content)
- Only admins can INSERT/UPDATE

---

### New Files to Create

1. **`src/pages/About.tsx`**
   - Public page displaying About content from database
   - Cinematic animations matching existing style
   - Multi-layer parallax effects
   - Slow, calm, confident motion per design specs

2. **`src/pages/Contact.tsx`**
   - Public page displaying Contact information
   - Interactive map embed
   - Contact form (optional - sends via WhatsApp)
   - Animated icons with stroke-draw effects

3. **`src/pages/admin/AdminContent.tsx`**
   - Admin page to manage About and Contact content
   - Rich text editing for descriptions
   - Image upload for featured images
   - Live preview of changes

4. **`src/hooks/useSiteContent.ts`**
   - Custom hook for fetching/updating site content
   - React Query integration for caching

---

### Files to Modify

1. **`src/App.tsx`**
   - Add routes: `/about`, `/contact`, `/admin/content`

2. **`src/components/admin/AdminSidebar.tsx`**
   - Add "Site Content" navigation item with FileText icon

3. **`src/components/layout/Header.tsx`**
   - Add navigation links to About and Contact pages

4. **`src/components/layout/Footer.tsx`**
   - Add links to About and Contact pages

---

### Implementation Summary

```text
Phase 1: Fix Admin Access
  - Add admin role to jihalshimray1@gmail.com

Phase 2: Database Setup
  - Create site_content table with RLS policies
  - Seed initial content for About and Contact

Phase 3: Admin Interface
  - Create AdminContent.tsx for content management
  - Add to admin sidebar navigation
  - Include image upload capability

Phase 4: Public Pages
  - Create About.tsx with cinematic animations
  - Create Contact.tsx with map and contact info
  - Add navigation links in Header and Footer

Phase 5: Testing
  - Verify admin can edit content
  - Confirm public pages display correctly
  - Test responsive design on mobile
```

---

### Technical Details

**Cinematic Animations for About Page:**
- Slow parallax scrolling on images
- Text fades in slower than rest of site
- Icons animate with stroke-draw effects
- Background grain becomes more visible

**Contact Page Features:**
- Google Maps embed with warm-toned overlay
- Contact details with hover animations
- Optional WhatsApp contact form
- Animated social icons on proximity

**Admin Content Editor:**
- Textarea for content (Markdown-ready)
- Image upload using existing Supabase storage
- Real-time save indicator
- Preview toggle to see changes

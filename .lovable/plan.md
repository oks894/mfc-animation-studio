

# Admin User Account Setup Plan

## Current Situation
- The authentication system is already set up using Supabase Auth
- The `user_roles` table exists but is empty
- The admin login page is at `/admin` and uses email/password authentication
- Once logged in, the system checks the `user_roles` table for admin privileges

## Setup Process

### Step 1: Create the User Account
You need to sign up first. The current admin login page only has a login form, but no signup capability. I'll add a signup option to the admin login page so you can create your account.

### Step 2: Enable Email Auto-Confirm (Recommended for Testing)
Currently, new signups require email verification. For faster testing, we can enable auto-confirm so you can immediately log in after signing up.

### Step 3: Add Admin Role to the User
After you sign up, I'll run a SQL query to add your user ID to the `user_roles` table with the `admin` role.

---

## Implementation Details

### File Changes

**1. Update Admin Login Page** (`src/pages/admin/AdminLogin.tsx`)
- Add a signup tab/toggle alongside the login form
- Include fields for email and password
- Show clear feedback on successful registration
- Explain next steps (admin role needs to be assigned)

### Database Changes

**2. Add Admin Role** (after you sign up)
Once you register, I'll execute this SQL to grant admin access:
```sql
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'hashtagdropee@gmail.com';
```

---

## User Experience Flow

1. Navigate to `/admin`
2. Click "Sign Up" tab
3. Enter email: `hashtagdropee@gmail.com` and password: `000000`
4. Complete signup
5. Tell me once done - I'll add the admin role
6. Log in with your credentials
7. Access the admin dashboard

---

## Security Considerations

- Password `000000` is very weak - consider changing it later in production
- The signup form will be visible but new users won't have admin access until manually added to `user_roles`
- RLS policies ensure only admins can view/modify the `user_roles` table


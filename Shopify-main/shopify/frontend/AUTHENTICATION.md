# 🔐 Single Login Page Authentication System

## Overview
The application now has a **single unified login page** that automatically routes users based on their credentials.

---

## 🎯 Authentication Logic

### Admin Access
- **Username**: `admin@123`
- **Password**: `12345`
- **Redirects to**: `/dashboard` (Admin Dashboard)

### User Access
- **Username**: Any other username
- **Password**: Any password
- **Redirects to**: `/shop` (Shopping Page)

---

## 📍 Routes

| Route | Description | Access Level |
|-------|-------------|--------------|
| `/` | Redirects to `/login` | Public |
| `/login` | Single login page for both admin and users | Public |
| `/shop` | Shopping page with products and cart | User Only |
| `/dashboard` | Admin dashboard with statistics | Admin Only |
| `/admin` | Admin product management page | Admin Only |

---

## 🔄 Login Flow

```
User visits /login
      ↓
Enters credentials
      ↓
      ├─→ admin@123 / 12345 → Set userType="admin" → Redirect to /dashboard
      │
      └─→ Any other credentials → Set userType="user" → Redirect to /shop
```

---

## 🛡️ Protected Routes

### Shop Page (`/shop`)
- Checks: `isLoggedIn === "true"` AND `userType === "user"`
- If not authenticated: Redirects to `/login`

### Dashboard (`/dashboard`)
- Checks: `isLoggedIn === "true"` AND `userType === "admin"`
- If not authenticated: Redirects to `/login`

### Admin Page (`/admin`)
- Checks: `isLoggedIn === "true"` AND `userType === "admin"`
- If not authenticated: Redirects to `/login`

---

## 🎨 Design Features

### Login Page
- **Beautiful animated SVG** with shopping cart, bags, credit card
- **Purple-to-pink gradient** background
- **Two-column layout** (desktop): Illustration | Login Form
- **Demo credentials displayed** on the login card
- **Error handling** for empty fields
- **Remember me checkbox**
- **Forgot password link**
- **Responsive design** (mobile-friendly)

### Admin Features
- Dashboard with statistics (Total Products, Total Value, Items in Stock)
- Products table with full inventory details
- Navigation between Dashboard and Products pages
- Theme toggle (Light/Dark mode)
- Logout functionality

### User Features
- Browse all products in a beautiful grid
- Search products by name
- Filter products by category
- Add products to cart
- Update quantities in cart
- Remove items from cart
- View real-time cart total
- Checkout functionality (simulated)
- Sticky header with cart counter
- Responsive design

---

## 🧪 Testing

### Test Admin Login:
1. Go to `http://localhost:5173/login`
2. Enter:
   - Username: `admin@123`
   - Password: `12345`
3. Click "Sign In"
4. ✅ Should redirect to `/dashboard`

### Test User Login:
1. Go to `http://localhost:5173/login`
2. Enter any credentials:
   - Username: `john` (or anything)
   - Password: `password` (or anything)
3. Click "Sign In"
4. ✅ Should redirect to `/shop`

### Test Protected Routes:
1. Try accessing `/dashboard` without logging in
2. ✅ Should redirect to `/login`
3. Login as user and try accessing `/dashboard`
4. ✅ Should redirect to `/login`
5. Login as admin and access `/dashboard`
6. ✅ Should work perfectly

---

## 🔐 LocalStorage Keys

The application uses `localStorage` for authentication:

```javascript
// For Admin
localStorage.setItem("userType", "admin")
localStorage.setItem("isLoggedIn", "true")

// For User
localStorage.setItem("userType", "user")
localStorage.setItem("isLoggedIn", "true")
```

---

## 🚪 Logout

Both Admin and Users can logout:
- Click **"Logout"** button in the header
- Clears `localStorage` keys
- Redirects to `/login`

---

## 📦 File Structure

```
src/
├── pages/
│   ├── Login.jsx         # Single login page for all users
│   ├── Shop.jsx          # User shopping page
│   ├── Dashboard.jsx     # Admin dashboard
│   └── Admin.jsx         # Admin products page
├── components/
│   ├── Layout.jsx        # Admin layout with navigation
│   └── ui/               # Reusable UI components
└── App.jsx               # Route configuration
```

---

## 🎯 Key Features

✅ Single unified login page  
✅ Automatic role-based routing  
✅ Hardcoded admin credentials  
✅ Protected routes with authentication checks  
✅ Beautiful animated SVG illustrations  
✅ Fully responsive design  
✅ Shopping cart functionality  
✅ Product search and filtering  
✅ Admin dashboard with statistics  
✅ Theme toggle (Light/Dark mode)  
✅ Logout functionality  

---

## 🚀 Next Steps (Production Ready)

1. **Backend Authentication**
   - Implement JWT tokens
   - Secure password hashing
   - Session management
   - User registration API

2. **Database Integration**
   - User table with roles
   - Product management
   - Order tracking
   - Cart persistence

3. **Enhanced Security**
   - HTTPS only
   - Rate limiting
   - CSRF protection
   - Input validation

4. **Additional Features**
   - Password reset functionality
   - Email verification
   - User profile management
   - Order history
   - Payment integration

---

## 📝 Notes

- This is a **demo/development** authentication system
- Admin credentials are **hardcoded** for demonstration
- In production, implement proper backend authentication
- Use secure password storage (bcrypt, etc.)
- Add proper session management
- Implement refresh tokens
- Add multi-factor authentication for admin

---

## 🎉 Ready to Use!

The application is now ready with a complete authentication system. Just run:

```bash
cd frontend
npm run dev
```

Then visit `http://localhost:5173` and start testing! 🚀

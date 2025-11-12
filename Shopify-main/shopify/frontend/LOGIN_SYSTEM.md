# Login System Documentation

## Overview
The application now has a complete dual-login system with separate portals for **Users** and **Admins**.

## User Types

### 1. **User (Customer)**
- **Login Page**: `/login`
- **Access**: Shopping page where they can browse and purchase products
- **Features**:
  - Browse all products with beautiful animated SVG
  - Search products by name
  - Filter products by category
  - Add products to cart
  - Adjust quantities in cart
  - Remove items from cart
  - View cart total
  - Checkout (simulated)
  - Responsive design with sticky header

### 2. **Admin**
- **Login Page**: `/admin-login`
- **Credentials**: 
  - Username: `admin`
  - Password: `admin123`
- **Access**: Admin dashboard and product management
- **Features**:
  - View dashboard statistics
  - View all products in table format
  - Manage inventory (read-only for now)
  - Beautiful animated admin dashboard SVG

## Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Redirects to `/login` | Public |
| `/login` | User login page | Public |
| `/admin-login` | Admin login page | Public |
| `/shop` | Shopping page for users | User only |
| `/dashboard` | Admin dashboard | Admin only |
| `/admin` | Admin products page | Admin only |

## Authentication Flow

### User Login Flow:
1. User visits `/login`
2. Enters credentials (any username/password for demo)
3. System sets `localStorage`:
   - `userType: "user"`
   - `isLoggedIn: "true"`
4. Redirects to `/shop`

### Admin Login Flow:
1. Admin visits `/admin-login`
2. Enters credentials:
   - Username: `admin`
   - Password: `admin123`
3. System validates and sets `localStorage`:
   - `userType: "admin"`
   - `isLoggedIn: "true"`
4. Redirects to `/dashboard`

## Protected Routes

All pages check authentication on load:
- **Shop Page**: Requires `userType: "user"`
- **Dashboard**: Requires `userType: "admin"`
- **Admin Page**: Requires `userType: "admin"`

If authentication fails, users are redirected to the appropriate login page.

## Design Features

### User Login Page
- Purple-to-pink gradient theme
- Animated shopping cart SVG with:
  - Shopping cart with animated items
  - Shopping bags with bounce effects
  - Credit card with rotation
  - Floating circles and sparkles
- Two-column layout (desktop)
- Link to admin login

### Admin Login Page
- Blue-to-cyan gradient theme
- Animated admin dashboard SVG with:
  - Dashboard screen with stats
  - Rotating settings gear
  - Pulsing user icons
  - Lock icon for security
- Two-column layout (desktop)
- Link to user login
- Demo credentials displayed

### Shop Page
- Product grid with cards
- Search functionality
- Category filtering
- Shopping cart sidebar
- Sticky header with cart counter
- Add/remove/update cart items
- Real-time total calculation
- Checkout button

## Features

### Shopping Cart
- Add products to cart
- Increase/decrease quantities
- Remove items
- Stock validation
- Real-time price calculation
- Smooth scrolling to cart section

### Product Display
- Beautiful gradient product cards
- Category badges
- Price display
- Stock availability
- Out of stock handling
- Hover effects

## Next Steps for Production

1. **Backend Integration**:
   - Implement real authentication API
   - Add JWT tokens
   - Session management
   - User registration

2. **Shopping Features**:
   - Order history
   - Payment integration
   - Order tracking
   - User profile management

3. **Admin Features**:
   - Add/Edit/Delete products
   - Order management
   - User management
   - Analytics and reports

4. **Security**:
   - Secure password storage
   - HTTPS only
   - Rate limiting
   - CSRF protection

## Testing

### Test User Login:
1. Go to `http://localhost:5173/login`
2. Enter any username/password
3. Click "Sign In"
4. Should redirect to shopping page

### Test Admin Login:
1. Go to `http://localhost:5173/admin-login`
2. Enter: admin / admin123
3. Click "Sign In as Admin"
4. Should redirect to dashboard

### Test Shopping:
1. Login as user
2. Browse products
3. Add items to cart
4. Adjust quantities
5. Click checkout

## Logout
- **Users**: Click "Logout" button in shop header
- **Admins**: Click "Logout" button in admin header
- Both clear localStorage and redirect to appropriate login page

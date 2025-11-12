# Shopify Frontend - React Application

A modern, responsive frontend for the Shopify application built with React, Vite, TailwindCSS, and shadcn/ui.

## Features

- ⚡ Vite for fast development
- ⚛️ React 18
- 🎨 TailwindCSS for styling
- 🧩 shadcn/ui components
- 🎭 Radix UI icons
- 🌓 Dark/Light theme toggle
- 📱 Fully responsive design
- 🛣️ React Router for navigation

## Prerequisites

- Node.js 16+ and npm/yarn
- Backend server running on `http://localhost:8080`

## Installation

```bash
# Navigate to the frontend folder
cd shopify/frontend

# Install dependencies
npm install
```

## Running the Application

```bash
# Start development server
npm run dev
```

The application will start on `http://localhost:5173`

## Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Pages

### 1. Login Page (`/login`)
- Dummy authentication page
- Username and password fields (any values accepted)
- Redirects to dashboard on login

### 2. Dashboard Page (`/dashboard`)
- Displays key statistics:
  - Total number of products
  - Total inventory value
  - Total items in stock
  - List of all categories
- Real-time data from backend API

### 3. Admin Page (`/admin`)
- Complete product management interface
- Table view of all products with:
  - Product ID
  - Product Name
  - Category
  - Price
  - Stock quantity

## Components

### UI Components (shadcn/ui)
- `Button` - Clickable buttons with variants
- `Card` - Container components for content
- `Input` - Form input fields
- `Label` - Form labels
- `Table` - Data tables
- `ThemeToggle` - Dark/Light mode switcher

### Layout Components
- `Layout.jsx` - Shared layout with header and navigation
  - App branding
  - Navigation links (Admin, Logout)
  - Theme toggle

## Project Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── input.jsx
│   │   │   ├── label.jsx
│   │   │   ├── table.jsx
│   │   │   └── theme-toggle.jsx
│   │   └── Layout.jsx        # Shared layout component
│   ├── pages/
│   │   ├── Login.jsx         # Login page
│   │   ├── Dashboard.jsx     # Dashboard page
│   │   └── Admin.jsx         # Admin page
│   ├── services/
│   │   └── api.js            # API service layer
│   ├── lib/
│   │   └── utils.js          # Utility functions
│   ├── App.jsx               # Main app component with routing
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles with Tailwind
├── index.html                # HTML template
├── package.json              # Dependencies
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
└── postcss.config.js         # PostCSS configuration
```

## API Integration

The application communicates with the backend via axios:

```javascript
// Base URL
const API_BASE_URL = 'http://localhost:8080/api'

// Endpoints
GET /api/dashboard  // Dashboard statistics
GET /api/products   // All products
```

## Styling

### TailwindCSS
- Utility-first CSS framework
- Custom theme configuration
- Dark mode support

### Theme Variables
All colors are defined using CSS variables in `src/index.css`:
- Primary, Secondary, Accent colors
- Background and Foreground colors
- Automatic dark mode support

## Troubleshooting

### API Connection Issues
- Ensure backend is running on `http://localhost:8080`
- Check browser console for CORS errors
- Verify backend CORS configuration includes `http://localhost:5173`

### Dependency Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## Technologies Used

- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Radix UI** - Headless UI primitives and icons
- **Axios** - HTTP client
- **clsx & tailwind-merge** - Utility functions for className management

## Features Demonstrated

✅ Component-based architecture
✅ Custom hooks for data fetching
✅ Responsive design
✅ Theme switching
✅ Error handling
✅ Loading states
✅ Modern UI/UX patterns

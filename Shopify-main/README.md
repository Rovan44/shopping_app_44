# 🛍️ Shopify - Full-Stack E-Commerce Application

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Java](https://img.shields.io/badge/Java-17+-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue.svg)

A modern, full-stack e-commerce application featuring a Spring Boot REST API backend, PostgreSQL database, and a responsive React frontend with TailwindCSS and shadcn/ui components.

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Troubleshooting](#-troubleshooting)
- [Security Notes](#-security-notes)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Functionality
- ✅ **Product Management**: Complete CRUD operations for products and categories
- ✅ **Dashboard Analytics**: Real-time statistics and insights
- ✅ **Responsive Design**: Mobile-first approach with TailwindCSS
- ✅ **Dark/Light Mode**: Theme toggle for better user experience
- ✅ **RESTful API**: Clean, documented API endpoints
- ✅ **Data Persistence**: PostgreSQL database with JPA/Hibernate
- ✅ **Auto Data Seeding**: Automatic sample data loading on startup

### 🔐 Authentication
- Login system (currently dummy authentication for demo purposes)
- Admin panel access control
- User session management with React Router

### 🎨 UI/UX
- Modern, clean interface with shadcn/ui components
- Responsive tables and cards
- Interactive dashboard with real-time statistics
- Smooth navigation with React Router
- Dark/Light theme switcher
- Professional layout with sidebar navigation

---

## 🛠️ Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Spring Boot** | 3.2.0 | Application framework |
| **Java** | 17+ | Programming language |
| **PostgreSQL** | 12+ | Database |
| **Spring Data JPA** | - | ORM & Data access |
| **Hibernate** | - | ORM implementation |
| **Maven** | 3.6+ | Build & dependency management |
| **Lombok** | - | Reduce boilerplate code |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2 | UI framework |
| **Vite** | 5.0 | Build tool & dev server |
| **TailwindCSS** | 3.3 | Styling framework |
| **shadcn/ui** | - | UI component library |
| **React Router** | 6 | Client-side routing |
| **Axios** | 1.6 | HTTP client |
| **Radix UI** | - | Accessible components |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Required Version | Download Link |
|------|------------------|---------------|
| **Java JDK** | 17 or higher | [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) / [OpenJDK](https://adoptium.net/) |
| **Maven** | 3.6 or higher | [Maven](https://maven.apache.org/download.cgi) |
| **Node.js** | 16 or higher | [Node.js](https://nodejs.org/) |
| **npm** | 8 or higher | Comes with Node.js |
| **PostgreSQL** | 12 or higher | [PostgreSQL](https://www.postgresql.org/download/) |
| **Git** | Latest | [Git](https://git-scm.com/downloads) |

### ✅ Verify Installation

```bash
# Check Java
java -version
# Expected: java version "17.0.x" or higher

# Check Maven
mvn -version
# Expected: Apache Maven 3.6.x or higher

# Check Node.js
node -v
# Expected: v16.x.x or higher

# Check npm
npm -v
# Expected: 8.x.x or higher

# Check PostgreSQL
psql --version
# Expected: psql (PostgreSQL) 12.x or higher
```

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/shopify.git
cd shopify
```

### 2️⃣ Database Setup

#### Option A: Using Command Line (psql)

```bash
# Connect to PostgreSQL (you may need to provide password)
psql -U postgres

# Create the database
CREATE DATABASE shopify_db;

# Verify database creation
\l

# Exit psql
\q
```

#### Option B: Using pgAdmin or DBeaver (GUI)
1. Open your PostgreSQL GUI tool
2. Right-click on "Databases" → "Create Database"
3. Name it `shopify_db`
4. Click "Save"

### 3️⃣ Configure Backend (IMPORTANT!)

```bash
# Navigate to resources folder
cd backend/src/main/resources

# Copy the example configuration
cp application.properties.example application.properties
```

Now **edit** `application.properties` with your actual database credentials:

```properties
# Update these values with YOUR credentials
spring.datasource.url=jdbc:postgresql://localhost:5433/shopify_db
spring.datasource.username=YOUR_ACTUAL_USERNAME
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

> ⚠️ **SECURITY WARNING**: Never commit `application.properties` with real credentials to Git! This file is already in `.gitignore`.

### 4️⃣ Install Backend Dependencies

```bash
cd backend
mvn clean install
```

This will:
- Download all Maven dependencies
- Compile the Java code
- Run tests (if any)
- Package the application

### 5️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
```

This will install all npm packages defined in `package.json`.

---

## ⚙️ Configuration

### Backend Configuration Options

Edit `backend/src/main/resources/application.properties`:

```properties
# ==========================================
# DATABASE CONFIGURATION (REQUIRED)
# ==========================================
spring.datasource.url=jdbc:postgresql://localhost:5433/shopify_db
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

# ==========================================
# SERVER CONFIGURATION (Optional)
# ==========================================
server.port=8080

# ==========================================
# HIBERNATE CONFIGURATION (Optional)
# ==========================================
# Options: create, create-drop, update, validate, none
# Recommended: 'update' for development, 'validate' for production
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# ==========================================
# LOGGING CONFIGURATION (Optional)
# ==========================================
logging.level.com.shopify=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

### Frontend Configuration

If you need to change the backend API URL, edit `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

### Environment Variables (Optional)

For advanced configuration, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env` with your values.

---

## 🏃 Running the Application

### Method 1: Using Provided Scripts (Windows - Recommended)

#### PowerShell Script
```powershell
# Terminal 1 - Start Backend
cd backend
.\start-backend.ps1

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

#### Batch Script
```cmd
# Terminal 1 - Start Backend
cd backend
start-backend.bat

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

### Method 2: Manual Start

#### Step 1: Start Backend Server

```bash
cd backend
mvn spring-boot:run
```

Wait for the message:
```
Started ShopifyApplication in X.XXX seconds
```

✅ **Backend is now running at**: `http://localhost:8080`

#### Step 2: Start Frontend Server (New Terminal)

```bash
cd frontend
npm run dev
```

Wait for the message:
```
VITE vX.X.X  ready in XXX ms
➜  Local:   http://localhost:5173/
```

✅ **Frontend is now running at**: `http://localhost:5173`

### 3️⃣ Access the Application

Open your browser and navigate to:

**🌐 Main Application**: [http://localhost:5173](http://localhost:5173)

**🔌 Backend API**: [http://localhost:8080/api](http://localhost:8080/api)

### 🔐 Default Login Credentials

```
Username: any username (dummy authentication)
Password: any password (dummy authentication)
```

> 📝 **Note**: Current implementation uses dummy authentication for demonstration purposes. In production, implement proper authentication with JWT tokens or OAuth.

---

## 📁 Project Structure

```
shopify/
├── 📁 backend/                      # Spring Boot Backend
│   ├── 📁 src/main/java/com/shopify/
│   │   ├── 📄 ShopifyApplication.java       # Main application class
│   │   ├── 📄 DataLoader.java              # Sample data loader
│   │   ├── 📁 config/
│   │   │   └── 📄 WebConfig.java           # CORS & Web configuration
│   │   ├── 📁 controller/
│   │   │   ├── 📄 DashboardController.java # Dashboard endpoints
│   │   │   ├── 📄 ProductController.java   # Product CRUD endpoints
│   │   │   └── 📄 CategoryController.java  # Category endpoints
│   │   ├── 📁 dto/
│   │   │   └── 📄 DashboardStatsDTO.java   # Data transfer objects
│   │   ├── 📁 entity/
│   │   │   ├── 📄 Product.java             # Product entity
│   │   │   └── 📄 Category.java            # Category entity
│   │   ├── 📁 repository/
│   │   │   ├── 📄 ProductRepository.java   # Product data access
│   │   │   └── 📄 CategoryRepository.java  # Category data access
│   │   └── 📁 service/
│   │       └── 📄 DashboardService.java    # Business logic
│   ├── 📁 src/main/resources/
│   │   ├── 📄 application.properties       # ⚠️ SENSITIVE (in .gitignore)
│   │   └── 📄 application.properties.example # Template file
│   ├── 📄 pom.xml                          # Maven configuration
│   ├── 📄 start-backend.ps1                # PowerShell start script
│   └── 📄 start-backend.bat                # Batch start script
│
├── 📁 frontend/                     # React Frontend
│   ├── 📁 src/
│   │   ├── 📄 App.jsx                      # Main app component
│   │   ├── 📄 main.jsx                     # Entry point
│   │   ├── 📁 components/
│   │   │   ├── 📄 Layout.jsx               # Main layout wrapper
│   │   │   └── 📁 ui/                      # shadcn/ui components
│   │   │       ├── 📄 button.jsx
│   │   │       ├── 📄 card.jsx
│   │   │       ├── 📄 dialog.jsx
│   │   │       ├── 📄 input.jsx
│   │   │       ├── 📄 label.jsx
│   │   │       ├── 📄 table.jsx
│   │   │       └── 📄 theme-toggle.jsx
│   │   ├── 📁 pages/
│   │   │   ├── 📄 Login.jsx                # User login page
│   │   │   ├── 📄 AdminLogin.jsx           # Admin login page
│   │   │   ├── 📄 Dashboard.jsx            # Dashboard page
│   │   │   ├── 📄 Shop.jsx                 # Shop page
│   │   │   └── 📄 Admin.jsx                # Admin panel
│   │   ├── 📁 services/
│   │   │   └── 📄 api.js                   # API service layer
│   │   └── 📁 lib/
│   │       └── 📄 utils.js                 # Utility functions
│   ├── 📄 package.json                     # npm dependencies
│   ├── 📄 vite.config.js                   # Vite configuration
│   ├── 📄 tailwind.config.js               # TailwindCSS config
│   └── 📄 index.html                       # HTML template
│
├── 📁 database/                     # Database Scripts
│   ├── 📄 init.sql                         # Initial schema
│   ├── 📄 setup-database.sql               # Database setup
│   └── 📄 README.md                        # Database docs
│
├── 📁 report/                       # Project Documentation
│   ├── 📄 backend-report.md
│   ├── 📄 frontend-report.md
│   └── 📄 database-report.md
│
├── 📄 README.md                     # This file
├── 📄 .gitignore                    # Git ignore rules
├── 📄 .env.example                  # Environment template
├── 📄 PROJECT_STATUS_AND_SETUP.md   # Setup documentation
└── 📄 COMPLETE_FEATURES.md          # Features documentation
```

---

## 🔌 API Endpoints

### Dashboard Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/api/dashboard` | Get dashboard statistics | `DashboardStatsDTO` |

**Response Example:**
```json
{
  "totalProducts": 4,
  "totalCategories": 4,
  "totalStock": 475,
  "lowStockProducts": 0
}
```

### Product Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/api/products` | Get all products | - | `List<Product>` |
| `GET` | `/api/products/{id}` | Get product by ID | - | `Product` |
| `POST` | `/api/products` | Create new product | `Product` | `Product` |
| `PUT` | `/api/products/{id}` | Update product | `Product` | `Product` |
| `DELETE` | `/api/products/{id}` | Delete product | - | `204 No Content` |

**Product Object:**
```json
{
  "id": 1,
  "name": "Organic Apple",
  "price": 3.99,
  "totalItemsInStock": 150,
  "category": {
    "id": 1,
    "name": "Food"
  }
}
```

### Category Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/api/categories` | Get all categories | `List<Category>` |

---

## 💾 Database Schema

### Categories Table

```sql
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Auto-incrementing ID |
| `name` | VARCHAR(255) | NOT NULL | Category name |

### Products Table

```sql
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    total_items_in_stock INTEGER NOT NULL,
    category_id BIGINT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Auto-incrementing ID |
| `name` | VARCHAR(255) | NOT NULL | Product name |
| `price` | DOUBLE PRECISION | NOT NULL | Product price |
| `total_items_in_stock` | INTEGER | NOT NULL | Stock quantity |
| `category_id` | BIGINT | FOREIGN KEY | References categories(id) |

### Sample Data (Auto-loaded)

**Categories:**
1. Food
2. Mobiles
3. Electronics
4. Stationery

**Products:**
1. **Organic Apple** - ₹299.00 (150 in stock) - Food
2. **iPhone 15 Pro** - ₹99,999.00 (50 in stock) - Mobiles
3. **Sony Headphones** - ₹24,999.00 (75 in stock) - Electronics
4. **Notebook Set** - ₹999.00 (200 in stock) - Stationery

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 🔴 Backend won't start

**Problem:** `Cannot create PoolableConnectionFactory`

**Solution:**
1. Check if PostgreSQL is running:
   ```bash
   # Windows
   pg_ctl status
   
   # Or check services
   services.msc
   ```
2. Verify database exists:
   ```bash
   psql -U postgres -l
   ```
3. Check credentials in `application.properties`
4. Ensure port 5433 (or your configured port) is correct

**Problem:** `Port 8080 is already in use`

**Solution:**
1. Find and kill the process using port 8080:
   ```bash
   # Windows
   netstat -ano | findstr :8080
   taskkill /PID <PID> /F
   ```
2. Or change the port in `application.properties`:
   ```properties
   server.port=8081
   ```

#### 🔴 Frontend Issues

**Problem:** `npm install` fails

**Solution:**
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```
2. Delete `node_modules` and `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

**Problem:** Cannot connect to backend

**Solution:**
1. Verify backend is running on port 8080
2. Check CORS configuration in `WebConfig.java`
3. Check `API_BASE_URL` in `frontend/src/services/api.js`
4. Open browser console (F12) for detailed errors

#### 🔴 Database Issues

**Problem:** `database "shopify_db" does not exist`

**Solution:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE shopify_db;
```

**Problem:** Authentication failed

**Solution:**
1. Check PostgreSQL pg_hba.conf file
2. Verify username and password
3. Try resetting PostgreSQL password:
   ```bash
   ALTER USER postgres WITH PASSWORD 'newpassword';
   ```

#### 🔴 Maven Build Issues

**Problem:** `Failed to execute goal`

**Solution:**
1. Clean Maven cache:
   ```bash
   mvn clean
   ```
2. Update dependencies:
   ```bash
   mvn dependency:resolve
   ```
3. Check Java version:
   ```bash
   java -version
   # Must be 17 or higher
   ```

---

## 🔒 Security Notes

### ⚠️ IMPORTANT: Before Pushing to GitHub

1. **Never commit sensitive files:**
   - ❌ `backend/src/main/resources/application.properties`
   - ❌ `.env` files
   - ❌ Database credentials
   - ❌ API keys or tokens

2. **Files already protected by `.gitignore`:**
   - ✅ `application.properties` (use `application.properties.example` instead)
   - ✅ `.env` (use `.env.example` instead)
   - ✅ `target/` directory
   - ✅ `node_modules/` directory
   - ✅ All build artifacts

3. **Before first commit:**
   ```bash
   # Check what will be committed
   git status
   
   # Ensure no sensitive files are listed
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

4. **If you accidentally committed secrets:**
   ```bash
   # Remove from Git history
   git rm --cached backend/src/main/resources/application.properties
   git commit -m "Remove sensitive file"
   
   # Add to .gitignore
   echo "backend/src/main/resources/application.properties" >> .gitignore
   git add .gitignore
   git commit -m "Update gitignore"
   ```

5. **Production Security Checklist:**
   - [ ] Use environment variables for credentials
   - [ ] Implement proper authentication (JWT, OAuth)
   - [ ] Enable HTTPS
   - [ ] Use prepared statements (already done with JPA)
   - [ ] Implement rate limiting
   - [ ] Add input validation
   - [ ] Enable SQL injection protection
   - [ ] Set up proper CORS policies
   - [ ] Use secrets management (AWS Secrets Manager, Azure Key Vault)

---

## 🎨 Development Features

### Hot Reload / Live Reload

- **Frontend**: Vite provides instant Hot Module Replacement (HMR)
  - Changes reflect immediately without page refresh
- **Backend**: Spring Boot DevTools enables automatic restart
  - Add to `pom.xml` if not present:
    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <optional>true</optional>
    </dependency>
    ```

### Debugging

**Frontend:**
- Use React DevTools browser extension
- Chrome: [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- Firefox: [React DevTools](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

**Backend:**
- Enable debug logging in `application.properties`:
  ```properties
  logging.level.com.shopify=DEBUG
  logging.level.org.springframework.web=DEBUG
  ```
- Use IntelliJ IDEA or Eclipse debugger
- Set breakpoints and inspect variables

### Database Management Tools

- **pgAdmin 4** (GUI): [Download](https://www.pgadmin.org/download/)
- **DBeaver** (Universal): [Download](https://dbeaver.io/download/)
- **psql** (CLI): Comes with PostgreSQL

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
6. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add comments to complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 📄 License

This project is created for **educational purposes**. Feel free to use it for learning and development.

---

## 📧 Support & Contact

- **Issues**: [Create an issue](https://github.com/yourusername/shopify/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/shopify/discussions)
- **Email**: your.email@example.com

---

## 🙏 Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [PostgreSQL](https://www.postgresql.org/)

---

## 📊 Project Status

✅ **Completed Features:**
- Database schema and setup
- Backend REST API
- Frontend UI with React
- Dashboard with statistics
- Product management
- Dark/Light theme
- Responsive design

🚧 **Planned Features:**
- User authentication with JWT
- Role-based access control
- Shopping cart functionality
- Order management
- Payment integration
- Email notifications
- File upload for product images
- Search and filter products
- Pagination for large datasets

---

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Basic CRUD operations
- Dashboard with statistics
- Responsive UI with dark mode
- Sample data seeding

---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

**Made with ❤️ using Spring Boot, React, and PostgreSQL**

**Happy Coding! 🚀**

</div>

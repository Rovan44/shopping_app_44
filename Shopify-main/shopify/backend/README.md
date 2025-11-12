# Shopify Backend - Spring Boot Application

A RESTful API backend for the Shopify application built with Spring Boot and PostgreSQL.

## Features

- Spring Boot 3.2.0
- PostgreSQL Database
- JPA/Hibernate ORM
- RESTful API endpoints
- CORS enabled for frontend
- Automatic data loading on startup

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+

## Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE shopify_db;
```

2. Update credentials in `src/main/resources/application.properties` if needed:
```properties
spring.datasource.username=root
spring.datasource.password=root
```

## Running the Application

### Using Maven

```bash
# Navigate to the backend folder
cd shopify/backend

# Clean and install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### Using IDE

1. Open the project in IntelliJ IDEA or Eclipse
2. Run `ShopifyApplication.java` main class

## API Endpoints

### Dashboard Endpoint
- **GET** `/api/dashboard`
- Returns dashboard statistics including:
  - Total number of products
  - List of all categories
  - Total inventory value
  - Total items in stock

### Products Endpoint
- **GET** `/api/products`
- Returns list of all products with their details

## Sample Response

### Dashboard Stats
```json
{
  "totalProducts": 4,
  "categories": [
    { "id": 1, "name": "Food" },
    { "id": 2, "name": "Mobiles" },
    { "id": 3, "name": "Electronics" },
    { "id": 4, "name": "Stationery" }
  ],
  "totalValue": 64197.75,
  "totalItemsInStock": 475
}
```

### Products List
```json
[
  {
    "id": 1,
    "name": "Organic Apple",
    "price": 3.99,
    "totalItemsInStock": 150,
    "category": { "id": 1, "name": "Food" }
  },
  ...
]
```

## Pre-loaded Data

The application automatically loads sample data on first startup:

**Categories:**
- Food
- Mobiles
- Electronics
- Stationery

**Products:**
- Organic Apple (Food) - $3.99, 150 items
- iPhone 15 Pro (Mobiles) - $999.99, 50 items
- Sony Headphones (Electronics) - $299.99, 75 items
- Notebook Set (Stationery) - $12.99, 200 items

## Project Structure

```
backend/
├── src/main/java/com/shopify/
│   ├── ShopifyApplication.java       # Main application class
│   ├── DataLoader.java               # Data initialization
│   ├── entity/                       # JPA entities
│   │   ├── Category.java
│   │   └── Product.java
│   ├── repository/                   # JPA repositories
│   │   ├── CategoryRepository.java
│   │   └── ProductRepository.java
│   ├── dto/                          # Data Transfer Objects
│   │   └── DashboardStatsDTO.java
│   ├── service/                      # Business logic
│   │   └── DashboardService.java
│   ├── controller/                   # REST controllers
│   │   ├── DashboardController.java
│   │   └── ProductController.java
│   └── config/                       # Configuration
│       └── WebConfig.java            # CORS configuration
└── src/main/resources/
    └── application.properties        # Application configuration
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify database name, username, and password
- Check if port 5432 is available

### Port Already in Use
Change the server port in `application.properties`:
```properties
server.port=8081
```

## Technologies Used

- **Spring Boot** - Application framework
- **Spring Data JPA** - Data access layer
- **PostgreSQL** - Database
- **Lombok** - Reduce boilerplate code
- **Maven** - Dependency management

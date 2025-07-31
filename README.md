# Grocery Store Application

A full-stack grocery shopping application built with Angular frontend and Spring Boot backend.

## Features

- **Product Catalog**: Browse 10 different grocery items with categories
- **Shopping Cart**: Add, remove, and update item quantities
- **Order Management**: Place orders with customer details
- **Order Tracking**: Real-time order status tracking with estimated delivery times
- **Responsive Design**: Modern, mobile-friendly UI with Bootstrap

## Technology Stack

### Backend
- **Spring Boot 3.2.0** - Java framework
- **Spring Data JPA** - Database operations
- **H2 Database** - In-memory database
- **Maven** - Dependency management

### Frontend
- **Angular 17** - Frontend framework
- **Bootstrap 5** - UI components and styling
- **Font Awesome** - Icons
- **RxJS** - Reactive programming

## Project Structure

```
Grocery App/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/grocery/
│   │       ├── model/       # Entity classes
│   │       ├── repository/  # Data access layer
│   │       ├── service/     # Business logic
│   │       ├── controller/  # REST endpoints
│   │       └── config/      # Configuration
│   └── pom.xml             # Maven dependencies
├── frontend/               # Angular frontend
│   ├── src/app/
│   │   ├── components/     # Angular components
│   │   ├── services/       # HTTP services
│   │   └── models/         # TypeScript interfaces
│   └── package.json        # NPM dependencies
└── README.md
```

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- Maven 3.6 or higher

### Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`

### Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will start on `http://localhost:4200`

## API Endpoints

### Grocery Items
- `GET /api/grocery/items` - Get all items
- `GET /api/grocery/items/{id}` - Get item by ID
- `GET /api/grocery/items/category/{category}` - Get items by category
- `GET /api/grocery/items/search?name={name}` - Search items

### Cart Management
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/items/{cartItemId}` - Update cart item quantity
- `DELETE /api/cart/items/{cartItemId}` - Remove item from cart
- `DELETE /api/cart` - Clear cart
- `GET /api/cart/total` - Get cart total

### Order Management
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/customer/{customerName}` - Get orders by customer
- `POST /api/orders/place` - Place a new order
- `PUT /api/orders/{orderId}/status` - Update order status
- `POST /api/orders/{sessionId}/place` - Place new order
- `PUT /api/orders/{orderId}/status` - Update order status

## Features Overview

### Shopping Experience
1. **Browse Products**: View 10 pre-loaded grocery items with images, descriptions, and prices
2. **Add to Cart**: Select quantities and add items to shopping cart
3. **Cart Management**: Update quantities or remove items from cart
4. **Checkout**: Enter customer details and place order

### Order Tracking
1. **Order Status**: Track orders through multiple stages:
   - Placed
   - Confirmed
   - Preparing
   - Out for Delivery
   - Delivered
2. **Estimated Delivery**: Automatic calculation of delivery times
3. **Order History**: View all past orders

## Database Schema

The application uses H2 in-memory database with the following entities:
- **GroceryItem**: Product information
- **CartItem**: Shopping cart entries
- **Order**: Order details
- **OrderItem**: Individual items in an order

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

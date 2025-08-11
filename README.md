# 🛒 Grocery Store Application

A modern, full-stack grocery shopping application built with **Angular 17** frontend and **Spring Boot 3** backend. This application provides a comprehensive e-commerce experience with advanced features like real-time filtering, wishlist management, order tracking, and responsive design.

![Grocery App](https://img.shields.io/badge/Angular-17-red?style=for-the-badge&logo=angular)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-green?style=for-the-badge&logo=spring-boot)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?style=for-the-badge&logo=bootstrap)

## ✨ Features

### 🛍️ Shopping Experience
- **📦 Product Catalog**: Browse extensive grocery items with categories and search
- **🔍 Advanced Filtering**: Filter by price range, category, stock availability
- **📱 Responsive Design**: Mobile-first, modern UI with Bootstrap 5
- **⚡ Real-time Search**: Debounced search with smart algorithms
- **🔄 Infinite Scroll**: Auto-load more products as you scroll

### 🛒 Cart & Wishlist
- **🛒 Shopping Cart**: Add, remove, and update item quantities
- **💝 Wishlist Management**: Save items for later with persistent storage
- **📊 Cart Analytics**: Real-time cart total and item count
- **🔄 Recently Viewed**: Track and display recently viewed products

### 📋 Order Management
- **📝 Order Placement**: Complete checkout with customer details
- **📊 Order Tracking**: Real-time status tracking with estimated delivery
- **📈 Order History**: View all past orders with detailed information
- **📱 Order Notifications**: Real-time updates on order status

### 🔐 Authentication & Security
- **👤 User Authentication**: Secure login and registration system
- **🔒 JWT Security**: Token-based authentication
- **🛡️ Role-based Access**: Admin and user role management
- **🔐 Protected Routes**: Guarded navigation based on user roles

### 🎨 User Interface
- **🎯 Modern Design**: Clean, intuitive interface with smooth animations
- **📱 Mobile Responsive**: Optimized for all device sizes
- **♿ Accessibility**: ARIA labels and keyboard navigation
- **🌙 Dark Mode Ready**: Theme switching capability
- **🔔 Smart Notifications**: Toast notifications with progress bars

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.2.0** - Modern Java framework
- **Spring Data JPA** - Database operations and ORM
- **Spring Security** - Authentication and authorization
- **H2 Database** - In-memory database for development
- **Maven** - Dependency management and build tool
- **JWT** - JSON Web Token authentication

### Frontend
- **Angular 17** - Latest Angular framework with standalone components
- **TypeScript 5.0** - Type-safe JavaScript
- **Bootstrap 5.3** - Modern CSS framework
- **Font Awesome** - Icon library
- **RxJS** - Reactive programming
- **Angular Material** - Material Design components

## 📁 Project Structure

```
grocery-app/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/grocery/
│   │   ├── config/                   # Configuration classes
│   │   │   ├── DataInitializer.java  # Database initialization
│   │   │   ├── DataLoader.java       # Sample data loading
│   │   │   └── SecurityConfig.java   # Security configuration
│   │   ├── controller/               # REST API controllers
│   │   │   ├── AuthController.java   # Authentication endpoints
│   │   │   ├── CartController.java   # Cart management
│   │   │   ├── GroceryController.java # Product management
│   │   │   └── OrderController.java  # Order management
│   │   ├── model/                    # Entity classes
│   │   │   ├── CartItem.java         # Shopping cart items
│   │   │   ├── GroceryItem.java      # Product information
│   │   │   ├── Order.java            # Order details
│   │   │   ├── OrderItem.java        # Order line items
│   │   │   └── User.java             # User information
│   │   ├── repository/               # Data access layer
│   │   │   ├── CartItemRepository.java
│   │   │   ├── GroceryItemRepository.java
│   │   │   ├── OrderRepository.java
│   │   │   └── UserRepository.java
│   │   ├── security/                 # Security components
│   │   │   ├── JwtAuthFilter.java    # JWT authentication filter
│   │   │   └── JwtUtil.java          # JWT utility functions
│   │   ├── service/                  # Business logic layer
│   │   │   ├── CartService.java      # Cart operations
│   │   │   ├── GroceryService.java   # Product operations
│   │   │   └── OrderService.java     # Order operations
│   │   └── GroceryApplication.java   # Main application class
│   ├── src/main/resources/
│   │   └── application.properties    # Application configuration
│   └── pom.xml                       # Maven dependencies
├── frontend/                         # Angular Frontend
│   ├── src/app/
│   │   ├── components/               # Angular components
│   │   │   ├── cart/                 # Shopping cart
│   │   │   ├── checkout/             # Checkout process
│   │   │   ├── language-selector/    # Language selection
│   │   │   ├── login/                # User authentication
│   │   │   ├── notifications/        # Toast notifications
│   │   │   ├── order-detail/         # Order details view
│   │   │   ├── order-list/           # Order history
│   │   │   ├── product-detail/       # Product information
│   │   │   ├── product-list/         # Product catalog
│   │   │   ├── product-reviews/      # Product reviews
│   │   │   ├── signup/               # User registration
│   │   │   └── wishlist/             # Wishlist management
│   │   ├── guards/                   # Route guards
│   │   │   ├── admin.guard.ts        # Admin access control
│   │   │   ├── auth.guard.ts         # Authentication guard
│   │   │   └── user.guard.ts         # User access control
│   │   ├── models/                   # TypeScript interfaces
│   │   │   ├── cart-item.model.ts    # Cart item interface
│   │   │   ├── grocery-item.model.ts # Product interface
│   │   │   └── order.model.ts        # Order interface
│   │   ├── services/                 # Angular services
│   │   │   ├── auth.service.ts       # Authentication service
│   │   │   ├── cart.service.ts       # Cart operations
│   │   │   ├── grocery.service.ts    # Product operations
│   │   │   ├── notification.service.ts # Notification system
│   │   │   ├── order.service.ts      # Order operations
│   │   │   ├── refresh.service.ts    # Data refresh
│   │   │   └── translation.service.ts # Internationalization
│   │   ├── app.component.ts          # Main app component
│   │   ├── app.routes.ts             # Application routing
│   │   └── main.ts                   # Application entry point
│   ├── src/environments/             # Environment configuration
│   ├── angular.json                  # Angular CLI configuration
│   ├── package.json                  # NPM dependencies
│   ├── proxy.conf.json               # Development proxy
│   └── tsconfig.json                 # TypeScript configuration
├── ENHANCEMENTS.md                   # Detailed feature documentation
└── README.md                         # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- **Java 17** or higher
- **Node.js 18** or higher
- **Maven 3.6** or higher
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shubhamsali2893/grocery-app.git
   cd grocery-app
   ```

2. **Start the Backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

3. **Start the Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The frontend will start on `http://localhost:4200`

4. **Access the Application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:8080
   - H2 Database Console: http://localhost:8080/h2-console

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token

### Grocery Items
- `GET /api/grocery/items` - Get all items
- `GET /api/grocery/items/{id}` - Get item by ID
- `GET /api/grocery/items/category/{category}` - Get items by category
- `GET /api/grocery/items/search?name={name}` - Search items
- `POST /api/grocery/items` - Create new item (Admin)
- `PUT /api/grocery/items/{id}` - Update item (Admin)
- `DELETE /api/grocery/items/{id}` - Delete item (Admin)

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
- `DELETE /api/orders/{id}` - Cancel order

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/orders` - Get user orders

## 🎯 Key Features in Detail

### Advanced Product Filtering
- **Price Range**: Set minimum and maximum price filters
- **Category Selection**: Multi-select category filtering
- **Stock Availability**: Filter by in-stock items only
- **Sorting Options**: Sort by name, price, popularity, or newest
- **Search**: Real-time search with debouncing

### Shopping Cart Features
- **Persistent Cart**: Cart items saved across sessions
- **Quantity Management**: Easy quantity adjustment
- **Real-time Updates**: Instant cart total calculation
- **Bulk Operations**: Add multiple items at once

### Order Tracking System
- **Status Tracking**: Real-time order status updates
- **Delivery Estimation**: Automatic delivery time calculation
- **Order History**: Complete order history with details
- **Email Notifications**: Order status notifications

### User Experience
- **Responsive Design**: Works on all devices
- **Loading States**: Skeleton loading animations
- **Error Handling**: User-friendly error messages
- **Accessibility**: Full keyboard navigation support

## 🔧 Configuration

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:h2:mem:grocerydb
spring.datasource.driverClassName=org.h2.Driver

# JWT Configuration
jwt.secret=your-secret-key
jwt.expiration=86400000

# Server Configuration
server.port=8080
```

### Frontend Configuration
Edit `frontend/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### E2E Testing
```bash
cd frontend
npm run e2e
```

## 📊 Performance Metrics

- **Initial Load Time**: < 2 seconds
- **Search Response**: < 300ms
- **API Response**: < 500ms
- **Image Loading**: Progressive loading
- **Bundle Size**: Optimized with tree shaking

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **CORS Configuration**: Cross-origin resource sharing
- **Input Validation**: Server-side validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Content Security Policy

## 🌐 Deployment

### Backend Deployment
```bash
cd backend
mvn clean package
java -jar target/grocery-app-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment
```bash
cd frontend
ng build --prod
# Deploy dist/ folder to your web server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow Angular style guide
- Use TypeScript strict mode
- Write unit tests for new features
- Update documentation for API changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Angular Team** for the amazing framework
- **Spring Team** for the robust backend framework
- **Bootstrap Team** for the responsive CSS framework
- **Font Awesome** for the beautiful icons

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/shubhamsali2893/grocery-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/shubhamsali2893/grocery-app/discussions)
- **Email**: Contact through GitHub profile

## 🔄 Version History

- **v1.0.0** - Initial release with basic features
- **v1.1.0** - Added authentication and user management
- **v1.2.0** - Enhanced product filtering and search
- **v1.3.0** - Added wishlist and recently viewed features
- **v1.4.0** - Improved UI/UX and performance optimizations

---

⭐ **Star this repository if you find it helpful!**

# Procurement App

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Workflows](#workflows)
   - [Authentication Workflow](#authentication-workflow)
   - [Order Management Workflow](#order-management-workflow)
   - [Search Workflow](#search-workflow)
4. [Components](#components)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Styling](#styling)
8. [Development and Build Process](#development-and-build-process)
9. [Environment Variables](#environment-variables)
10. [Testing](#testing)
11. [Future Enhancements](#future-enhancements)

---

## 1. Introduction

The **Procurement App** is a web-based application designed to streamline the procurement process. It allows users to create, manage, and approve purchase orders. The app includes features such as user authentication, order management, and search functionality. It is built using React for the front end and integrates with a Node.js/Express back end.

---

## 2. Project Structure

The project is organized as follows:
src/ ├── App.jsx # Main application entry point ├── components/ # Reusable React components │ ├── CreateOrder.jsx # Component for creating purchase orders │ ├── logout.jsx # Component for logging out users │ ├── navBar.jsx # Navigation bar component │ ├── OrderList.jsx # Component for displaying and managing orders │ ├── searchbar.jsx # Search bar component for filtering orders │ ├── usercontext.jsx # Context for managing user state │ └── assets/ # Static assets (e.g., images, icons) ├── js/ │ ├── actions/ # Redux action creators │ ├── constants/ # Constants for action types │ ├── reducer/ # Redux reducers │ └── store/ # Redux store configuration ├── pages/ # Page-level components │ ├── add_users.jsx # Page for adding new users │ └── ... # Other pages ├── services/ # API service functions ├── index.js # Application entry point ├── index.css # Global CSS styles └── App.css # Component-specific styles


---

## 3. Workflows

### 3.1 Authentication Workflow
1. **Login**:
   - Users log in via the `/login` endpoint.
   - A JWT token is generated and stored in a cookie for authentication.
   - The `check-auth.js` middleware validates the token for protected routes.

2. **Logout**:
   - The `logout.jsx` component clears the authentication token and redirects the user to the login page.

---

### 3.2 Order Management Workflow
1. **Create Order**:
   - The `CreateOrder.jsx` component allows users to create new purchase orders.
   - Orders are sent to the back end via a POST request to `/api/orders`.

2. **View Orders**:
   - The `OrderList.jsx` component fetches and displays all orders.
   - Admin users can view additional details, such as approvals.

3. **Approve Orders**:
   - Admin users can approve orders via the `PUT /api/orders/:id/approve` endpoint.
   - The `OrderList.jsx` component sends the admin's name and order ID to the back end.

---

### 3.3 Search Workflow
1. **Search Orders**:
   - The `searchbar.jsx` component dispatches a `searchbyname` action to filter orders.
   - The `OrderList.jsx` component displays the filtered results from the Redux store.

---

## 4. Components

### 4.1 `CreateOrder.jsx`
- **Purpose**: Allows users to create new purchase orders.
- **Key Features**:
  - Form for entering supplier, products, and remarks.
  - File upload functionality for attaching documents.

### 4.2 `OrderList.jsx`
- **Purpose**: Displays a list of orders and allows admins to approve or delete them.
- **Key Features**:
  - Fetches orders from the back end.
  - Displays order details, including supplier and product information.
  - Allows admins to approve orders.

### 4.3 `searchbar.jsx`
- **Purpose**: Provides a search bar for filtering orders by name.
- **Key Features**:
  - Dispatches a Redux action to update the `searchResults` state.
  - Works in conjunction with the `OrderList.jsx` component.

### 4.4 `navBar.jsx`
- **Purpose**: Provides navigation links for the application.
- **Key Features**:
  - Links to different pages (e.g., Home, Orders, Users).
  - Displays the logged-in user's name.

### 4.5 `usercontext.jsx`
- **Purpose**: Manages user state using React Context.
- **Key Features**:
  - Provides user information (e.g., name, role) to components.

---

## 5. State Management

The application uses **Redux** for state management. Key features include:

1. **Actions**:
   - Defined in the `js/actions/` folder.
   - Example: `searchbyname` action for filtering orders.

2. **Reducers**:
   - Defined in the `js/reducer/` folder.
   - Example: `rootReducer` manages `searchResults` and other state slices.

3. **Store**:
   - Configured in the `js/store/` folder using `@reduxjs/toolkit`.

---

## 6. API Integration

The application communicates with the back end via RESTful APIs. Key endpoints include:

1. **Authentication**:
   - `POST /login`: Logs in the user and returns a JWT token.

2. **Orders**:
   - `GET /api/orders`: Fetches all orders.
   - `PUT /api/orders/:id/approve`: Approves an order.

3. **Users**:
   - `POST /api/users`: Adds a new user.

---

## 7. Styling

The application uses **Tailwind CSS** for styling. Key configuration files include:

- `tailwind.config.js`: Customizes Tailwind's default configuration.
- `postcss.config.js`: Configures PostCSS for processing Tailwind styles.

---

## 8. Development and Build Process

### Development
1. Install dependencies:
   ```bash
   npm install
2. Start the development server 
    npm start

## 9. Environment Variables
Environment variables are used to configure the application. Key variables include:

- `REACT_APP_API_URL`: Base URL for the back-end API.
- `JWT_SECRET`: Secret key for signing JWT tokens.
## 10. Testing
The application includes unit tests for components and Redux logic. Key files include:

- `App.test.js`: Tests for the main application.
- `setupTests.js`: Configures the testing environment.
- Run tests using: npm test
  
## 11. Future Enhancements
Role-Based Access Control:

Implement fine-grained access control for different user roles.
Pagination:

Add pagination to the OrderList.jsx component for better performance.
Error Handling:

Improve error handling and display user-friendly error messages.
Real-Time Updates:

Use WebSockets or Server-Sent Events (SSE) to update the order list in real time.
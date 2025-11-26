# Cement Depot Admin UI - Complete Structure

This document outlines the complete admin UI structure built for the Cement Depot system.

## 📁 Project Structure

```
src/
├── pages/
│   ├── auth/
│   │   └── login/
│   │       ├── index.tsx           # Login page component
│   │       └── useLogin.ts         # Login business logic & API calls
│   ├── products/
│   │   ├── index.tsx               # Products management page
│   │   └── useProducts.ts          # Products business logic
│   ├── depots/
│   │   ├── index.tsx               # Depots management page
│   │   └── useDepots.ts            # Depots business logic
│   ├── inventory/
│   │   ├── index.tsx               # Inventory management page
│   │   └── useInventory.ts         # Inventory business logic
│   ├── orders/
│   │   ├── index.tsx               # Orders management page
│   │   └── useOrders.ts            # Orders business logic
│   ├── payments/
│   │   ├── index.tsx               # Payments management page
│   │   └── usePayments.ts          # Payments business logic
│   └── admin/
│       ├── Dashboard.tsx           # Main dashboard with reports
│       ├── useDashboard.ts         # Dashboard business logic
│       └── auth-slice.ts           # Redux auth state management
├── components/
│   ├── layout/
│   │   └── AdminLayout.tsx         # Main layout with sidebar & navigation
│   ├── notifications/
│   │   ├── NotificationPanel.tsx   # Notification dropdown component
│   │   └── useNotifications.ts     # Notifications business logic
│   └── ui/
│       ├── button.tsx              # Reusable button component
│       ├── card.tsx                # Reusable card component
│       ├── dialog.tsx              # Reusable dialog/modal component
│       └── input.tsx               # Reusable input component
├── store/
│   ├── emptyApi.ts                 # RTK Query base API configuration
│   ├── results.ts                  # Auto-generated API hooks & types
│   └── store.ts                    # Redux store configuration
└── App.tsx                         # Main app with routing & auth
```

## 🎯 Features Implemented

### 1. Authentication

- **Login Page** (`/login`)
  - Email/password authentication
  - JWT token management
  - Automatic redirect after login
  - Protected routes

### 2. Dashboard (`/`)

- Overview statistics (Revenue, Orders, Products, Depots)
- Orders by status breakdown
- Recent orders list
- Low stock alerts
- Date range filtering for reports

### 3. Products Management (`/products`)

- View all products (paginated)
- Create new products
- Edit existing products
- Delete products
- Product details (name, brand, price, description, image)

### 4. Depots Management (`/depots`)

- View all depot locations
- Create new depots
- Edit depot information
- Delete depots
- Verify depots
- Filter by verification status
- Geographic coordinates support

### 5. Inventory Management (`/inventory`)

- View inventory by depot
- Low stock alerts
- Adjust inventory quantities
- Update stock levels
- Inventory history tracking
- Threshold-based warnings

### 6. Orders Management (`/orders`)

- View all orders (paginated)
- Filter by status and depot
- Update order status
- Assign orders to sellers
- Cancel orders with reason
- Order details view
- Status tracking (pending → delivered)

### 7. Payments Management (`/payments`)

- View all payment transactions
- Filter by payment status
- Process refunds
- Payment method tracking
- Payment reference tracking
- Linked to orders

### 8. Delivery Routes Management (`/routes`)

- Manage delivery routes between depots and destinations
- Create, edit, activate/deactivate, and delete routes
- Filter by depot, destination, status, and pagination
- Look up depot-specific or destination-specific coverage
- Inline status controls with quick actions

### 9. Pricing Intelligence (`/pricing`)

- Calculate pricing for single products and basket orders
- Support delivery vs self-pickup to highlight transport fees
- Find the nearest qualified depot for a destination
- View every destination a depot can service
- Display subtotal, transport fee, and total breakdowns

### 10. Notifications

- Real-time notification panel
- Unread count badge
- Mark as read functionality
- Mark all as read
- Filter unread/all notifications

## 🔧 Technical Architecture

### Business Logic Separation

Each feature follows the pattern:

- **`index.tsx`**: UI component (presentation layer)
- **`use[Feature].ts`**: Custom hook containing:
  - RTK Query hooks
  - API calls
  - State management
  - Business logic
  - Error handling

### Benefits

✅ Clean separation of concerns
✅ Reusable business logic
✅ Easy to test
✅ Easy to maintain
✅ Type-safe with TypeScript

### API Integration

- **RTK Query** for all API calls
- **Auto-generated hooks** from OpenAPI spec
- **Automatic caching** and cache invalidation
- **Optimistic updates**
- **Type-safe** API calls with TypeScript

### State Management

- **Redux Toolkit** for global state
- **Redux Persist** for auth persistence
- **RTK Query** for server state
- **React hooks** for local state

## 📡 API Endpoints Used

All endpoints from the backend are integrated:

### Authentication

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### Products

- `GET /api/v1/products` (list with pagination)
- `POST /api/v1/products` (create)
- `GET /api/v1/products/:id` (get one)
- `PUT /api/v1/products/:id` (update)
- `DELETE /api/v1/products/:id` (delete)

### Depots

- `GET /api/v1/depots` (list with pagination)
- `POST /api/v1/depots` (create)
- `PUT /api/v1/depots/:id` (update)
- `DELETE /api/v1/depots/:id` (delete)
- `POST /api/v1/depots/:id/verify` (verify)

### Inventory

- `GET /api/v1/inventory/depot/:depotId` (by depot)
- `GET /api/v1/inventory/low-stock` (low stock alerts)
- `PUT /api/v1/inventory` (update)
- `POST /api/v1/inventory/adjust` (adjust with reason)

### Orders

- `GET /api/v1/orders` (list with filters)
- `GET /api/v1/orders/:id` (get one)
- `PUT /api/v1/orders/:id/status` (update status)
- `POST /api/v1/orders/:id/assign` (assign to seller)
- `POST /api/v1/orders/:id/cancel` (cancel)

### Payments

- `GET /api/v1/payments/:id` (get one)
- `GET /api/v1/payments/order/:orderId` (by order)
- `POST /api/v1/payments/:id/refund` (process refund)

### Reports

- `GET /api/v1/reports/dashboard` (dashboard data)
- `GET /api/v1/reports/sales` (sales report)

### Notifications

- `GET /api/v1/notifications` (list)
- `GET /api/v1/notifications/unread-count` (count)
- `PATCH /api/v1/notifications/:id/read` (mark as read)
- `PATCH /api/v1/notifications/read-all` (mark all as read)

## 🎨 UI Components

### Layout

- **Responsive sidebar** with collapsible menu
- **Top navigation bar** with notifications
- **Dark mode support** (Tailwind classes)
- **Mobile-friendly** hamburger menu

### Reusable Components

- **Card**: Container for content sections
- **Button**: Multiple variants (primary, outline, etc.)
- **Input**: Form inputs with validation
- **Dialog**: Modals for forms and confirmations
- **NotificationPanel**: Dropdown notification center

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd /Users/mac/Documents/learn/cementdepot_admin
npm install
```

### 2. Start Backend Server

```bash
cd /Users/mac/Documents/learn/cementdepot_backend
npm run dev
```

### 3. Start Admin UI

```bash
cd /Users/mac/Documents/learn/cementdepot_admin
npm run dev
```

### 4. Login

Navigate to `http://localhost:5173/login` and login with admin credentials.

## 🔑 Authentication Flow

1. User enters credentials on `/login`
2. `useLogin` hook calls `usePostApiV1AuthLoginMutation`
3. On success, token is saved to Redux store
4. Redux Persist saves to localStorage
5. User is redirected to dashboard
6. All API calls include `Authorization: Bearer <token>` header
7. On 401 error, token refresh is attempted
8. If refresh fails, user is logged out and redirected to login

## 📊 Data Flow

```
Component (UI)
    ↓
useFeature Hook (Business Logic)
    ↓
RTK Query Hook (API Call)
    ↓
baseApi (with auth header)
    ↓
Backend API
    ↓
Database
```

## 🛡️ Admin-Only Features

All endpoints in this UI are admin-only. The backend should enforce:

- **Role-based access control (RBAC)**
- **JWT authentication**
- **Admin role verification**

## 📝 Type Safety

All API calls are fully typed using TypeScript types generated from the OpenAPI spec:

- Request parameters
- Request body
- Response data
- Error responses

Example:

```typescript
import type { PostApiV1ProductsApiArg, ProductCreate } from '@/store/results';
```

## 🎯 Next Steps

### Potential Enhancements:

1. **Reports Page**: More detailed analytics and charts
2. **User Management**: Manage buyers, sellers, and admins
3. **Settings Page**: System configuration
4. **Audit Logs**: Track admin actions
5. **Export Data**: CSV/Excel export functionality
6. **Advanced Filters**: More filtering options
7. **Bulk Operations**: Batch updates and deletions
8. **File Uploads**: Product images upload
9. **Email Notifications**: Email alerts for low stock
10. **Real-time Updates**: WebSocket integration

## 🐛 Error Handling

All API calls include error handling:

- Network errors
- Validation errors
- Server errors
- Authentication errors
- Permission errors

Errors are displayed to users with appropriate messages.

## ✅ Complete Admin UI

This admin UI provides complete management functionality for:
✅ Authentication & Authorization
✅ Products Management
✅ Depots & Locations
✅ Inventory Tracking
✅ Order Processing
✅ Payment Management
✅ Reports & Analytics
✅ Notifications

All features follow best practices with proper separation of concerns, type safety, and reusable components.

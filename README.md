# AutoRentz 🚗

**Live URL:** [AutoRentz Live](https://autorentz.vercel.app)

---

## 🎯 Project Overview

**AutoRentz** is a backend API for a **vehicle rental management system** that allows admins and customers to manage rentals efficiently. The system handles:

- **Vehicles** – Manage vehicle inventory with availability tracking.
- **Customers** – Manage customer accounts and profiles.
- **Bookings** – Handle vehicle rentals, returns, and automatic cost calculation.
- **Authentication & Authorization** – Secure role-based access for Admin and Customer roles.

---

## 🛠️ Technology Stack

- **Node.js + TypeScript** – Backend runtime and type safety
- **Express.js** – Web framework for API development
- **PostgreSQL** – Relational database
- **bcrypt** – Password hashing
- **jsonwebtoken (JWT)** – Token-based authentication

---

## 📁 Code Structure

The project follows a **modular architecture** with **separation of concerns**:

```
src/
├─ modules/
│  ├─ auth/
│  │  ├─ auth.routes.ts
│  │  ├─ auth.controller.ts
│  │  └─ auth.service.ts
│  ├─ users/
│  │  ├─ users.routes.ts
│  │  ├─ users.controller.ts
│  │  └─ users.service.ts
│  ├─ vehicles/
│  │  ├─ vehicles.routes.ts
│  │  ├─ vehicles.controller.ts
│  │  └─ vehicles.service.ts
│  └─ bookings/
│     ├─ bookings.routes.ts
│     ├─ bookings.controller.ts
│     └─ bookings.service.ts
├─ middleware/
│  └─ auth.middleware.ts
├─ utils/
│  └─ jwt.ts
├─ app.ts
└─ server.ts
```

- **Routes** – Define API endpoints
- **Controllers** – Handle HTTP requests/responses
- **Services** – Business logic and database operations
- **Middleware** – For authentication and request validation
- **Utils** – Helper functions like JWT handling
- **app.ts** – Express app setup
- **server.ts** – Entry point to start the server

---

## 📊 Database Tables

### **Users**

| Field    | Notes                       |
| -------- | --------------------------- |
| id       | Auto-generated              |
| name     | Required                    |
| email    | Required, unique, lowercase |
| password | Required, min 6 characters  |
| phone    | Required                    |
| role     | 'admin' or 'customer'       |

### **Vehicles**

| Field               | Notes                         |
| ------------------- | ----------------------------- |
| id                  | Auto-generated                |
| vehicle_name        | Required                      |
| type                | 'car', 'bike', 'van' or 'SUV' |
| registration_number | Required, unique              |
| daily_rent_price    | Required, positive            |
| availability_status | 'available' or 'booked'       |

### **Bookings**

| Field           | Notes                               |
| --------------- | ----------------------------------- |
| id              | Auto-generated                      |
| customer_id     | References Users                    |
| vehicle_id      | References Vehicles                 |
| rent_start_date | Required                            |
| rent_end_date   | Required, must be after start date  |
| total_price     | Required, positive                  |
| status          | 'active', 'cancelled' or 'returned' |

---

## 🔐 Authentication & Authorization

- **User Roles:**

  - **Admin** – Full access to manage vehicles, users, and all bookings.
  - **Customer** – Can register, view vehicles, create/manage own bookings.

- **Authentication Flow:**
  1. Passwords are hashed using **bcrypt** before storage.
  2. User login via `/api/v1/auth/signin` returns a **JWT**.
  3. Protected endpoints require `Authorization: Bearer <token>` header.
  4. JWT is validated and permissions checked; returns `401` or `403` if unauthorized.

---

## 🌐 API Endpoints

**Refer to API Reference for full request/response specifications. All endpoints must match exactly.**

### **Authentication**

| Method | Endpoint            | Access | Description           |
| ------ | ------------------- | ------ | --------------------- |
| POST   | /api/v1/auth/signup | Public | Register new user     |
| POST   | /api/v1/auth/signin | Public | Login and receive JWT |

### **Vehicles**

| Method | Endpoint                    | Access | Description                                 |
| ------ | --------------------------- | ------ | ------------------------------------------- |
| POST   | /api/v1/vehicles            | Admin  | Add new vehicle                             |
| GET    | /api/v1/vehicles            | Public | View all vehicles                           |
| GET    | /api/v1/vehicles/:vehicleId | Public | View specific vehicle                       |
| PUT    | /api/v1/vehicles/:vehicleId | Admin  | Update vehicle details                      |
| DELETE | /api/v1/vehicles/:vehicleId | Admin  | Delete vehicle (only if no active bookings) |

### **Users**

| Method | Endpoint              | Access       | Description                                          |
| ------ | --------------------- | ------------ | ---------------------------------------------------- |
| GET    | /api/v1/users         | Admin        | View all users                                       |
| PUT    | /api/v1/users/:userId | Admin or Own | Admin: Update any user; Customer: Update own profile |
| DELETE | /api/v1/users/:userId | Admin        | Delete user (only if no active bookings)             |

### **Bookings**

| Method | Endpoint                    | Access         | Description                                                                                                 |
| ------ | --------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------- |
| POST   | /api/v1/bookings            | Customer/Admin | Create booking, validate vehicle availability, calculate total price, mark vehicle as booked                |
| GET    | /api/v1/bookings            | Role-based     | Admin: View all bookings; Customer: View own bookings                                                       |
| PUT    | /api/v1/bookings/:bookingId | Role-based     | Customer: Cancel booking (before start date); Admin: Mark as returned; System: Auto-return when period ends |

---

## ⚙️ Features

- Role-based access control with JWT
- Vehicle availability tracking
- Automatic total price calculation for bookings
- Auto-return of expired bookings
- CRUD operations for vehicles, users, and bookings
- Modular architecture for maintainability

---

## 📝 Setup & Usage

1. **Clone the repository**

```bash
git clone https://github.com/a1shuvo/autorentz.git
cd autorentz
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```env
CONNECTION_STR=your_database_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

4. **Run migrations / create tables**  
   Ensure PostgreSQL database is running and tables are created according to schema.

5. **Start the server**

```bash
npm run dev
```

6. **Test API endpoints**  
   Use Postman or any API client to interact with `/api/v1/...` endpoints.

---

## 📂 Notes

- Follow the **modular structure** strictly for maintainability.
- Ensure **role-based permissions** for all endpoints.
- Handle **vehicle and user deletion constraints** properly (no active bookings).
- All endpoints return **JSON responses** with `success`, `message`, and `data` fields.

---

## 🚀 Future Improvements

- **Payment Integration** – Add online payment gateway support for booking payments.
- **Notifications** – Implement email or SMS notifications for booking confirmations, cancellations, and returns.
- **Advanced Search & Filters** – Allow customers to search vehicles by type, price, availability, and location.
- **Reporting & Analytics** – Admin dashboard to monitor bookings, revenue, and vehicle utilization.
- **Soft Delete & Audit Logs** – Track all changes to bookings, users, and vehicles for audit purposes.
- **Caching & Performance Optimization** – Use Redis or similar caching for frequently accessed data.
- **Automated Tests** – Add unit, integration, and end-to-end tests for robust API reliability.
- **Dockerization** – Containerize the application for easier deployment and scalability.
- **Role Expansion** – Support additional roles like staff, mechanics, or partners for extended functionality.

---

**AutoRentz – Vehicle Rental Management API** 🚗💨

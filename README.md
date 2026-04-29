# Full-Stack E-Commerce Application

A complete MERN e-commerce application with JWT authentication, local cart management, order checkout, user order history, and an admin dashboard for products and orders.

## Tech Stack

- Frontend: React, React Router DOM, Axios, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Auth: JWT and bcryptjs

## Environment Variables

Create `server/.env`:

```env
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## Install Dependencies

```bash
npm install
npm run install-all
```

Or install each app separately:

```bash
cd server
npm install
cd ../client
npm install
```

## Seed the Database

Make sure MongoDB is running locally, then run:

```bash
npm run seed
```

Seeded accounts:

- Admin: `admin@store.com` / `admin123`
- User: `user@store.com` / `user123`

## Run the App

From the root:

```bash
npm run dev
```

Or in two terminals:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` admin only
- `PUT /api/products/:id` admin only
- `DELETE /api/products/:id` admin only
- `POST /api/orders` authenticated
- `GET /api/orders/my` authenticated
- `GET /api/orders` admin only
- `PUT /api/orders/:id/status` admin only

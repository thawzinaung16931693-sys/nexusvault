# Lotaya Digital Store

A premium digital products storefront for AI tools, media subscriptions, creative software, and more. Built with a cinematic dark-purple aesthetic and a full admin dashboard.

## Features

- **Product Catalog** — Browse and search digital products with filtering and sorting
- **Shopping Cart** — Add items, adjust quantities, and checkout
- **Order Management** — Track orders with status updates
- **Admin Dashboard** — Full CRUD for products, orders, and users
- **WebGL Aurora Background** — Custom shader with mouse-reactive effects
- **OAuth 2.0 Authentication** — Secure login with role-based access

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Hono + tRPC + Drizzle ORM
- **Database**: Neon Postgres (serverless)
- **Auth**: OAuth 2.0 with Kimi

## Getting Started

```bash
npm install
npm run db:push
npm run dev
```

## Admin Access

The first user to log in (the app creator) is automatically assigned the `admin` role.

## Database Schema

- `users` — Authentication and roles
- `categories` — Product categories (AI, Creative, Media, Dev, Security, Cloud, Analytics)
- `products` — Digital products with pricing, ratings, and features
- `carts` & `cartItems` — Shopping cart management
- `orders` & `orderItems` — Order tracking

## License

MIT

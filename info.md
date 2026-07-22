# Lotaya Digital Store Info

## Database Setup

1. Create a `.env` file based on `.env.example`
2. Run `npm run db:push` to sync schema
3. Run `npx tsx db/seed.ts` to seed initial data

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run check` | Type check TypeScript |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Generate migration SQL |
| `npm run db:migrate` | Apply pending migrations |

## Project Structure

```
├── api/              # Backend (tRPC routers, queries, auth)
├── contracts/        # Shared types (frontend + backend)
├── db/               # Database schema and seed
├── src/              # Frontend (React + TypeScript)
│   ├── components/   # UI components
│   ├── pages/        # Route-level pages
│   ├── hooks/        # Custom React hooks
│   └── providers/    # Context providers
└── public/           # Static assets
```

## Features

- Product catalog with search, filter, sort
- Shopping cart with quantity management
- Order checkout and history
- Admin dashboard with CRUD operations
- OAuth 2.0 authentication
- Role-based access control

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `APP_ID` | OAuth app ID |
| `APP_SECRET` | OAuth app secret |
| `OWNER_UNION_ID` | Admin user union ID |

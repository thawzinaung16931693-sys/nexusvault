FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production=false

# Build frontend
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Copy server files
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY api ./api
COPY db ./db
COPY contracts ./contracts

# Expose port
EXPOSE 3001

# Start the server
CMD ["npx", "tsx", "api/boot.ts"]

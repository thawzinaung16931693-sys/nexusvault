#!/bin/bash
# ============================================================
# Lotaya Digital Store - Database Setup Script
# Run this AFTER setting DATABASE_URL in your .env file
# ============================================================

set -e

echo "=========================================="
echo "  Database Setup - Lotaya Digital Store"
echo "=========================================="

# Check .env exists
if [ ! -f .env ]; then
    echo "ERROR: .env file not found!"
    echo "Create one with DATABASE_URL=your_connection_string"
    exit 1
fi

# Source .env
export $(grep -v '^#' .env | xargs)

if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL not set in .env"
    exit 1
fi

echo ""
echo "[1/3] Pushing schema to database..."
npx drizzle-kit push --force

echo ""
echo "[2/3] Seeding database with sample data..."
npx tsx db/seed.ts

echo ""
echo "[3/3] Verifying..."
echo ""
echo "=========================================="
echo "  Database setup complete!"
echo "=========================================="
echo ""
echo "  Tables created:"
echo "    - users"
echo "    - categories"
echo "    - products"
echo "    - carts"
echo "    - cart_items"
echo "    - orders"
echo "    - order_items"
echo ""
echo "  Sample data:"
echo "    - 6 categories"
echo "    - 10 products"
echo ""
echo "=========================================="

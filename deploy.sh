#!/bin/bash
# ============================================================
# Lotaya Digital Store - VPS Deployment Script
# Run this script ON your VPS (18.143.133.17)
# ============================================================

set -e

echo "=========================================="
echo "  Lotaya Digital Store - Deployment"
echo "=========================================="

# --- Step 1: Update system & install Docker ---
echo ""
echo "[1/6] Installing Docker..."
if ! command -v docker &> /dev/null; then
    sudo apt-get update -y
    sudo apt-get install -y ca-certificates curl gnupg
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    sudo usermod -aG docker $USER
    echo "Docker installed successfully!"
else
    echo "Docker already installed."
fi

# --- Step 2: Clone or update the repository ---
echo ""
echo "[2/6] Setting up application..."
APP_DIR="$HOME/lotaya-digital-store"

if [ -d "$APP_DIR" ]; then
    cd "$APP_DIR"
    git pull origin main
else
    git clone https://github.com/thawzinaung16931693-sys/nexusvault.git "$APP_DIR"
    cd "$APP_DIR"
fi

# --- Step 3: Create .env file if not exists ---
echo ""
echo "[3/6] Checking environment variables..."
if [ ! -f .env ]; then
    echo "Creating .env file... Please edit it with your actual values!"
    cat > .env << 'EOF'
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Neon Auth (get from Neon Console → Project → Branch → Auth)
VITE_NEON_AUTH_URL=https://ep-xxx.neonauth.region.aws.neon.tech/neondb/auth

# Optional
OWNER_UNION_ID=
NODE_ENV=production
EOF
    echo ""
    echo "!!! IMPORTANT: Edit .env with your actual credentials !!!"
    echo "Run: nano $APP_DIR/.env"
    echo ""
    echo "After editing .env, run this script again."
    exit 0
fi

# --- Step 4: Build and start containers ---
echo ""
echo "[4/6] Building Docker images..."
sudo docker compose build --no-cache

echo ""
echo "[5/6] Starting services..."
sudo docker compose down 2>/dev/null || true
sudo docker compose up -d

# --- Step 6: Verify ---
echo ""
echo "[6/6] Verifying deployment..."
sleep 5

if curl -s -o /dev/null -w "%{http_code}" http://localhost:80 | grep -q "200"; then
    echo ""
    echo "=========================================="
    echo "  Deployment Successful!"
    echo "=========================================="
    echo ""
    echo "  Your store is live at:"
    echo "  http://18.143.133.17"
    echo ""
    echo "=========================================="
else
    echo ""
    echo "Checking container status..."
    sudo docker compose ps
    sudo docker compose logs --tail=20
    echo ""
    echo "Something may need attention. Check the logs above."
fi

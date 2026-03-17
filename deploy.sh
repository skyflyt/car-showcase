#!/usr/bin/env bash
set -euo pipefail
APP_DIR="/opt/car-showcase/app"
SERVICE_NAME="car-showcase"
APP_USER="car-showcase"
UPLOAD_DIR="/opt/car-showcase/uploads"
echo "=== Car Showcase Deploy ==="
date
cd "$APP_DIR"
sudo -u "$APP_USER" git fetch origin
sudo -u "$APP_USER" git reset --hard origin/main
sudo -u "$APP_USER" npm ci
sudo -u "$APP_USER" npx prisma generate
sudo -u "$APP_USER" npx prisma db push
# Ensure uploads directory exists (persists across deploys)
sudo -u "$APP_USER" mkdir -p "$UPLOAD_DIR"
# Source env vars for build (auth secrets, etc.)
if [ -f /opt/car-showcase/.env ]; then
  set -a
  source /opt/car-showcase/.env
  set +a
fi
sudo -u "$APP_USER" \
  UPLOAD_DIR="$UPLOAD_DIR" \
  AUTH_SECRET="${AUTH_SECRET:-}" \
  AUTH_TRUST_HOST=true \
  AZURE_AD_CLIENT_ID="${AZURE_AD_CLIENT_ID:-}" \
  AZURE_AD_CLIENT_SECRET="${AZURE_AD_CLIENT_SECRET:-}" \
  AZURE_AD_TENANT_ID="${AZURE_AD_TENANT_ID:-}" \
  npm run build
systemctl restart "$SERVICE_NAME"
systemctl --no-pager status "$SERVICE_NAME"
echo "=== Deploy complete ==="

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
sudo -u "$APP_USER" UPLOAD_DIR="$UPLOAD_DIR" npm run build
systemctl restart "$SERVICE_NAME"
systemctl --no-pager status "$SERVICE_NAME"
echo "=== Deploy complete ==="

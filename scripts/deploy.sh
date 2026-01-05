#!/bin/bash
# Zero-downtime deployment script for Laravel
# Usage: ./deploy.sh <release_name>

set -e

# Configuration
APP_DIR="/var/www/mudakkik"
RELEASES_DIR="$APP_DIR/releases"
SHARED_DIR="$APP_DIR/shared"
KEEP_RELEASES=5

# Get release name from argument or generate new one
RELEASE_NAME="${1:-$(date +%Y%m%d_%H%M%S)}"
RELEASE_DIR="$RELEASES_DIR/$RELEASE_NAME"

echo "🚀 Starting deployment: $RELEASE_NAME"

# Verify release directory exists (created by rsync in GitHub Actions)
if [ ! -d "$RELEASE_DIR" ]; then
    echo "❌ Release directory not found: $RELEASE_DIR"
    exit 1
fi

cd "$RELEASE_DIR"

# Link shared .env file
echo "📁 Linking shared resources..."
ln -nfs "$SHARED_DIR/.env" "$RELEASE_DIR/.env"

# Link shared storage directory
rm -rf "$RELEASE_DIR/storage"
ln -nfs "$SHARED_DIR/storage" "$RELEASE_DIR/storage"

# Install Composer dependencies (production)
echo "📦 Installing Composer dependencies..."
composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Laravel optimizations
echo "⚡ Optimizing Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Run database migrations
echo "🗃️ Running migrations..."
php artisan migrate --force

# Switch symlink to new release (atomic operation = zero downtime)
echo "🔗 Switching to new release..."
ln -nfs "$RELEASE_DIR" "$APP_DIR/current"

# Fix permissions
echo "🔐 Fixing permissions..."
sudo chown -R ubuntu:www-data "$RELEASE_DIR/bootstrap/cache"
sudo chmod -R 775 "$RELEASE_DIR/bootstrap/cache"

# Restart PHP-FPM
echo "🔄 Restarting services..."
sudo systemctl reload php8.3-fpm

# Restart queue workers
sudo supervisorctl restart mudakkik-worker:* || true

# Health check
echo "🏥 Running health check..."
sleep 2
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost || echo "000")
if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 400 ]; then
    echo "✅ Health check passed (HTTP $HTTP_CODE)"
else
    echo "⚠️ Health check returned HTTP $HTTP_CODE (may need manual verification)"
fi

# Cleanup old releases
echo "🧹 Cleaning up old releases..."
cd "$RELEASES_DIR"
ls -dt */ | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf

echo "✅ Deployment completed successfully!"
echo "📍 Current release: $RELEASE_NAME"
echo ""
echo "📅 Scheduled Jobs (ensure cron is configured):"
echo "   - ReconcilePendingPayments: */10 * * * *"
echo "   - HandleExpiredSubscriptions: 0 0 * * *"

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

# Capture previous release for rollback
PREVIOUS=$(readlink -f "$APP_DIR/current" 2>/dev/null || true)

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

# Create public storage symlink
php artisan storage:link || true

# Install Composer dependencies (production)
echo "📦 Installing Composer dependencies..."
composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Laravel optimizations
echo "⚡ Optimizing Laravel..."
php artisan optimize:clear
php artisan optimize

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

# Restart Horizon workers (graceful termination)
php artisan horizon:terminate
sudo supervisorctl restart mudakkik-horizon || true

# Clear OPcache to ensure new code is loaded
echo "🧹 Clearing caches..."
if ! php artisan optimize:clear 2>&1; then
    echo "⚠️ Cache clear reported errors (continuing deployment)"
fi

# Health check with retry logic
echo "🏥 Running health check..."
MAX_RETRIES=3
RETRY_DELAY=3

for i in $(seq 1 $MAX_RETRIES); do
    sleep $RETRY_DELAY
    # Source .env to get APP_URL
    if [ -f .env ]; then
        source .env
    fi
    HEALTH_URL="${APP_URL:-http://localhost}/up"

    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || echo "000")
    if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 400 ]; then
        echo "✅ Health check passed (HTTP $HTTP_CODE)"
        break
    elif [ "$i" -eq "$MAX_RETRIES" ]; then
        echo "❌ Health check failed after $MAX_RETRIES attempts (HTTP $HTTP_CODE)"
        exit 1
    else
        echo "⏳ Retry $i/$MAX_RETRIES - waiting for server..."
    fi
done

# Cleanup old releases
echo "🧹 Cleaning up old releases..."
cd "$RELEASES_DIR"
ls -dt */ | tail -n +$((KEEP_RELEASES + 1)) | xargs -r sudo rm -rf

echo "✅ Deployment completed successfully!"
echo "📍 Current release: $RELEASE_NAME"
echo ""
echo "📅 Scheduled Jobs (ensure cron is configured):"
echo "   - ReconcilePendingPayments: */10 * * * *"
echo "   - HandleExpiredSubscriptions: 0 0 * * *"
echo "   - Queue Workers: Handling Welcome, Payments, Subscriptions notifications"

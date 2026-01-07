#!/bin/bash
# EC2 Initial Setup Script for Laravel + Inertia.js
# Run this once on a fresh Ubuntu EC2 instance

set -e

echo "🚀 Starting EC2 setup..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Add PHP repository
echo "📦 Adding PHP repository..."
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update

# Install PHP 8.3 and extensions
echo "🐘 Installing PHP 8.3..."
sudo apt install -y \
    php8.3 \
    php8.3-fpm \
    php8.3-cli \
    php8.3-common \
    php8.3-mysql \
    php8.3-pgsql \
    php8.3-sqlite3 \
    php8.3-mbstring \
    php8.3-xml \
    php8.3-curl \
    php8.3-zip \
    php8.3-redis \
    php8.3-gd \
    php8.3-bcmath \
    php8.3-intl

# Install Composer
echo "🎼 Installing Composer..."
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install -y nginx

# Install Redis
echo "🔴 Installing Redis..."
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Install Supervisor for queue workers
echo "👷 Installing Supervisor..."
sudo apt install -y supervisor

# Install Git
echo "📚 Installing Git..."
sudo apt install -y git

# Create application directory structure
echo "📁 Creating application directories..."
sudo mkdir -p /var/www/mudakkik/{releases,shared/storage/{app/public,framework/{cache,sessions,views},logs},scripts}
sudo chown -R ubuntu:www-data /var/www/mudakkik
sudo chmod -R 775 /var/www/mudakkik

# Create storage subdirectories
mkdir -p /var/www/mudakkik/shared/storage/app/public
mkdir -p /var/www/mudakkik/shared/storage/framework/{cache,sessions,views}
mkdir -p /var/www/mudakkik/shared/storage/logs

# Set proper permissions
sudo chown -R ubuntu:www-data /var/www/mudakkik/shared/storage
sudo chmod -R 775 /var/www/mudakkik/shared/storage

# Setup Laravel Scheduler cron job
echo "⏰ Setting up Laravel Scheduler cron..."
CRON_JOB="* * * * * cd /var/www/mudakkik/current && php artisan schedule:run >> /dev/null 2>&1"
(crontab -l 2>/dev/null | grep -v "schedule:run"; echo "$CRON_JOB") | crontab -
echo "✅ Scheduler cron job added"

echo ""
echo "✅ EC2 setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Copy scripts/nginx.conf to /etc/nginx/sites-available/mudakkik"
echo "   2. Enable site: sudo ln -s /etc/nginx/sites-available/mudakkik /etc/nginx/sites-enabled/"
echo "   3. Remove default: sudo rm /etc/nginx/sites-enabled/default"
echo "   4. Copy scripts/supervisor.conf to /etc/supervisor/conf.d/mudakkik.conf"
echo "   5. Create /var/www/mudakkik/shared/.env with production values"
echo "   6. Reload services: sudo systemctl reload nginx && sudo supervisorctl reread && sudo supervisorctl update"
echo ""
echo "📅 Scheduled Jobs (handled by cron):"
echo "   - ReconcilePendingPayments: Every 10 minutes"
echo "   - HandleExpiredSubscriptions: Daily at midnight"
echo ""

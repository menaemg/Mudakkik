<p align="center">
  <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="300" alt="Laravel Logo">
</p>

<h1 align="center">Mudakkik - مُدَقِّق</h1>

<p align="center">
  <strong>A Modern News Verification & Content Management Platform</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#api-endpoints">API Endpoints</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## 📖 Overview

**Mudakkik** (مُدَقِّق - "The Verifier") is a comprehensive news verification and content management platform built with Laravel 12 and React. It provides AI-powered fact-checking capabilities, subscription-based access, and a robust admin panel for content moderation.

---

## ✨ Features

### 🔍 News Verification & Fact-Checking
- AI-powered news verification system
- Trusted domain management
- Fact-check history tracking
- Credit-based verification system

### 📰 Content Management
- Article/post creation and management
- Category and tag organization
- Slug-based article URLs
- Featured posts and home page customization
- AI content auditing for posts and reports

### 👥 User Management
- Multi-role system (User, Journalist, Admin)
- Journalist upgrade requests with document verification
- User profiles with subscription management
- Email verification and notifications

### 💳 Subscription & Payments
- Multiple subscription plans
- Stripe payment integration
- Payment history and receipts
- Automatic subscription expiration handling
- Pending payment reconciliation

### 📢 Advertising System
- User advertisement submissions
- Ad request management
- Rotating ad display

### 📊 Admin Dashboard
- Comprehensive statistics and analytics
- User management
- Content moderation
- Home page section management (Hero, Featured, Ticker, etc.)
- Post reports and AI audit reviews

### 🔔 Notification System
- Email and database notifications
- Payment confirmations
- Subscription updates
- Post status notifications
- Report status updates

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| PHP | ^8.2 | Runtime |
| Laravel | ^12.0 | Framework |
| Laravel Horizon | ^5.41 | Queue Monitoring |
| Laravel Sanctum | ^4.0 | API Authentication |
| Stripe PHP | ^19.1 | Payment Processing |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^18.2.0 | UI Library |
| Inertia.js | ^2.0.0 | SPA Bridge |
| TailwindCSS | ^3.2.1 | Styling |
| Framer Motion | ^12.23.26 | Animations |
| Chart.js / Recharts | Latest | Data Visualization |
| Lucide React | ^0.562.0 | Icons |
| SweetAlert2 | ^11.26.17 | Alerts & Modals |

### Development Tools
| Tool | Purpose |
|------|---------|
| Vite | Build Tool |
| Pest PHP | Testing |

---

## 📁 Project Structure

```
Mudakkik/
├── app/
│   ├── Console/              # Artisan commands
│   ├── Contracts/            # Interfaces
│   ├── DTOs/                 # Data Transfer Objects
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/        # Admin panel controllers
│   │   │   │   └── Home/     # Home page section controllers
│   │   │   ├── Api/          # API controllers
│   │   │   ├── Auth/         # Authentication controllers
│   │   │   └── Webhooks/     # Stripe webhook handler
│   │   ├── Middleware/       # Custom middleware
│   │   └── Requests/         # Form request validation
│   ├── Jobs/
│   │   ├── AuditPostContent.php
│   │   ├── AuditReportContent.php
│   │   ├── HandleExpiredSubscriptions.php
│   │   ├── ProcessStripeWebhook.php
│   │   └── ReconcilePendingPayments.php
│   ├── Models/
│   │   ├── Advertisment.php
│   │   ├── Category.php
│   │   ├── FactCheck.php
│   │   ├── Follow.php
│   │   ├── HomeSlot.php
│   │   ├── Like.php
│   │   ├── Payment.php
│   │   ├── Plan.php
│   │   ├── Policy.php
│   │   ├── Post.php
│   │   ├── PostReport.php
│   │   ├── Subscription.php
│   │   ├── Tag.php
│   │   ├── TrustedDomain.php
│   │   ├── UpgradeRequest.php
│   │   └── User.php
│   ├── Notifications/        # Email & database notifications
│   ├── Observers/            # Model observers
│   ├── Providers/            # Service providers
│   ├── Rules/                # Custom validation rules
│   └── Services/
│       ├── AiAuditService.php
│       ├── FactCheckServices.php
│       ├── HomePageService.php
│       └── Payment/          # Payment services
├── config/                   # Configuration files
├── database/
│   ├── factories/            # Model factories
│   ├── migrations/           # Database migrations
│   └── seeders/              # Database seeders
├── resources/
│   └── js/
│       ├── Components/       # Reusable React components
│       ├── Layouts/          # Page layouts
│       │   ├── AdminLayout.jsx
│       │   ├── AuthenticatedLayout.jsx
│       │   ├── GuestLayout.jsx
│       │   └── ProfileLayout.jsx
│       └── Pages/
│           ├── Admin/        # Admin panel pages
│           ├── Auth/         # Authentication pages
│           ├── Home/         # Homepage sections
│           ├── Payment/      # Payment pages
│           ├── Plans/        # Subscription plans
│           ├── Posts/        # Article pages
│           ├── Profile/      # User profile pages
│           ├── Public/       # Public pages (terms, privacy, FAQ)
│           ├── Subscriptions/# Subscription management
│           ├── VerifyNews.jsx
│           └── Welcome.jsx
├── routes/
│   ├── auth.php              # Authentication routes
│   └── web.php               # Web routes
├── scripts/                  # Deployment scripts
│   ├── deploy.sh
│   ├── ec2-setup.sh
│   ├── nginx.conf
│   └── supervisor.conf
├── tests/
│   ├── Feature/              # Feature tests
│   └── Unit/                 # Unit tests
└── .github/
    └── workflows/
        └── deploy.yml        # CI/CD workflow
```

---

## 🚀 Installation

### Prerequisites
- PHP >= 8.2
- Composer
- Node.js & npm
- MySQL/MariaDB or PostgreSQL
- Redis (for queues and Horizon)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Mudakkik
   ```

2. **Run the setup script**
   ```bash
   composer setup
   ```
   This will:
   - Install PHP dependencies
   - Copy `.env.example` to `.env`
   - Generate application key
   - Run migrations
   - Install npm dependencies
   - Build frontend assets

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the following in `.env`:
   ```env
   # Database
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=mudakkik
   DB_USERNAME=your_username
   DB_PASSWORD=your_password

   # Redis (for queues)
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379

   # Stripe
   STRIPE_KEY=your_stripe_key
   STRIPE_SECRET=your_stripe_secret
   STRIPE_WEBHOOK_SECRET=your_webhook_secret

   # Mail
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your_email
   MAIL_PASSWORD=your_app_password
   ```

4. **Start the development server**
   ```bash
   composer run dev
   ```
   This starts concurrently:
   - Laravel development server
   - Queue worker
   - Laravel Pail (log tailing)
   - Vite dev server

5. **Access the application**
   - Main app: `http://localhost:8000`
   - Horizon dashboard: `http://localhost:8000/horizon` (admin only)

---

## 🧪 Testing

Run the test suite using Pest PHP:

```bash
# Run all tests
composer run test

# Or directly with artisan
php artisan test

# Run specific test file
php artisan test tests/Feature/ExampleTest.php

# Run with coverage
php artisan test --coverage
```

---

## 🔗 API Endpoints

### Public Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome/Home page |
| GET | `/articles/{post:slug}` | View article |
| GET | `/posts` | List all posts |
| GET | `/plans` | View subscription plans |
| GET | `/terms` | Terms of service |
| GET | `/privacy` | Privacy policy |
| GET | `/faq` | FAQ page |
| GET | `/check` | News verification page |

### Authenticated Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | User profile |
| PATCH | `/profile` | Update profile |
| GET | `/my-subscription` | View subscription |
| POST | `/subscribe/{plan:slug}` | Subscribe to plan |
| GET | `/my-posts/create` | Create new post |
| POST | `/my-posts` | Store new post |
| GET | `/my-ads` | View user ads |
| POST | `/posts/{post}/like` | Toggle like on post |
| POST | `/posts/{post}/report` | Report a post |

### Fact-Checking (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/search-news` | Search news |
| POST | `/verify-news` | Verify news |
| GET | `/api/fact-check/history` | Verification history |
| GET | `/api/fact-check/{factCheck}` | View fact-check result |

### Admin Routes (Requires admin-access)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard` | Admin dashboard |
| RESOURCE | `/admin/users` | Manage users |
| RESOURCE | `/admin/categories` | Manage categories |
| RESOURCE | `/admin/tags` | Manage tags |
| RESOURCE | `/admin/plans` | Manage plans |
| RESOURCE | `/admin/posts` | Manage posts |
| RESOURCE | `/admin/policies` | Manage policies |
| GET | `/admin/subscriptions` | View subscriptions |
| GET | `/admin/payments` | View payments |
| GET | `/admin/reports` | View reports |
| GET | `/admin/trusted-domains` | Manage trusted domains |
| GET | `/admin/requests/join` | Journalist requests |
| GET | `/admin/requests/ads` | Ad requests |
| GET | `/admin/ai-audit` | AI audit dashboard |

### Admin Home Page Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/admin/home/hero` | Hero section |
| GET/POST | `/admin/home/ticker` | News ticker |
| GET/POST | `/admin/home/featured` | Featured posts |
| GET/POST | `/admin/home/top-stories` | Top stories |
| GET/POST | `/admin/home/top-topics` | Topics section |
| GET/POST | `/admin/home/banner` | Banner section |
| GET/POST | `/admin/home/entertainment` | Entertainment section |
| GET/POST | `/admin/home/business` | Business section |

### Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhooks/stripe` | Stripe webhook handler |

---

## 🔄 Background Jobs

| Job | Description |
|-----|-------------|
| `AuditPostContent` | AI-based content auditing for posts |
| `AuditReportContent` | AI-based content auditing for reports |
| `HandleExpiredSubscriptions` | Handles subscription expiration |
| `ProcessStripeWebhook` | Processes Stripe webhook events |
| `ReconcilePendingPayments` | Reconciles pending payments with Stripe |

---

## 📬 Notifications

The system includes comprehensive notifications:

| Notification | Channels | Description |
|--------------|----------|-------------|
| `WelcomeNewUser` | mail, database | New user welcome |
| `CustomVerifyEmail` | mail | Email verification |
| `JournalistApproved` | mail, database | Journalist request approved |
| `SubscriptionCreated` | mail, database | New subscription |
| `SubscriptionExpired` | mail, database | Subscription expiry |
| `PaymentSuccessful` | mail, database | Payment success |
| `PaymentFailed` | mail, database | Payment failure |
| `PostPublished` | database | Post published |
| `PostRejected` | database | Post rejected |
| `PostPendingReview` | database | Post pending review |
| `PostDeleted` | database | Post deleted |
| `PostMarkedFake` | database | Post marked as fake |
| `PostHiddenByReport` | database | Post hidden due to reports |
| `ReportSubmitted` | database | Report submitted |
| `ReportPendingReview` | database | Report pending review |
| `ReportApproved` | database | Report approved |
| `ReportRejected` | database | Report rejected |
| `StalePaymentAlert` | mail | Alert for stale payments |

---

## 🚢 Deployment

### AWS EC2 Deployment

The project includes deployment scripts in the `/scripts` directory:

1. **Initial Server Setup**
   ```bash
   # On your EC2 instance
   bash scripts/ec2-setup.sh
   ```

2. **Configure Nginx**
   ```bash
   sudo cp scripts/nginx.conf /etc/nginx/sites-available/mudakkik
   sudo ln -s /etc/nginx/sites-available/mudakkik /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```

3. **Configure Supervisor (for queue workers)**
   ```bash
   sudo cp scripts/supervisor.conf /etc/supervisor/conf.d/mudakkik.conf
   sudo supervisorctl reread
   sudo supervisorctl update
   ```

4. **Deploy**
   ```bash
   bash scripts/deploy.sh
   ```

### CI/CD with GitHub Actions

The project uses GitHub Actions for automated deployment. See `.github/workflows/deploy.yml` for the workflow configuration.

---

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `APP_NAME` | Application name | Yes |
| `APP_ENV` | Environment (local/production) | Yes |
| `APP_KEY` | Application encryption key | Yes |
| `APP_URL` | Application URL | Yes |
| `DB_*` | Database configuration | Yes |
| `REDIS_*` | Redis configuration | For queues |
| `STRIPE_KEY` | Stripe publishable key | For payments |
| `STRIPE_SECRET` | Stripe secret key | For payments |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | For webhooks |
| `MAIL_*` | Mail configuration | For emails |
| `GEMINI_API_KEY` | Google Gemini API key | For AI features |


## 👨‍💻 Author

Developed with ❤️ for accurate news verification

Mudakkit Team

---

<p align="center">
  <sub>Built with Laravel, React, and AI-powered verification</sub>
</p>

# 🛠 Tech Stack, Problems & Solutions

> A comprehensive guide to the technologies powering Mudakkik and the rationale behind each choice.

---

## Table of Contents
- [Overview](#overview)
- [Backend Stack](#backend-stack)
- [Frontend Stack](#frontend-stack)
- [AI & External Services](#ai--external-services)
- [Infrastructure](#infrastructure)
- [Development Tools](#development-tools)
- [Problems Solved](#problems-solved)
- [Technical Decisions](#technical-decisions)

---

## Overview

Mudakkik is built on a modern, scalable architecture designed to handle:
- High-volume AI processing for fact-checking
- Real-time notifications and updates
- Secure payment processing
- Multi-language content (Arabic RTL support)

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   React 18   │  │  Inertia.js  │  │  TailwindCSS │          │
│  │   (SPA UI)   │  │   (Bridge)   │  │  (RTL Ready) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       APPLICATION LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Laravel 12  │  │   Sanctum    │  │   Horizon    │          │
│  │  (Framework) │  │    (Auth)    │  │   (Queues)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    MySQL     │  │    Redis     │  │  File Store  │          │
│  │  (Primary)   │  │   (Cache)    │  │   (Assets)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Groq API    │  │  Tavily API  │  │   Stripe     │          │
│  │ (AI/LLaMA)   │  │   (Search)   │  │  (Payments)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Backend Stack

### PHP 8.2+

| Aspect | Details |
|--------|---------|
| **Version** | ^8.2 |
| **Why** | Required for Laravel 12. Offers fibers, attributes, readonly classes, and significant performance improvements. |
| **Problem Solved** | Legacy PHP versions lack modern features and have security vulnerabilities. |
| **Key Features Used** | Named arguments, match expressions, constructor promotion, null-safe operator |

```php
// Example: Modern PHP 8.2 features in use
readonly class FactCheckResult
{
    public function __construct(
        public string $verdict,
        public int $confidence,
        public array $sources = [],
    ) {}
}
```

### Laravel 12

| Aspect | Details |
|--------|---------|
| **Version** | ^12.0 |
| **Why** | Best PHP framework for rapid development. Eloquent ORM, built-in queue system, artisan CLI, and excellent documentation. |
| **Problem Solved** | Raw PHP requires building everything from scratch. Laravel provides batteries-included development. |
| **Key Features Used** | Eloquent ORM, Queues, Notifications, Events, Middleware, Form Requests |

**Why not alternatives?**
| Framework | Reason Not Chosen |
|-----------|-------------------|
| Symfony | Steeper learning curve, more boilerplate |
| CodeIgniter | Less modern, smaller ecosystem |
| Slim | Too minimal for our needs |

### Laravel Horizon

| Aspect | Details |
|--------|---------|
| **Version** | ^5.41 |
| **Why** | Production-grade Redis queue dashboard. Essential for monitoring AI processing jobs and payment webhooks. |
| **Problem Solved** | Queue visibility - knowing if jobs fail, retry counts, processing times |
| **Key Features Used** | Dashboard UI, job metrics, queue balancing, failure tracking |

```php
// Jobs monitored by Horizon
- AuditPostContent      // AI content review
- AuditReportContent    // AI report evaluation  
- ProcessStripeWebhook  // Payment processing
- HandleExpiredSubscriptions
- ReconcilePendingPayments
```

### Laravel Sanctum

| Aspect | Details |
|--------|---------|
| **Version** | ^4.0 |
| **Why** | Simple SPA authentication. Cookie-based for web, token-based for API. |
| **Problem Solved** | Passport is overkill for SPAs. Sanctum provides simple, secure authentication. |
| **Key Features Used** | SPA authentication, API tokens, CSRF protection |

**Why not Passport?**
- Passport uses OAuth2 which is complex for first-party SPAs
- Sanctum is simpler and designed for SPAs
- No need for third-party OAuth flows

### Inertia.js

| Aspect | Details |
|--------|---------|
| **Version** | ^2.0 |
| **Why** | Bridges Laravel and React without building a separate API. Server-side routing with client-side rendering. |
| **Problem Solved** | Building a separate REST/GraphQL API doubles development time. Inertia gives SPA benefits with traditional server routing. |
| **Key Features Used** | Shared data, form helpers, progress indicators, SSR support |

```php
// Controller returns Inertia response
public function show(Post $post)
{
    return Inertia::render('Posts/Show', [
        'post' => $post->load('user', 'category'),
        'canEdit' => auth()->user()?->can('update', $post),
    ]);
}
```

---

## Frontend Stack

### React 18

| Aspect | Details |
|--------|---------|
| **Version** | ^18.2.0 |
| **Why** | Component-based UI with hooks. Large ecosystem, excellent DevTools, and community support. |
| **Problem Solved** | Building interactive UIs with vanilla JS is tedious and error-prone. |
| **Key Features Used** | Hooks (useState, useEffect, useForm), Suspense, Concurrent features |

**Why not Vue or Svelte?**
| Framework | Reason |
|-----------|--------|
| Vue | Less TypeScript support, smaller ecosystem |
| Svelte | Newer, smaller ecosystem, less enterprise adoption |
| Angular | Too heavy for our needs |

### TailwindCSS

| Aspect | Details |
|--------|---------|
| **Version** | ^3.2.1 |
| **Why** | Utility-first CSS framework. Rapid prototyping, consistent design system, RTL support. |
| **Problem Solved** | CSS naming conventions, dead CSS, inconsistent styling |
| **Key Features Used** | RTL utilities (`rtl:`), dark mode, responsive design, custom theme |

```jsx
// RTL-aware styling for Arabic
<div className="text-right rtl:text-right ltr:text-left">
  <h1 className="text-2xl font-bold">مُدَقِّق</h1>
</div>
```

### Framer Motion

| Aspect | Details |
|--------|---------|
| **Version** | ^12.23.26 |
| **Why** | Production-ready animation library. Declarative API, excellent performance. |
| **Problem Solved** | CSS animations are limited. JS animation libraries often have jank. |
| **Key Features Used** | Page transitions, micro-interactions, gesture handling |

### Chart.js & Recharts

| Aspect | Details |
|--------|---------|
| **Libraries** | chart.js ^4.5.1, recharts ^3.6.0 |
| **Why** | Data visualization for admin dashboards. |
| **Problem Solved** | Admin needs visual analytics for users, posts, revenue |
| **Use Cases** | User growth charts, revenue graphs, content statistics |

### SweetAlert2

| Aspect | Details |
|--------|---------|
| **Version** | ^11.26.17 |
| **Why** | Beautiful, accessible modals with RTL support. |
| **Problem Solved** | Native browser alerts are ugly and non-customizable |
| **Key Features Used** | Toast notifications, confirmation dialogs, form inputs |

---

## AI & External Services

### Groq API (LLaMA 3.3 70B)

| Aspect | Details |
|--------|---------|
| **Model** | llama-3.3-70b-versatile |
| **Why** | Fast inference (10x faster than OpenAI), cost-effective, excellent Arabic understanding |
| **Problem Solved** | OpenAI is expensive and slow. Need Arabic-capable AI for content moderation. |
| **Use Cases** | Content auditing, report validation, policy compliance |

**Cost Comparison:**
| Provider | Cost per 1M tokens | Speed |
|----------|-------------------|-------|
| [OpenAI GPT-4o](https://openai.com/api/pricing/) | ~$2.50 (input), ~$10.00 (output) | Medium |
| [Anthropic Claude](https://www.anthropic.com/pricing) | $3.00 (input), $15.00 (output) | Medium |
| **[Groq LLaMA](https://groq.com/pricing/)** | **$0.59 (input), $0.79 (output)** | **Fast** |

> *Pricing last verified: 2026-01-12*

### Tavily API

| Aspect | Details |
|--------|---------|
| **Purpose** | News search and verification |
| **Why** | Specialized for news content. Returns structured data with sources and dates. |
| **Problem Solved** | Google Search API returns web results, not news-specific data |
| **Key Features Used** | Domain filtering, date ranges, source credibility |

### Stripe

| Aspect | Details |
|--------|---------|
| **Version** | stripe-php ^18.0 |
| **Why** | Industry-standard payment processing. Global support, excellent webhooks, PCI compliance. |
| **Problem Solved** | Building payment infrastructure from scratch is risky and expensive |
| **Key Features Used** | Checkout Sessions, Webhooks, Customer portal, Subscription management |

### Laravel Reverb

| Aspect | Details |
|--------|---------|
| **Purpose** | WebSocket broadcasting |
| **Why** | Native Laravel WebSocket server. No Pusher/Ably costs. |
| **Problem Solved** | Real-time notifications without third-party dependencies |
| **Use Cases** | Live notifications, real-time updates |

---

## Infrastructure

### Redis

| Aspect | Details |
|--------|---------|
| **Version** | 6+ |
| **Why** | Fast in-memory store. Required for Horizon, excellent for cache/sessions. |
| **Problem Solved** | Database-based queues are slow. Memory-based queues handle high throughput. |
| **Use Cases** | Queue backend, session store, cache layer, rate limiting |

### MySQL / PostgreSQL

| Aspect | Details |
|--------|---------|
| **Supported** | MySQL 8.0+, PostgreSQL 14+ |
| **Why** | Reliable RDBMS with Laravel support. ACID compliance for transactions. |
| **Problem Solved** | NoSQL lacks transactions needed for payments and subscriptions |
| **Key Features Used** | Transactions, foreign keys, full-text search, JSON columns |

### Nginx

| Aspect | Details |
|--------|---------|
| **Why** | High-performance reverse proxy. Better for PHP-FPM than Apache. |
| **Problem Solved** | Apache uses more memory and has slower PHP processing |
| **Configuration** | FastCGI to PHP-FPM, static file serving, SSL termination |

### Supervisor

| Aspect | Details |
|--------|---------|
| **Purpose** | Process management |
| **Why** | Keeps queue workers and Horizon running. Auto-restart on failure. |
| **Problem Solved** | Queue workers die and need to be restarted manually |
| **Managed Processes** | Horizon master, queue workers, Reverb server |

---

## Development Tools

### Vite

| Aspect | Details |
|--------|---------|
| **Version** | ^7.0.7 |
| **Why** | Lightning-fast HMR, native ES modules, better DX than Webpack. |
| **Problem Solved** | Webpack is slow and complex to configure |
| **Key Features Used** | Hot Module Replacement, React Fast Refresh, Build optimization |

### Pest PHP

| Aspect | Details |
|--------|---------|
| **Version** | ^4.2 |
| **Why** | Elegant testing syntax, Laravel integration, cleaner than PHPUnit. |
| **Problem Solved** | PHPUnit tests are verbose. Pest is more readable. |

```php
// Pest syntax vs PHPUnit
it('prevents guest from verifying news', function () {
    $response = $this->post('/verify-news', ['text' => 'Test claim']);
    $response->assertRedirect('/login');
});
```

### Laravel Pint

| Aspect | Details |
|--------|---------|
| **Why** | Opinionated code style fixer. Zero configuration for Laravel conventions. |
| **Problem Solved** | Inconsistent code formatting across team |

### Laravel Pail

| Aspect | Details |
|--------|---------|
| **Why** | Beautiful CLI log viewer with live tailing. |
| **Problem Solved** | Reading raw log files is painful |

---

## Problems Solved

### Problem 1: Arabic Language Support

**Challenge:** Most AI models and libraries have poor Arabic support.

**Solution:**
- Chose Groq's LLaMA 3.3 which has excellent Arabic understanding
- TailwindCSS with RTL utilities for proper text direction
- SweetAlert2 for RTL modal support

### Problem 2: Content Moderation at Scale

**Challenge:** Manual moderation doesn't scale. Need to review 100+ articles/day.

**Solution:**
- AI-powered automatic auditing via background jobs
- Score-based routing: high scores auto-publish, low scores reject, middle requires human review
- Reduces manual review by 80%

### Problem 3: Real-time Updates

**Challenge:** Users need instant feedback on fact-checks and notifications.

**Solution:**
- Laravel Reverb for WebSocket broadcasting
- Database notifications with real-time push
- Inertia's progress indicators for loading states

### Problem 4: Payment Reliability

**Challenge:** Payment failures leave subscriptions in inconsistent states.

**Solution:**
- Stripe webhooks as source of truth
- `ReconcilePendingPayments` job syncs status every hour
- Idempotent webhook handlers prevent duplicate processing

### Problem 5: Misinformation Detection

**Challenge:** Verifying news claims requires searching multiple trusted sources.

**Solution:**
- Tavily API for news-specific search
- Trusted domain whitelist managed by admins
- AI verdict with confidence score and evidence links

---

## Technical Decisions

### Decision 1: Inertia vs REST API

**Chose Inertia because:**
- Single codebase, no API versioning
- Server-side validation with client-side UX
- Faster development velocity
- SEO handled by SSR

**Trade-offs:**
- Tightly coupled frontend/backend
- Can't easily build mobile app with same API

### Decision 2: Groq vs OpenAI

**Chose Groq because:**
- 10x faster inference
- 30x cheaper
- LLaMA 3.3 70B matches GPT-4 quality for our use cases
- Excellent Arabic support

### Decision 3: Reverb vs Pusher

**Chose Reverb because:**
- Self-hosted, no per-message costs
- Native Laravel integration
- No external dependency for real-time features

### Decision 4: Credit System vs Unlimited Access

**Chose credits because:**
- Sustainable monetization
- Prevents API abuse
- Incentivizes paid upgrades
- Fair usage model

---

## Version Matrix

| Component | Version | Last Updated |
|-----------|---------|--------------|
| PHP | 8.2+ | Stable |
| Laravel | 12.0 | Latest |
| React | 18.2 | Stable |
| Node.js | 18+ | LTS |
| MySQL | 8.0+ | Stable |
| Redis | 6+ | Stable |

---

## Further Reading

- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Documentation](https://inertiajs.com)
- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)

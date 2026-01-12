# 🏗️ System Architecture

> Complete system architecture documentation for Mudakkik.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                   │
│  │   Web Browser │  │  Mobile Web   │  │   API Client  │                   │
│  │   (React SPA) │  │  (Responsive) │  │  (Enterprise) │                   │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘                   │
│          │                  │                  │                            │
│          └──────────────────┼──────────────────┘                            │
│                             │                                               │
│                             ▼                                               │
│                    ┌────────────────┐                                       │
│                    │   HTTPS/WSS   │                                       │
│                    └────────┬───────┘                                       │
└─────────────────────────────┼───────────────────────────────────────────────┘
                              │
┌─────────────────────────────┼───────────────────────────────────────────────┐
│                             ▼                                               │
│                    ┌────────────────┐                                       │
│                    │     NGINX     │  Load Balancer / Reverse Proxy        │
│                    │  (Port 80/443)│                                       │
│                    └────────┬───────┘                                       │
│                             │                                               │
│         ┌───────────────────┼───────────────────┐                          │
│         │                   │                   │                          │
│         ▼                   ▼                   ▼                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                    │
│  │  PHP-FPM   │    │   Reverb    │    │   Static    │                    │
│  │ (Laravel)  │    │ (WebSocket) │    │  Assets     │                    │
│  │ Port 9000  │    │ Port 8080   │    │  /public    │                    │
│  └──────┬──────┘    └─────────────┘    └─────────────┘                    │
│         │                                                                   │
│                           APPLICATION LAYER                                 │
└─────────┼───────────────────────────────────────────────────────────────────┘
          │
┌─────────┼───────────────────────────────────────────────────────────────────┐
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          LARAVEL 12                                  │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Routing    │  │  Middleware  │  │  Controllers │              │   │
│  │  │   (web.php)  │  │  (auth,etc)  │  │  (HTTP)      │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Services   │  │    Jobs      │  │   Events     │              │   │
│  │  │FactCheck,AI  │  │ Audit,Pay    │  │ Notifications│              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Models     │  │  Eloquent    │  │   Inertia    │              │   │
│  │  │   (ORM)      │  │   Queries    │  │   Responses  │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                           LARAVEL CORE                                      │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          │
┌─────────┼───────────────────────────────────────────────────────────────────┐
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        DATA LAYER                                    │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │    MySQL     │  │    Redis     │  │   Storage    │              │   │
│  │  │   Primary    │  │ Cache/Queue  │  │   (Files)    │              │   │
│  │  │   Database   │  │   Session    │  │   Images     │              │   │
│  │  │  Port 3306   │  │  Port 6379   │  │  /storage    │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                           DATA STORAGE                                      │
└─────────────────────────────────────────────────────────────────────────────┘
          │
          │
┌─────────┼───────────────────────────────────────────────────────────────────┐
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     EXTERNAL SERVICES                                │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Groq API   │  │  Tavily API  │  │   Stripe     │              │   │
│  │  │   (LLaMA)    │  │   (Search)   │  │  (Payments)  │              │   │
│  │  │  AI Audit    │  │  Fact Check  │  │  Webhooks    │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │                                                                      │   │
│  │  ┌──────────────┐                                                   │   │
│  │  │   SMTP       │                                                   │   │
│  │  │   (Email)    │                                                   │   │
│  │  │  Gmail/SES   │                                                   │   │
│  │  └──────────────┘                                                   │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                           EXTERNAL APIs                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Request Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant N as Nginx
    participant L as Laravel
    participant R as Redis
    participant D as MySQL
    participant E as External API

    C->>N: HTTPS Request
    N->>L: Forward to PHP-FPM
    L->>L: Middleware (Auth, CSRF)
    L->>R: Check Cache
    R-->>L: Cache Miss
    L->>D: Query Database
    D-->>L: Data
    L->>R: Store in Cache
    L->>E: API Call (if needed)
    E-->>L: Response
    L->>L: Render Inertia
    L-->>N: Response
    N-->>C: HTTPS Response
```

---

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│  │  Pages  │  │ Layouts │  │Components│  │  Hooks  │           │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘           │
│       │            │            │            │                  │
│       └────────────┴────────────┴────────────┘                  │
│                          │                                      │
│                   ┌──────┴──────┐                              │
│                   │  Inertia.js │                              │
│                   └──────┬──────┘                              │
└──────────────────────────┼──────────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────────┐
│                          ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    CONTROLLERS                           │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ FactCheck │ Post │ Payment │ Subscription │ User │ Admin│   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                     SERVICES                             │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ FactCheckService │ AiAuditService │ PaymentService │     │   │
│  │ HomePageService  │                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                      JOBS                                │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ AuditPostContent │ AuditReportContent │                 │   │
│  │ ProcessStripeWebhook │ ReconcilePendingPayments │       │   │
│  │ HandleExpiredSubscriptions │                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                     MODELS                               │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ User │ Post │ Plan │ Subscription │ Payment │ FactCheck │   │
│  │ Category │ Tag │ Like │ Follow │ PostReport │ ...       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                          BACKEND                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Queue Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    QUEUE SYSTEM                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                     DISPATCH                             │   │
│  │  Controller/Service → dispatch(Job) → Redis Queue        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    REDIS QUEUES                          │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  high    │ ProcessStripeWebhook                         │   │
│  │  default │ AuditPostContent, AuditReportContent         │   │
│  │  low     │ HandleExpiredSubscriptions, Reconcile...     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 HORIZON WORKERS                          │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  Worker 1 │ Worker 2 │ Worker 3 │ ... │ Worker N        │   │
│  │  Process jobs from queues based on priority             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 HORIZON DASHBOARD                        │   │
│  │  /horizon - Monitor jobs, metrics, failed jobs          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant L as Laravel
    participant S as Sanctum
    participant D as Database

    U->>F: Login Form
    F->>L: POST /login
    L->>S: Validate Credentials
    S->>D: Check User
    D-->>S: User Found
    S->>S: Create Session
    S-->>L: Session Cookie
    L-->>F: Redirect + Cookie
    F-->>U: Authenticated
    
    Note over F,L: Subsequent Requests
    F->>L: Request + Cookie
    L->>S: Verify Session
    S-->>L: User Authenticated
    L-->>F: Response
```

---

## Payment Flow

```mermaid
sequenceDiagram
    participant U as User
    participant M as Mudakkik
    participant S as Stripe
    participant W as Webhook Handler
    participant Q as Queue
    participant D as Database

    U->>M: Subscribe to Plan
    M->>S: Create Checkout Session
    S-->>M: Session URL
    M-->>U: Redirect to Stripe
    U->>S: Complete Payment
    S->>W: Webhook: checkout.session.completed
    W->>Q: Dispatch ProcessStripeWebhook
    Q->>Q: Process Job
    Q->>D: Create Subscription
    Q->>D: Renew Credits
    Q->>U: Send Email Notification
    S-->>U: Redirect to Success Page
```

---

## Fact-Check Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Controller
    participant S as FactCheckService
    participant T as Tavily API
    participant G as Groq API
    participant D as Database

    U->>C: POST /verify-news
    C->>C: Validate Input
    C->>C: Check Credits
    C->>C: Consume Credit
    C->>S: check(input, period)
    S->>S: Identify Input Type
    
    alt URL Input
        S->>S: Fetch URL Content
        S->>G: Refine Content
    end
    
    S->>T: Search Trusted Sources
    T-->>S: Search Results
    S->>G: Generate Verdict
    G-->>S: AI Analysis
    S->>D: Save FactCheck
    S-->>C: Result
    C-->>U: Display Verdict
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      AWS ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                     CLOUDFLARE                            │ │
│  │                   (DNS + CDN + DDoS)                      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                          │                                      │
│                          ▼                                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                      EC2 INSTANCE                         │ │
│  │                                                           │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │ │
│  │  │    Nginx    │  │   PHP-FPM   │  │  Supervisor │       │ │
│  │  │  (Port 80)  │  │ (Port 9000) │  │  (Workers)  │       │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘       │ │
│  │                                                           │ │
│  │  ┌─────────────┐  ┌─────────────┐                        │ │
│  │  │   Redis     │  │   MySQL     │                        │ │
│  │  │ (Port 6379) │  │ (Port 3306) │                        │ │
│  │  └─────────────┘  └─────────────┘                        │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                        S3                                 │ │
│  │                   (File Storage)                          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  LAYER 1: NETWORK                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • HTTPS/TLS 1.3                                         │   │
│  │ • Cloudflare DDoS Protection                            │   │
│  │ • AWS Security Groups                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  LAYER 2: APPLICATION                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • CSRF Protection (Laravel)                             │   │
│  │ • XSS Prevention (Blade Escaping)                       │   │
│  │ • SQL Injection (Eloquent Parameterized)                │   │
│  │ • Rate Limiting                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  LAYER 3: AUTHENTICATION                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Sanctum Session Auth                                  │   │
│  │ • Email Verification                                    │   │
│  │ • Password Hashing (bcrypt, 12 rounds)                  │   │
│  │ • Role-Based Access Control                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  LAYER 4: DATA                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Encrypted Sessions                                    │   │
│  │ • Hidden Sensitive Fields                               │   │
│  │ • Database Transactions                                 │   │
│  │ • Backup & Recovery                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Scaling Considerations

### Horizontal Scaling
```
                    ┌─────────────┐
                    │ Load Balancer│
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
     ┌──────────┐    ┌──────────┐    ┌──────────┐
     │  App 1   │    │  App 2   │    │  App N   │
     └────┬─────┘    └────┬─────┘    └────┬─────┘
          │               │               │
          └───────────────┼───────────────┘
                          ▼
                  ┌──────────────┐
                  │ Redis Cluster│
                  └──────┬───────┘
                         │
                  ┌──────┴───────┐
                  │ MySQL Primary│
                  │ + Replicas   │
                  └──────────────┘
```

### Caching Strategy
| Layer | Technology | TTL |
|-------|------------|-----|
| HTTP | Cloudflare | 1hr |
| Application | Redis | 5min |
| Query | Eloquent | Request |
| Session | Redis | 2hr |

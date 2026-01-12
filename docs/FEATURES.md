# ✨ Features Documentation

> Complete documentation of all Mudakkik platform features.

---

## Table of Contents
- [AI-Powered Fact-Checking](#-ai-powered-fact-checking)
- [Content Management System](#-content-management-system)
- [User Management](#-user-management)
- [Subscription & Payments](#-subscription--payments)
- [Community Features](#-community-features)
- [Admin Dashboard](#-admin-dashboard)
- [Homepage Management](#-homepage-management)
- [Notification System](#-notification-system)
- [Security Features](#-security-features)

---

## 🔍 AI-Powered Fact-Checking

### Overview
The core feature of Mudakkik is its AI-powered news verification system. Users can submit claims or URLs to be fact-checked against trusted Arabic news sources.

### Features

#### 1. News Verification (`/check` → Verify Mode)
| Property | Details |
|----------|---------|
| **Input** | Text claim (10-5000 chars) or URL |
| **Output** | Verdict (True/Misleading/False), confidence %, evidence links |
| **Credit Cost** | 1 AI credit per verification |
| **Time Period** | Filter sources by 1, 3, 7, 30, or 365 days |

**Process Flow:**
```
User Input → Extract Content → Search Trusted Sources → AI Analysis → Verdict
     │              │                   │                    │           │
     ▼              ▼                   ▼                    ▼           ▼
Text/URL    Fetch if URL      Tavily API Search      Groq LLaMA    Label + %
```

**Verdict Labels:**
| Label | Arabic | Confidence Range |
|-------|--------|------------------|
| True | موثوق | 70-100% |
| Misleading | مضلل | 40-69% |
| False | كاذب | 0-39% |

#### 2. News Search (`/check` → Search Mode)
| Property | Details |
|----------|---------|
| **Input** | Topic or query text |
| **Output** | Summary of related news from trusted sources |
| **Credit Cost** | 1 AI credit per search |
| **Difference** | No true/false verdict - summarizes coverage |

#### 3. Trusted Domains Management
Admins can manage which news sources are considered authoritative.

| Feature | Details |
|---------|---------|
| **Add Domain** | Add trusted news outlet |
| **Toggle Active** | Enable/disable domains |
| **Delete Domain** | Remove from trusted list |

**Example Trusted Domains:**
- aljazeera.net
- bbc.com/arabic
- reuters.com
- alarabiya.net

#### 4. Verification History
| Feature | Details |
|---------|---------|
| **Access** | `/api/fact-check/history` |
| **Limit** | Last 10 verifications |
| **Data** | Input, verdict, sources, timestamp |

#### 5. Credit System
| Credit Type | Description |
|-------------|-------------|
| **Recurring Credits** | Monthly allowance based on plan |
| **Bonus Credits** | One-time grants (e.g., journalist approval) |
| **Consumption** | 1 credit per verify/search |
| **Refund** | Credits refunded on API errors |

---

## 📰 Content Management System

### Overview
A complete publishing platform for journalists with AI-powered content moderation.

### Features

#### 1. Article Types
| Type | Arabic | Description |
|------|--------|-------------|
| **News** | خبر | Breaking news and current events |
| **Article** | مقال | Opinion pieces and analysis |

#### 2. Content Creation
| Feature | Details |
|---------|---------|
| **Title** | Required, max 255 chars |
| **Body** | Required, min 50 chars, rich text |
| **Category** | Required, from predefined list |
| **Image** | Required, JPEG/PNG/WebP, max 2MB |
| **Tags** | Optional, many-to-many |

#### 3. AI Content Auditing
Every new article goes through automatic AI review.

**Audit Criteria:**
| Criterion | Weight |
|-----------|--------|
| Arabic language quality | High |
| Policy compliance | Critical |
| Spelling accuracy (>80%) | Medium |
| No hate speech/violence | Critical |
| Original content | High |

**Audit Outcomes:**
| Score | Verdict | Action |
|-------|---------|--------|
| 70-100 | Published | Auto-publish, notify author |
| 40-69 | Pending | Queue for manual review |
| 0-39 | Rejected | Auto-reject, notify author |

#### 4. Content Statuses
| Status | Description |
|--------|-------------|
| `pending` | Awaiting AI/manual review |
| `published` | Live on platform |
| `rejected` | Failed moderation |

#### 5. AI Verdicts
| Verdict | Description |
|---------|-------------|
| `trusted` | Content is verified and quality |
| `checking` | Under AI review |
| `misleading` | Contains questionable claims |
| `fake` | Contains false information |

#### 6. Content Flags
| Flag | Description |
|------|-------------|
| `is_featured` | Shown in featured section |
| `is_cover_story` | Main hero article (only 1) |
| `is_breaking` | Breaking news ticker |
| `is_editors_choice` | Editor's pick |

#### 7. Duplicate Prevention
- MD5 hash of body content stored
- Database constraint prevents duplicate articles
- Error message if duplicate detected

---

## 👥 User Management

### User Roles

| Role | Capabilities |
|------|-------------|
| **User** | Read, fact-check, report, like, follow |
| **Journalist** | All user + create/edit own articles |
| **Admin** | Full platform access |

### User Profile Features

| Feature | Details |
|---------|---------|
| **Profile Picture** | Gravatar via email hash |
| **Username** | Unique, 3-20 chars, alphanumeric |
| **Bio** | Optional description |
| **Credits Display** | Recurring + bonus credits |
| **Subscription Badge** | Current plan indicator |

### Journalist Upgrade

**Requirements:**
1. Submit upgrade request with message
2. Optional: Upload credentials (PDF/DOC/images)
3. Admin reviews and approves/rejects

**Benefits upon approval:**
- Role changed to `journalist`
- `is_verified_journalist` flag set
- +50 bonus AI credits
- Can create articles
- Initial credibility score: 50

### Email Verification
| Feature | Details |
|---------|---------|
| **Method** | Token-based email link |
| **Template** | Custom welcome + verify combined |
| **Expiry** | 60 minutes |

---

## 💳 Subscription & Payments

### Subscription Plans

| Plan | Arabic Name | Price | AI Credits | Ad Credits | Badge |
|------|-------------|-------|------------|------------|-------|
| **Free** | الباقة المجانية | $0 | 30/mo | 0 | - |
| **Basic** | الباقة الأساسية | $29/mo | 100/mo | 7/mo | Bronze |
| **Professional** | الباقة الاحترافية | $99/mo | 1,000/mo | 30/mo | Gold |
| **Pro Annual** | احترافي (سنوي) | $999/yr | 12,000/yr | 365/yr | Platinum |

### Plan Features

| Feature | Free | Basic | Professional | Pro Annual |
|---------|------|-------|--------------|------------|
| AI Credits | 30/mo | 100/mo | 1,000/mo | 12,000/yr |
| Ad Credits | 0 | 7/mo | 30/mo | 365/yr |
| Verification Badge | ❌ | Bronze | Gold | Platinum |
| Priority Support | ❌ | ❌ | ✅ | ✅ |

### Payment Features

#### Stripe Integration
| Feature | Details |
|---------|---------|
| **Checkout** | Hosted Stripe checkout page |
| **Webhooks** | Automatic subscription activation |
| **Reconciliation** | Hourly sync of pending payments |

#### Payment Flow
```
1. User selects plan → Click Subscribe
2. Redirect to Stripe Checkout
3. User completes payment
4. Stripe sends webhook
5. System creates subscription
6. User credits renewed
7. Success page shown
```

#### Payment Statuses
| Status | Description |
|--------|-------------|
| `pending` | Awaiting Stripe confirmation |
| `completed` | Payment successful |
| `failed` | Payment declined |
| `refunded` | Payment refunded |

### Subscription Management

| Feature | Details |
|---------|---------|
| **View Current** | `/my-subscription` |
| **History** | `/my-subscription/history` |
| **Days Remaining** | Calculated from `ends_at` |
| **Auto-renew** | Configurable per subscription |

---

## 🤝 Community Features

### Post Likes
| Feature | Details |
|---------|---------|
| **Toggle** | Like/unlike via `POST /posts/{id}/like` |
| **Display** | Like count on each post |
| **Constraint** | One like per user per post |

### User Follows
| Feature | Details |
|---------|---------|
| **Follow** | Follow any user/journalist |
| **Unfollow** | Remove from following |
| **Display** | Follower/following counts |

### Post Reporting
| Feature | Details |
|---------|---------|
| **Access** | `POST /posts/{id}/report` |
| **Reason** | Required, 5-2000 chars |
| **Limit** | One report per user per post |
| **AI Audit** | Reports evaluated by AI |

**Report Flow:**
```
User reports → AI evaluates → Admin reviews → Approve/Reject
      │              │              │               │
      ▼              ▼              ▼               ▼
   Created      valid/invalid   Decision      Notify users
```

---

## 📊 Admin Dashboard

### Dashboard Statistics

| Stat | Description |
|------|-------------|
| Total Users | All registered users |
| New Users | Registered this month |
| Verified Users | Email verified |
| Total Posts | All articles |
| Published Posts | Live articles |
| Pending Posts | Awaiting review |
| Active Subscriptions | Paid subscribers |
| Monthly Revenue | This month's payments |

### Management Sections

#### User Management (`/admin/users`)
| Action | Description |
|--------|-------------|
| List | Paginated user list with filters |
| View | User details and activity |
| Edit | Update role, status |
| Delete | Soft delete user |

#### Post Management (`/admin/posts`)
| Action | Description |
|--------|-------------|
| List | All posts with filters |
| Search | Find by title/content |
| Edit | Modify content/status |
| Toggle Features | Featured, breaking, etc. |
| Delete | Remove post and image |

#### AI Audit Dashboard (`/admin/ai-audit`)
| Feature | Description |
|---------|-------------|
| View AI Reports | See AI analysis for posts |
| Filter by Verdict | trusted/misleading/fake |
| Override Verdict | Admin can change status |

#### Report Management (`/admin/reports`)
| Action | Description |
|--------|-------------|
| View Reports | All user reports |
| Filter Status | pending/approved/rejected |
| Approve | Hide reported post |
| Reject | Dismiss report |

#### Request Management
| Type | Description |
|------|-------------|
| **Join Requests** | Journalist upgrade applications |
| **Ad Requests** | User advertisement submissions |

---

## 🏠 Homepage Management

### Managed Sections

| Section | Slots | Description |
|---------|-------|-------------|
| **Hero** | Up to 5 | Main featured articles |
| **Ticker** | Up to 10 | Breaking news scroll |
| **Featured** | Up to 6 | Featured carousel |
| **Top Stories** | Up to 4 | Top news section |
| **Topics** | Per category | Category-based blocks |
| **Banner** | 1 | Large promotional banner |
| **Entertainment** | Up to 5 | Entertainment section |
| **Business** | Up to 5 | Business section |

### HomeSlot Model
| Field | Description |
|-------|-------------|
| `slot_name` | Section identifier |
| `post_id` | Linked article |
| `type` | post/custom |
| `custom_data` | JSON for non-post content |
| `order` | Display sequence |

---

## 🔔 Notification System

### Notification Types

| Notification | Channels | Trigger |
|--------------|----------|---------|
| `WelcomeNewUser` | mail | Registration |
| `CustomVerifyEmail` | mail | Email verification |
| `JournalistApproved` | mail, database | Request approved |
| `PostPublished` | database | Article goes live |
| `PostRejected` | database | Article rejected |
| `PostPendingReview` | database | Needs manual review |
| `PostMarkedFake` | database | AI flagged as fake |
| `PostHiddenByReport` | database | Hidden due to report |
| `PostDeleted` | database | Article removed |
| `ReportSubmitted` | database | Report created |
| `ReportPendingReview` | database | Report being reviewed |
| `ReportApproved` | database | Report action taken |
| `ReportRejected` | database | Report dismissed |
| `PaymentSuccessful` | mail, database | Payment completed |
| `PaymentFailed` | mail, database | Payment failed |
| `SubscriptionCreated` | mail, database | New subscription |
| `SubscriptionExpired` | mail, database | Subscription ended |
| `StalePaymentAlert` | mail | Admin: old pending payment |
| `AdminActivityNotification` | database | Admin alerts |

### Notification Management

| Feature | Route |
|---------|-------|
| View All | `GET /notifications` |
| Mark All Read | `POST /notifications/mark-all-read` |
| Delete One | `DELETE /notifications/{id}` |

---

## 🔒 Security Features

### Authentication
| Feature | Implementation |
|---------|---------------|
| Password Hashing | bcrypt with 12 rounds |
| Email Verification | Required for all users |
| CSRF Protection | Laravel default |
| Session Management | Database-stored sessions |

### Authorization
| Feature | Implementation |
|---------|---------------|
| Role-based Access | User/Journalist/Admin |
| Gate Definitions | `can:admin-access` |
| Policy Classes | PostPolicy, etc. |
| Route Middleware | `auth`, `verified` |

### Rate Limiting
| Route | Limit |
|-------|-------|
| Report Submission | 5 per minute |
| Login Attempts | 5 per minute |
| API Requests | 60 per minute |

### Data Protection
| Feature | Implementation |
|---------|---------------|
| SQL Injection | Eloquent parameterized queries |
| XSS Prevention | Blade escaping |
| File Upload | Type/size validation |
| Sensitive Data | Casts for hidden fields |

---

## 📱 Responsive Design

### Breakpoints
| Size | Min Width | Target |
|------|-----------|--------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

### RTL Support
- All text defaults to right-to-left
- TailwindCSS `rtl:` utilities
- Arabic-first design

---

## 🔄 Background Processing

### Queue Jobs
| Job | Queue | Purpose |
|-----|-------|---------|
| `AuditPostContent` | default | AI article review |
| `AuditReportContent` | default | AI report evaluation |
| `ProcessStripeWebhook` | high | Payment processing |
| `HandleExpiredSubscriptions` | low | Expire old subscriptions |
| `ReconcilePendingPayments` | low | Sync payment status |

### Scheduled Tasks
| Task | Schedule | Purpose |
|------|----------|---------|
| Expire Subscriptions | Daily | Check and expire |
| Reconcile Payments | Hourly | Sync with Stripe |

---

## 📈 Analytics & Tracking

### Post Analytics
| Metric | Description |
|--------|-------------|
| Views | Page view count |
| Likes | Like count |
| Reports | Report count |

### User Analytics
| Metric | Description |
|--------|-------------|
| Posts Created | Author's article count |
| Followers | Follower count |
| Following | Following count |
| Credibility Score | Journalist quality score |

---

## 🎨 UI Components

### Shared Components
| Component | Purpose |
|-----------|---------|
| `Header` | Navigation, user menu, notifications |
| `Footer` | Links, social, copyright |
| `Modal` | Reusable dialog |
| `Pagination` | Page navigation |
| `Search` | Global search |
| `UserBadge` | Role/plan indicator |
| `AdRotator` | Advertisement display |
| `Notifications` | Bell icon with dropdown |

### Layout Components
| Layout | Purpose |
|--------|---------|
| `GuestLayout` | Public pages |
| `AuthenticatedLayout` | Logged-in users |
| `AdminLayout` | Admin panel |
| `ProfileLayout` | User profile pages |

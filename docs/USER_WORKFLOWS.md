# 👤 User Workflows

> Detailed user journey documentation with flowcharts and step-by-step guides.

---

## Table of Contents
- [Registration & Onboarding](#1-registration--onboarding)
- [Email Verification](#2-email-verification)
- [News Fact-Checking](#3-news-fact-checking)
- [News Search](#4-news-search)
- [Journalist Application](#5-journalist-application)
- [Article Creation](#6-article-creation)
- [Article Management](#7-article-management)
- [Subscription Purchase](#8-subscription-purchase)
- [Post Interaction](#9-post-interaction)
- [Content Reporting](#10-content-reporting)
- [Profile Management](#11-profile-management)
- [Notification Management](#12-notification-management)

---

## 1. Registration & Onboarding

### Overview
New users register and receive a free plan with 5 AI credits.

### Flowchart

```mermaid
flowchart TD
    A[Visit Homepage] --> B[Click Register]
    B --> C[Fill Registration Form]
    C --> D{Validation}
    D -->|Error| E[Show Errors]
    E --> C
    D -->|Success| F[Create User Account]
    F --> G[Assign Free Plan]
    G --> H[Grant 5 AI Credits]
    H --> I[Send Verification Email]
    I --> J[Redirect to Verification Notice]
```

### Steps

| Step | Action | System Response |
|------|--------|-----------------|
| 1 | Click "تسجيل" (Register) | Show registration form |
| 2 | Enter name | Validate: required |
| 3 | Enter username | Validate: unique, 3-20 chars, alphanumeric |
| 4 | Enter email | Validate: unique, valid format |
| 5 | Enter password | Validate: min 8 chars |
| 6 | Confirm password | Validate: matches password |
| 7 | Click submit | Create account, send email |
| 8 | View success page | "Please verify email" message |

### Validation Rules

```php
'name' => 'required|string|max:255'
'username' => 'required|string|min:3|max:20|unique:users|alpha_dash'
'email' => 'required|string|email|max:255|unique:users'
'password' => 'required|string|min:8|confirmed'
```

### Initial User State

| Property | Value |
|----------|-------|
| Role | `user` |
| Email Verified | `false` |
| AI Recurring Credits | 5 |
| AI Bonus Credits | 0 |
| Plan | Free |

---

## 2. Email Verification

### Overview
Users must verify email before accessing protected features.

### Flowchart

```mermaid
flowchart TD
    A[Receive Verification Email] --> B[Click Verification Link]
    B --> C{Token Valid?}
    C -->|No| D[Show Error]
    D --> E[Request New Link]
    E --> A
    C -->|Yes| F[Mark Email Verified]
    F --> G[Redirect to Dashboard]
    G --> H[Full Platform Access]
```

### Email Contents

| Element | Description |
|---------|-------------|
| Subject | "أهلاً بك في مُدَقِّق - تأكيد البريد" |
| Welcome Message | Custom Arabic welcome |
| Verify Button | Link with signed URL |
| Expiry | 60 minutes |

### Verification States

| State | Access Level |
|-------|-------------|
| Not Verified | Read-only, can't fact-check |
| Verified | Full user access |

---

## 3. News Fact-Checking

### Overview
Users verify claims using AI-powered fact-checking against trusted sources.

### Flowchart

```mermaid
flowchart TD
    A[Open /check] --> B[Select Verify Mode]
    B --> C[Enter Claim/URL]
    C --> D[Select Time Period]
    D --> E[Click Verify]
    E --> F{Authenticated?}
    F -->|No| G[Redirect to Login]
    F -->|Yes| H{Has Credits?}
    H -->|No| I[Show Plan Modal]
    I --> J[Upgrade Plan]
    J --> E
    H -->|Yes| K[Consume 1 Credit]
    K --> L[Process Request]
    L --> M{Is URL?}
    M -->|Yes| N[Fetch URL Content]
    M -->|No| O[Use Text as Claim]
    N --> P[Extract Key Points]
    O --> P
    P --> Q[Search Trusted Sources]
    Q --> R[AI Analysis]
    R --> S{Success?}
    S -->|No| T[Refund Credit]
    T --> U[Show Error]
    S -->|Yes| V[Display Results]
    V --> W[Save to History]
```

### Input Requirements

| Field | Requirement |
|-------|-------------|
| Text/URL | Required, 10-5000 characters |
| Period | Optional: 1, 3, 7, 30, or 365 days |

### Credit Consumption

```
┌─────────────────────────────────────────────────────────────────┐
│                    CREDIT FLOW                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   User submits claim                                            │
│          ↓                                                      │
│   Check: recurring_credits + bonus_credits >= 1                 │
│          ↓                                                      │
│   ┌─────────────────────────────────────────────────────┐      │
│   │ Priority: Consume recurring first, then bonus       │      │
│   └─────────────────────────────────────────────────────┘      │
│          ↓                                                      │
│   Process request                                               │
│          ↓                                                      │
│   ┌─────────────┐          ┌─────────────┐                     │
│   │   SUCCESS   │          │   ERROR     │                     │
│   │ Credit used │          │ Credit      │                     │
│   │             │          │ refunded    │                     │
│   └─────────────┘          └─────────────┘                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Result Components

| Component | Description |
|-----------|-------------|
| Verdict Label | موثوق / قيد التحقق / مضلل / كاذب |
| Confidence | 0-100% |
| Summary | Arabic explanation |
| Evidence | Key points from sources |
| Sources | Links to trusted news |

### Verdict Types

| Verdict | Arabic | Description |
|---------|--------|-------------|
| `trusted` | موثوق | Claim verified as true (70-100%) |
| `checking` | قيد التحقق | Still verifying or awaiting review |
| `misleading` | مضلل | Partially true or out of context (40-69%) |
| `fake` | كاذب | Claim verified as false (0-39%) |

---

## 4. News Search

### Overview
Search mode summarizes news coverage without true/false verdict.

### Flowchart

```mermaid
flowchart TD
    A[Open /check] --> B[Select Search Mode]
    B --> C[Enter Topic]
    C --> D[Select Time Period]
    D --> E[Click Search]
    E --> F{Has Credits?}
    F -->|No| G[Show Plan Modal]
    F -->|Yes| H[Consume 1 Credit]
    H --> I[Search Sources]
    I --> J[AI Summarization]
    J --> K{Success?}
    K -->|No| L[Refund Credit]
    K -->|Yes| M[Display Summary]
    M --> N[Show Source Links]
```

### Difference from Verify

| Aspect | Verify Mode | Search Mode |
|--------|-------------|-------------|
| Purpose | Check if claim is true | Summarize topic coverage |
| Output | Verdict (True/False) | Summary paragraph |
| Use Case | "Is this news true?" | "What's being said about X?" |

---

## 5. Journalist Application

### Overview
Users apply to become journalists with document verification.

### Flowchart

```mermaid
flowchart TD
    A[User Profile] --> B[Click Join Journalists]
    B --> C{Existing Request?}
    C -->|Yes| D[Show Error: Pending Request]
    C -->|No| E[Show Application Form]
    E --> F[Enter Request Message]
    F --> G[Upload Documents Optional]
    G --> H[Submit Application]
    H --> I[Create UpgradeRequest]
    I --> J[Notify Admins]
    J --> K[Show Success Message]
    K --> L[Wait for Review]
    L --> M{Admin Decision}
    M -->|Approved| N[Upgrade to Journalist]
    N --> O[Grant 50 Bonus Credits]
    O --> P[Send Approval Email]
    M -->|Rejected| Q[Send Rejection Email]
```

### Application Requirements

| Field | Requirement |
|-------|-------------|
| Message | Required, min 10 characters |
| Documents | Optional, PDF/DOC/DOCX/JPG/PNG, max 5MB |

### Approval Benefits

| Benefit | Details |
|---------|---------|
| Role Change | `user` → `journalist` |
| Verified Flag | `is_verified_journalist = true` |
| Credibility Score | Initial: 50 |
| Bonus Credits | +50 AI credits |
| Notification | Email + database notification |

### Status Flow

```
PENDING → ACCEPTED (upgrade user)
       → REJECTED (notify user)
       → ARCHIVED (old requests)
```

---

## 6. Article Creation

### Overview
Journalists create articles that go through AI auditing.

### Flowchart

```mermaid
flowchart TD
    A[Journalist Dashboard] --> B[Click Create Article]
    B --> C[Fill Article Form]
    C --> D[Write Title]
    D --> E[Write Body 50+ chars]
    E --> F[Select Category]
    F --> G[Select Type: news/article]
    G --> H[Upload Cover Image]
    H --> I[Submit]
    I --> J{Validation}
    J -->|Error| K[Show Errors]
    K --> C
    J -->|Success| L[Save with status: pending]
    L --> M[Dispatch AI Audit Job]
    M --> N[Show Warning: Under Review]
    N --> O{AI Audit Result}
    O -->|Score >= 70| P[Publish + Notify]
    O -->|Score 40-69| Q[Stay Pending + Notify]
    O -->|Score < 40| R[Reject + Notify]
```

### Form Fields

| Field | Type | Validation |
|-------|------|------------|
| Title | Text | Required, max 255 |
| Body | Textarea | Required, min 50 chars |
| Category | Select | Required, must exist |
| Type | Radio | Required: `article` or `news` |
| Image | File | Required, JPEG/PNG/WebP, max 2MB |

### AI Audit Process

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI AUDIT PROCESS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Article Body Text                                             │
│          ↓                                                      │
│   ┌─────────────────────────────────────────────────────┐      │
│   │              GROQ API (LLaMA 3.3)                    │      │
│   │  ┌─────────────────────────────────────────────┐    │      │
│   │  │ SYSTEM PROMPT:                              │    │      │
│   │  │ - Site policy rules                         │    │      │
│   │  │ - Scoring criteria                          │    │      │
│   │  │ - Output format (JSON)                      │    │      │
│   │  └─────────────────────────────────────────────┘    │      │
│   │                       ↓                              │      │
│   │  ┌─────────────────────────────────────────────┐    │      │
│   │  │ EVALUATION:                                 │    │      │
│   │  │ • Arabic language quality                   │    │      │
│   │  │ • Policy compliance                         │    │      │
│   │  │ • Hate speech detection                     │    │      │
│   │  │ • Spelling accuracy                         │    │      │
│   │  └─────────────────────────────────────────────┘    │      │
│   └─────────────────────────────────────────────────────┘      │
│          ↓                                                      │
│   { score: 85, verdict: "published", verdict_type: "trusted" } │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Article Management

### Overview
Journalists can edit and delete their own articles.

### Edit Workflow

```mermaid
flowchart TD
    A[View My Articles] --> B[Click Edit]
    B --> C{Is Owner?}
    C -->|No| D[403 Forbidden]
    C -->|Yes| E[Show Edit Form]
    E --> F[Modify Fields]
    F --> G[Submit Changes]
    G --> H[Update Article]
    H --> I[Reset Status to Pending]
    I --> J[Show Success Message]
```

### Delete Workflow

```mermaid
flowchart TD
    A[View My Articles] --> B[Click Delete]
    B --> C{Is Owner?}
    C -->|No| D[403 Forbidden]
    C -->|Yes| E[Confirm Deletion]
    E --> F{Confirmed?}
    F -->|No| G[Cancel]
    F -->|Yes| H[Delete Image from Storage]
    H --> I[Delete Article Record]
    I --> J[Show Success Message]
```

---

## 8. Subscription Purchase

### Overview
Users upgrade through Stripe checkout.

### Flowchart

```mermaid
flowchart TD
    A[View Plans Page] --> B[Compare Plans]
    B --> C[Select Plan]
    C --> D[Click Subscribe]
    D --> E{Logged In?}
    E -->|No| F[Redirect to Login]
    F --> G[Return After Login]
    G --> D
    E -->|Yes| H[Create Stripe Session]
    H --> I[Redirect to Stripe Checkout]
    I --> J[Enter Payment Details]
    J --> K{Payment Result}
    K -->|Cancel| L[Return to Cancel Page]
    K -->|Success| M[Stripe Webhook Fires]
    M --> N[Create Subscription]
    N --> O[Renew Credits]
    O --> P[Send Email]
    P --> Q[Redirect to Success Page]
```

### Payment States

| State | Description |
|-------|-------------|
| Initiated | Checkout session created |
| Pending | Waiting for Stripe webhook |
| Completed | Subscription active |
| Failed | Payment declined |
| Cancelled | User cancelled checkout |

### Post-Purchase State

| Property | Change |
|----------|--------|
| Subscription | New active subscription |
| Plan | Upgraded plan |
| Credits | Renewed to plan limit |
| Ends At | Now + plan duration |

---

## 9. Post Interaction

### Like Posts

```mermaid
flowchart TD
    A[View Article] --> B[Click Like Button]
    B --> C{Logged In?}
    C -->|No| D[Redirect to Login]
    C -->|Yes| E{Already Liked?}
    E -->|Yes| F[Remove Like]
    E -->|No| G[Add Like]
    F --> H[Update Count -1]
    G --> I[Update Count +1]
```

### Follow Users

```mermaid
flowchart TD
    A[View User Profile] --> B[Click Follow]
    B --> C{Already Following?}
    C -->|Yes| D[Unfollow]
    C -->|No| E[Follow]
    D --> F[Update Counts]
    E --> F
```

---

## 10. Content Reporting

### Overview
Users report problematic content for review.

### Flowchart

```mermaid
flowchart TD
    A[View Article] --> B[Click Report]
    B --> C{Already Reported?}
    C -->|Yes| D[Show Error: Already Reported]
    C -->|No| E[Show Report Form]
    E --> F[Enter Reason]
    F --> G[Submit Report]
    G --> H[Create PostReport]
    H --> I[Notify User: Submitted]
    I --> J[Dispatch AI Audit]
    J --> K[AI Evaluates Report]
    K --> L[Notify User: Under Review]
    L --> M[Admin Reviews]
    M --> N{Decision}
    N -->|Approve| O[Hide Post]
    O --> P[Notify Reporter: Approved]
    O --> Q[Notify Author: Post Hidden]
    N -->|Reject| R[Keep Post]
    R --> S[Notify Reporter: Rejected]
```

### Report Requirements

| Field | Requirement |
|-------|-------------|
| Reason | Required, 5-2000 characters |

### Report Statuses

| Status | Description |
|--------|-------------|
| `pending` | Awaiting review |
| `approved` | Report valid, post hidden |
| `rejected` | Report dismissed |

---

## 11. Profile Management

### Profile Edit

```mermaid
flowchart TD
    A[Profile Page] --> B[Edit Profile Tab]
    B --> C[Modify Fields]
    C --> D[Submit]
    D --> E{Validation}
    E -->|Error| F[Show Errors]
    E -->|Success| G[Update Profile]
    G --> H[Show Success Message]
```

### Editable Fields

| Field | Validation |
|-------|------------|
| Name | Required, max 255 |
| Username | Required, unique, 3-20, alphanumeric |
| Email | Unique, requires re-verification if changed |

### Password Change

```mermaid
flowchart TD
    A[Profile Page] --> B[Password Tab]
    B --> C[Enter Current Password]
    C --> D[Enter New Password]
    D --> E[Confirm New Password]
    E --> F[Submit]
    F --> G{Current Password Correct?}
    G -->|No| H[Show Error]
    G -->|Yes| I[Update Password]
    I --> J[Show Success]
```

### Account Deletion

```mermaid
flowchart TD
    A[Profile Page] --> B[Delete Account Section]
    B --> C[Click Delete]
    C --> D[Enter Password to Confirm]
    D --> E{Password Correct?}
    E -->|No| F[Show Error]
    E -->|Yes| G[Delete Account]
    G --> H[Logout]
    H --> I[Redirect to Homepage]
```

---

## 12. Notification Management

### View Notifications

```mermaid
flowchart TD
    A[Click Bell Icon] --> B[Show Dropdown]
    B --> C[View Recent Notifications]
    C --> D[Click Notification]
    D --> E[Navigate to Related Page]
    E --> F[Mark as Read]
```

### Notification Actions

| Action | Route |
|--------|-------|
| View All | `GET /notifications` |
| Mark All Read | `POST /notifications/mark-all-read` |
| Delete Single | `DELETE /notifications/{id}` |

### Notification Types for Users

| Type | Trigger |
|------|---------|
| Welcome | Registration |
| Email Verify | Need to verify |
| Post Published | Article goes live |
| Post Rejected | Article rejected |
| Post Pending | Needs manual review |
| Report Submitted | Report created |
| Report Result | Report approved/rejected |
| Payment Success | Payment completed |
| Subscription | Created/expired |

---

## Quick Reference

### User Actions Summary

| Action | Route | Auth Required |
|--------|-------|---------------|
| Register | `POST /register` | No |
| Login | `POST /login` | No |
| Verify News | `POST /verify-news` | Yes |
| Search News | `POST /search-news` | Yes |
| Create Post | `POST /my-posts` | Journalist |
| Report Post | `POST /posts/{id}/report` | Yes |
| Like Post | `POST /posts/{id}/like` | Yes |
| Subscribe | `POST /subscribe/{plan}` | Yes |
| View Profile | `GET /profile` | Yes |

### Credit Costs

| Action | Credits |
|--------|---------|
| Verify News | 1 |
| Search News | 1 |
| Post Article | 0 (free) |
| Report Content | 0 (free) |

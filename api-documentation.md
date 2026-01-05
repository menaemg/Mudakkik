# API Documentation

This document describes the API endpoints for authentication and fact-checking in the Mudakkik application.

## Authentication Endpoints

### Login

**Endpoint:** `POST /login`

**Description:** Authenticates a user and starts a session.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response (Success):**

- Status: 302 (Redirect)
- Redirects to dashboard or intended page.

**Response (Failure):**

- Status: 422 (Validation Error)
- Body:

```json
{
  "message": "The provided credentials do not match our records.",
  "errors": {
    "email": ["The provided credentials do not match our records."]
  }
}
```

### Logout

**Endpoint:** `POST /logout`

**Description:** Logs out the authenticated user and destroys the session.

**Headers:**

- `X-CSRF-TOKEN`: Required (CSRF token)

**Response:**

- Status: 302 (Redirect)
- Redirects to login page or home.

## Fact-Checking Endpoints

### Verify News

**Endpoint:** `POST /verify-news`

**Description:** Verifies the provided content for factual accuracy using AI services.

**Request Body:**

```json
{
  "content": "The news content to verify, minimum 10 characters."
}
```

**Response (Success):**

- Status: 200
- Body:

```json
{
  "status": "success",
  "result": {
    // Fact-checking result from the service
  }
}
```

**Response (Error):**

- Status: 500
- Body:

```json
{
  "status": "error",
  "message": "عذراً، حدث خطأ فني. يرجى المحاولة مرة أخرى لاحقاً."
}
```

**Validation Errors:**

- Status: 422
- Body:

```json
{
  "message": "The content field is required. (and content)",
  "errors": {
    "content": ["The content field is required."]
  }
}
```

## Notes

- All endpoints require proper CSRF protection for web requests.
- The application uses Laravel Sanctum or similar for API authentication if needed, but these are web routes.
- For API usage, ensure to handle redirects appropriately.

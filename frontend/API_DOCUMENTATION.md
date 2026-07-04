# DevTrack API Documentation

> **Base URL:** `http://localhost:8080/api` (configurable via `VITE_API_URL` env variable)
>
> **Frontend service file:** `src/services/api.js`
>
> All requests use `Content-Type: application/json`.
> All responses should return JSON.
> Authentication is handled via tokens (stored in `localStorage` as `auth_token`).

---

## Authentication

### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201):**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "token": "string"
}
```

**Error (400):**
```json
{ "error": "Email already exists" }
```

---

### POST /api/auth/login

Authenticate a user and receive a token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "bio": "string",
  "avatar": "string",
  "createdAt": "string (ISO 8601)",
  "token": "string"
}
```

**Error (401):**
```json
{ "error": "Invalid email or password" }
```

---

### POST /api/auth/logout

Invalidate the user's session/token.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{ "message": "Logged out successfully" }
```

---

### GET /api/auth/profile

Fetch the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "bio": "string",
  "avatar": "string",
  "createdAt": "string (ISO 8601)"
}
```

---

### PUT /api/auth/profile

Update the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "string",
  "bio": "string"
}
```

**Response (200):**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "bio": "string",
  "avatar": "string",
  "createdAt": "string (ISO 8601)"
}
```

---

## Entries

### GET /api/entries

Fetch all entries for the authenticated user (supports filtering and pagination).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**

| Param      | Type   | Required | Description                        |
|------------|--------|----------|------------------------------------|
| `search`   | string | No       | Search in title and description    |
| `tag`      | string | No       | Filter by tag name                 |
| `dateFrom` | string | No       | Start date filter (YYYY-MM-DD)     |
| `dateTo`   | string | No       | End date filter (YYYY-MM-DD)       |
| `page`     | number | No       | Page number (default: 1)           |
| `size`     | number | No       | Page size (default: 20)            |

**Response (200):**
```json
[
  {
    "id": "string|number",
    "title": "string",
    "date": "string (YYYY-MM-DD)",
    "description": "string (HTML content)",
    "tags": ["string"],
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
]
```

---

### GET /api/entries/:id

Fetch a single entry by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "string|number",
  "title": "string",
  "date": "string (YYYY-MM-DD)",
  "description": "string (HTML content)",
  "tags": ["string"],
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error (404):**
```json
{ "error": "Entry not found" }
```

---

### POST /api/entries

Create a new entry.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string (required, max 100 chars)",
  "date": "string (YYYY-MM-DD, required)",
  "description": "string (HTML content, optional)",
  "tags": ["string (optional array)"]
}
```

**Response (201):**
```json
{
  "id": "string|number",
  "title": "string",
  "date": "string (YYYY-MM-DD)",
  "description": "string",
  "tags": ["string"],
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

---

### PUT /api/entries/:id

Update an existing entry.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string (max 100 chars)",
  "date": "string (YYYY-MM-DD)",
  "description": "string (HTML content)",
  "tags": ["string"]
}
```

**Response (200):**
```json
{
  "id": "string|number",
  "title": "string",
  "date": "string (YYYY-MM-DD)",
  "description": "string",
  "tags": ["string"],
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

**Error (404):**
```json
{ "error": "Entry not found" }
```

---

### DELETE /api/entries/:id

Delete an entry.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{ "message": "Entry deleted successfully" }
```

**Error (404):**
```json
{ "error": "Entry not found" }
```

---

## Tags

### GET /api/tags

Fetch all unique tags used by the authenticated user (for autocomplete).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
["React", "JavaScript", "CSS", "Bug Fix"]
```

---

## Stats

### GET /api/stats

Fetch dashboard statistics for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalEntries": 42,
  "entriesToday": 1,
  "currentStreak": 5,
  "longestStreak": 12,
  "thisMonthEntries": 18,
  "weeklyDays": ["Mon", "Tue", "Wed", "Thu", "Fri"],
  "topTags": [
    { "name": "React", "count": 15 },
    { "name": "JavaScript", "count": 10 },
    { "name": "Bug Fix", "count": 7 }
  ],
  "contributions": {
    "2026-06-18": 2,
    "2026-06-19": 1,
    "2026-06-20": 3
  }
}
```

**Stats Field Descriptions:**

| Field              | Type     | Description                                        |
|--------------------|----------|----------------------------------------------------|
| `totalEntries`     | number   | Total number of entries                            |
| `entriesToday`     | number   | Entries created today                              |
| `currentStreak`    | number   | Consecutive days with entries (ending today)       |
| `longestStreak`    | number   | Longest consecutive days streak all time           |
| `thisMonthEntries` | number   | Entries created this month                         |
| `weeklyDays`       | string[] | Days of the week with at least one entry           |
| `topTags`          | array    | Most frequently used tags with their counts        |
| `contributions`    | object   | Date → entry count mapping for contribution calendar |

---

## Error Handling

All error responses follow a consistent format:

```json
{
  "error": "string (human-readable message)",
  "details": "string (optional, additional context)"
}
```

**Common HTTP Status Codes:**

| Code | Meaning                          |
|------|----------------------------------|
| 200  | Success                          |
| 201  | Created                          |
| 400  | Bad Request (validation error)   |
| 401  | Unauthorized (invalid/expired token) |
| 403  | Forbidden (access denied)        |
| 404  | Not Found                        |
| 500  | Internal Server Error            |

---

## Authentication Flow

1. User registers via `POST /api/auth/register` or logs in via `POST /api/auth/login`
2. Backend returns a JWT token in the response
3. Frontend stores the token in `localStorage` as `auth_token`
4. All subsequent requests include the token in the `Authorization: Bearer <token>` header
5. On `401 Unauthorized` response, the frontend clears the token and redirects to `/login`

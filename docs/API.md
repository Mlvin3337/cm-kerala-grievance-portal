# API Documentation

## 1. Overview

The CM Kerala Grievance Portal provides REST API endpoints through an Express.js backend.

**Production API Base URL:**

```text
https://cm-kerala-grievance-api.onrender.com/api
```

**Content Type:** `application/json`

**Authentication:** JWT Bearer Token

## 2. Authentication

Protected endpoints require a valid JWT access token.

Include the token in the request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## 3. Authentication Endpoints

Base path: `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a citizen account. |
| POST | `/login` | Public | Authenticate and obtain an access token. |
| GET | `/profile` | Authenticated | Retrieve the user's profile. |
| POST | `/logout` | Authenticated | Log out the authenticated user. |

## 4. Department Endpoints

Base path: `/api/departments`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Retrieve departments. |
| GET | `/:id` | Public | Retrieve department details. |
| GET | `/grievances` | Department Officer | Retrieve assigned grievances. |
| GET | `/grievances/:id` | Department Officer | Retrieve grievance details. |
| PUT | `/grievances/:id/investigation` | Department Officer | Update investigation details. |
| POST | `/grievances/:id/action-report` | Department Officer | Submit an action-taken report. |

## 5. Grievance Endpoints

Base path: `/api/grievances`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Authenticated Citizen | Submit a grievance with an optional attachment. |
| GET | `/my` | Authenticated Citizen | Retrieve the citizen's grievances. |
| GET | `/track/:referenceNumber` | Public | Track a grievance using its reference number. |
| POST | `/:grievanceId/feedback` | Authenticated Citizen | Submit feedback after grievance resolution. |

### Grievance Submission

The grievance submission endpoint supports `multipart/form-data` because it accepts an optional file upload.

**Attachment field:** `attachment`

### Grievance Tracking

Citizens can track grievance progress using the reference number without logging in.

### Citizen Feedback

Authenticated citizens can submit feedback for their grievances after resolution.

## 6. CMO Administration Endpoints

Base path: `/api/cmo`

All CMO endpoints require authentication and the `CMO_ADMIN` role.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/stats` | CMO Admin | Retrieve dashboard statistics. |
| GET | `/grievances` | CMO Admin | Retrieve all grievances. |
| GET | `/grievances/:id` | CMO Admin | Retrieve detailed grievance information. |
| GET | `/officers` | CMO Admin | Retrieve department officers. |
| POST | `/assign` | CMO Admin | Assign a grievance to a department/officer. |
| POST | `/grievances/:id/review` | CMO Admin | Review a department action-taken report. |

## 7. Health Check

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/health` | Public | Check backend availability. |

Production URL:

```text
https://cm-kerala-grievance-api.onrender.com/api/health
```

## 8. HTTP Status Codes

| Status Code | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created successfully |
| 400 | Invalid request |
| 401 | Authentication required or invalid |
| 403 | Access denied |
| 404 | Resource or endpoint not found |
| 500 | Internal server error |

## 9. Security

- JWT authentication protects restricted endpoints.
- Role-based authorization separates citizen, officer, and CMO access.
- Passwords are securely hashed.
- Environment variables protect sensitive configuration.
- Database operations are handled by the backend.
- Public grievance tracking uses a reference number.

## 10. Backend Route Structure

```text
backend/
└── routes/
    ├── authRoutes.js
    ├── departmentRoutes.js
    ├── grievanceRoutes.js
    └── cmoRoutes.js
```

Each route module connects API endpoints to controller functions. Authentication and authorization middleware protect restricted operations.
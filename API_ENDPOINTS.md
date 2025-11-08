# API Endpoints Documentation

This document lists all the API endpoints available in the Jaijawan Chs website.

## Authentication Endpoints

### POST /api/auth/login
Login endpoint for user authentication.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "email": "user@example.com"
  }
}
```

---

### POST /api/auth/signup
Signup endpoint for creating new user accounts.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "user@example.com",
  "phone": "+91-1234567890",
  "password": "password123",
  "confirmPassword": "password123",
  "flatUnit": "A-101"
}
```

**Response (201):**
```json
{
  "message": "Account created successfully",
  "user": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

## Contact Endpoints

### POST /api/contact
Submit contact form inquiries.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+91-1234567890",
  "email": "user@example.com",
  "inquiry": "status-update",
  "messageType": "suggestion",
  "message": "Your message here"
}
```

**Response (200):**
```json
{
  "message": "Your inquiry has been submitted successfully",
  "ticketId": "TICKET-1234567890"
}
```

---

## Document Access Endpoints

### POST /api/documents/request
Request access to confidential documents.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "flatUnit": "A-101",
  "email": "user@example.com",
  "password": "password123",
  "documents": ["development-agreement", "rera-certificate"]
}
```

**Response (200):**
```json
{
  "message": "Document access request submitted successfully",
  "requestId": "DOC-1234567890",
  "status": "pending",
  "estimatedTime": "72 business hours"
}
```

---

## Careers Endpoints

### POST /api/careers/submit
Submit resume for job applications.

**Request Body:** (FormData)
- `name`: string
- `email`: string
- `resume`: File (PDF, DOC, DOCX)

**Response (200):**
```json
{
  "message": "Your resume has been submitted successfully",
  "applicationId": "APP-1234567890"
}
```

---

## Newsletter Endpoints

### POST /api/newsletter/subscribe
Subscribe to newsletter.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Successfully subscribed to newsletter"
}
```

---

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

Common status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error


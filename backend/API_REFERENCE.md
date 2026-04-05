# LMS Backend - API Reference

Complete REST API endpoint documentation for the Learning Management System backend.

## Base URL
- **Development**: `http://localhost:8080`
- **Production**: `https://your-domain.com`

## Authentication
Most endpoints require JWT token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Response Format
All responses are JSON. Successful responses include data. Error responses include error message.

```json
{
  "error": "Error message"
}
```

---

## Authentication Endpoints (Public)

### POST /api/auth/google
Login with Google OAuth2 token

**Request**
```json
{
  "tokenId": "google_id_token_from_frontend"
}
```

**Response (201)**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "avatarUrl": "https://...",
    "role": "STUDENT",
    "createdAt": "2024-01-01T10:00:00"
  },
  "message": "Login successful"
}
```

### GET /api/auth/me
Get current logged-in user info

**Headers**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200)**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "avatarUrl": "https://...",
  "role": "STUDENT",
  "createdAt": "2024-01-01T10:00:00"
}
```

### POST /api/auth/logout
Logout current user

**Response (200)**
```json
{
  "message": "Logged out successfully"
}
```

---

## Course Endpoints

### GET /api/courses
List all published courses (public, paginated)

**Query Parameters**
- `page` (0-indexed, default: 0)
- `size` (default: 20)
- `sort` (e.g., "id,desc")

**Response (200)**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Introduction to Java",
      "description": "Learn Java programming...",
      "price": 4999.00,
      "thumbnailUrl": "https://...",
      "category": "Programming",
      "instructorId": 2,
      "instructorName": "John Instructor",
      "instructorEmail": "john@lms.com",
      "published": true,
      "createdAt": "2024-01-01T10:00:00"
    }
  ],
  "totalElements": 10,
  "totalPages": 1,
  "currentPage": 0
}
```

### GET /api/courses/{id}
Get single course details (public)

**Response (200)**
```json
{
  "id": 1,
  "title": "Introduction to Java",
  "description": "Learn Java programming...",
  "price": 4999.00,
  "thumbnailUrl": "https://...",
  "category": "Programming",
  "instructorId": 2,
  "instructorName": "John Instructor",
  "instructorEmail": "john@lms.com",
  "published": true,
  "createdAt": "2024-01-01T10:00:00"
}
```

### POST /api/courses
Create new course (INSTRUCTOR/ADMIN only)

**Headers**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request**
```json
{
  "title": "Python Basics",
  "description": "Learn Python from scratch",
  "price": 2999.00,
  "thumbnailUrl": "https://...",
  "category": "Programming"
}
```

**Response (201)**
```json
{
  "id": 4,
  "title": "Python Basics",
  "description": "Learn Python from scratch",
  "price": 2999.00,
  "thumbnailUrl": "https://...",
  "category": "Programming",
  "instructorId": 2,
  "instructorName": "John Instructor",
  "instructorEmail": "john@lms.com",
  "published": false,
  "createdAt": "2024-01-01T10:00:00"
}
```

### PUT /api/courses/{id}
Update course (instructor/ADMIN only)

**Headers**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request**
```json
{
  "title": "Python Advanced",
  "description": "Advanced Python concepts",
  "price": 3999.00,
  "published": true
}
```

**Response (200)**
```json
{
  "id": 4,
  "title": "Python Advanced",
  "description": "Advanced Python concepts",
  "price": 3999.00,
  "thumbnailUrl": "https://...",
  "category": "Programming",
  "instructorId": 2,
  "instructorName": "John Instructor",
  "instructorEmail": "john@lms.com",
  "published": true,
  "createdAt": "2024-01-01T10:00:00"
}
```

### DELETE /api/courses/{id}
Delete course (instructor/ADMIN only)

**Response (200)**
```json
{
  "message": "Course deleted successfully"
}
```

### GET /api/courses/{id}/lessons
Get all lessons for a course (public)

**Response (200)**
```json
[
  {
    "id": 1,
    "courseId": 1,
    "title": "Java Basics",
    "description": "Introduction to Java syntax",
    "youtubeUrl": "https://youtube.com/watch?v=...",
    "orderIndex": 1,
    "durationMinutes": 45
  },
  {
    "id": 2,
    "courseId": 1,
    "title": "OOP Concepts",
    "description": "Object-oriented programming",
    "youtubeUrl": "https://youtube.com/watch?v=...",
    "orderIndex": 2,
    "durationMinutes": 60
  }
]
```

### POST /api/courses/{id}/lessons
Add lesson to course (INSTRUCTOR only)

**Headers**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request**
```json
{
  "title": "Collections Framework",
  "description": "Working with Java collections",
  "youtubeUrl": "https://youtube.com/watch?v=...",
  "orderIndex": 3,
  "durationMinutes": 50
}
```

**Response (201)**
```json
{
  "id": 3,
  "courseId": 1,
  "title": "Collections Framework",
  "description": "Working with Java collections",
  "youtubeUrl": "https://youtube.com/watch?v=...",
  "orderIndex": 3,
  "durationMinutes": 50
}
```

### PUT /api/courses/lessons/{lessonId}
Update lesson (INSTRUCTOR only)

**Request**
```json
{
  "title": "Advanced Collections",
  "durationMinutes": 55
}
```

**Response (200)**
```json
{
  "id": 3,
  "courseId": 1,
  "title": "Advanced Collections",
  "description": "Working with Java collections",
  "youtubeUrl": "https://youtube.com/watch?v=...",
  "orderIndex": 3,
  "durationMinutes": 55
}
```

### DELETE /api/courses/lessons/{lessonId}
Delete lesson (INSTRUCTOR only)

**Response (200)**
```json
{
  "message": "Lesson deleted successfully"
}
```

---

## Enrollment Endpoints

### POST /api/enroll
Enroll in a course

**Headers**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request**
```json
{
  "courseId": 1
}
```

**Response (201)**
```json
{
  "id": 10,
  "studentId": 5,
  "courseId": 1,
  "courseTitle": "Introduction to Java",
  "courseThumbnail": "https://...",
  "enrolledAt": "2024-01-15T10:00:00",
  "completed": false,
  "completedAt": null,
  "progressPercentage": 0
}
```

### GET /api/enrollments
Get my enrolled courses

**Response (200)**
```json
[
  {
    "id": 10,
    "studentId": 5,
    "courseId": 1,
    "courseTitle": "Introduction to Java",
    "courseThumbnail": "https://...",
    "enrolledAt": "2024-01-15T10:00:00",
    "completed": false,
    "completedAt": null,
    "progressPercentage": 33
  }
]
```

### POST /api/progress
Mark lesson as complete

**Request**
```json
{
  "enrollmentId": 10,
  "lessonId": 1
}
```

**Response (200)**
```json
{
  "message": "Lesson marked as complete",
  "progressPercentage": 33
}
```

### GET /api/progress/{courseId}
Get my progress in a course

**Response (200)**
```json
{
  "enrollmentId": 10,
  "courseId": 1,
  "progressPercentage": 66,
  "completed": false
}
```

---

## Quiz Endpoints

### GET /api/quiz/lesson/{lessonId}
Get quiz for a lesson

**Response (200)**
```json
{
  "id": 1,
  "courseId": 1,
  "lessonId": 1,
  "title": "Java Basics Quiz",
  "isFinal": false,
  "passingScore": 70,
  "questions": [
    {
      "id": 1,
      "questionText": "What is the entry point of Java?",
      "optionA": "main()",
      "optionB": "start()",
      "optionC": "run()",
      "optionD": "init()",
      "points": 1,
      "correctOption": "A"
    }
  ],
  "createdAt": "2024-01-01T10:00:00"
}
```

### GET /api/quiz/final/{courseId}
Get final assessment for course

**Response (200)**
```json
{
  "id": 2,
  "courseId": 1,
  "lessonId": null,
  "title": "Java Final Assessment",
  "isFinal": true,
  "passingScore": 75,
  "questions": [...],
  "createdAt": "2024-01-01T10:00:00"
}
```

### POST /api/quiz/submit
Submit quiz answers

**Request**
```json
{
  "quizId": 1,
  "answers": [
    {
      "questionId": 1,
      "selectedOption": "A"
    },
    {
      "questionId": 2,
      "selectedOption": "B"
    }
  ]
}
```

**Response (200)**
```json
{
  "score": 85,
  "maxScore": 100,
  "passed": true,
  "passingScore": 70
}
```

### GET /api/quiz/attempts/{courseId}
Get my quiz attempts in a course

**Response (200)**
```json
[
  {
    "id": 1,
    "quizId": 1,
    "quizTitle": "Java Basics Quiz",
    "score": 85,
    "maxScore": 100,
    "passed": true,
    "passingScore": 70,
    "attemptedAt": "2024-01-20T10:00:00"
  }
]
```

---

## Live Session Endpoints

### GET /api/sessions
Get upcoming sessions

**Response (200)**
```json
[
  {
    "id": 1,
    "courseId": 1,
    "courseTitle": "Introduction to Java",
    "instructorId": 2,
    "instructorName": "John Instructor",
    "title": "Q&A Session",
    "description": "Ask questions about Java basics",
    "meetingLink": "https://zoom.us/j/...",
    "scheduledAt": "2024-02-01T15:00:00",
    "durationMinutes": 60,
    "active": false
  }
]
```

### GET /api/sessions/course/{courseId}
Get sessions for a course

**Response (200)**
```json
[...]
```

### POST /api/sessions
Create new session (INSTRUCTOR only)

**Request**
```json
{
  "courseId": 1,
  "title": "Advanced Topics",
  "description": "Discussion on advanced Java topics",
  "meetingLink": "https://zoom.us/j/...",
  "scheduledAt": "2024-02-05T14:00:00",
  "durationMinutes": 90
}
```

**Response (201)**
```json
{
  "id": 2,
  "courseId": 1,
  "courseTitle": "Introduction to Java",
  "instructorId": 2,
  "instructorName": "John Instructor",
  "title": "Advanced Topics",
  "description": "Discussion on advanced Java topics",
  "meetingLink": "https://zoom.us/j/...",
  "scheduledAt": "2024-02-05T14:00:00",
  "durationMinutes": 90,
  "active": false
}
```

### PUT /api/sessions/{id}
Update session (INSTRUCTOR only)

**Request**
```json
{
  "title": "Updated Title",
  "active": true
}
```

**Response (200)**
```json
{
  "id": 2,
  "courseId": 1,
  "courseTitle": "Introduction to Java",
  "instructorId": 2,
  "instructorName": "John Instructor",
  "title": "Updated Title",
  "description": "Discussion on advanced Java topics",
  "meetingLink": "https://zoom.us/j/...",
  "scheduledAt": "2024-02-05T14:00:00",
  "durationMinutes": 90,
  "active": true
}
```

### DELETE /api/sessions/{id}
Delete session (INSTRUCTOR only)

**Response (200)**
```json
{
  "message": "Session deleted successfully"
}
```

---

## Payment Endpoints

### POST /api/payment/create-order
Create Razorpay payment order

**Request**
```json
{
  "courseId": 2,
  "amount": 5999.00
}
```

**Response (201)**
```json
{
  "payment": {
    "id": 1,
    "studentId": 5,
    "courseId": 2,
    "razorpayOrderId": "order_123456",
    "amount": 5999.00,
    "status": "CREATED",
    "createdAt": "2024-01-20T10:00:00"
  },
  "orderId": "order_123456"
}
```

### POST /api/payment/verify
Verify payment and enroll student

**Request**
```json
{
  "razorpayOrderId": "order_123456",
  "razorpayPaymentId": "pay_123456",
  "razorpaySignature": "signature_here"
}
```

**Response (200)**
```json
{
  "message": "Payment verified successfully",
  "payment": {
    "id": 1,
    "studentId": 5,
    "courseId": 2,
    "razorpayOrderId": "order_123456",
    "razorpayPaymentId": "pay_123456",
    "amount": 5999.00,
    "status": "PAID",
    "createdAt": "2024-01-20T10:00:00"
  }
}
```

---

## Certificate Endpoints

### POST /api/certificate/generate/{courseId}
Generate certificate (if eligible)

**Response (201)**
```json
{
  "id": 1,
  "studentId": 5,
  "studentName": "Alice Student",
  "courseId": 1,
  "courseTitle": "Introduction to Java",
  "certificateNumber": "550e8400-e29b-41d4-a716-446655440000",
  "issuedAt": "2024-01-25T10:00:00"
}
```

### GET /api/certificate/download/{certificateId}
Download certificate as PDF

**Response (200)**
```
[PDF binary content]
Headers:
  Content-Type: application/pdf
  Content-Disposition: attachment; filename="certificate_1.pdf"
```

### GET /api/certificate/my
Get my certificates

**Response (200)**
```json
[
  {
    "id": 1,
    "studentId": 5,
    "studentName": "Alice Student",
    "courseId": 1,
    "courseTitle": "Introduction to Java",
    "certificateNumber": "550e8400-e29b-41d4-a716-446655440000",
    "issuedAt": "2024-01-25T10:00:00"
  }
]
```

---

## User Management Endpoints (ADMIN only)

### GET /api/users
List all users

**Query Parameters**
- `page` (default: 0)
- `size` (default: 20)

**Response (200)**
```json
{
  "content": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@lms.com",
      "avatarUrl": null,
      "role": "ADMIN",
      "createdAt": "2024-01-01T10:00:00"
    }
  ],
  "totalElements": 5,
  "totalPages": 1
}
```

### PUT /api/users/{id}/role
Update user role

**Request**
```json
{
  "role": "INSTRUCTOR"
}
```

**Response (200)**
```json
{
  "id": 5,
  "name": "Bob Student",
  "email": "bob@lms.com",
  "avatarUrl": null,
  "role": "INSTRUCTOR",
  "createdAt": "2024-01-01T10:00:00"
}
```

---

## Dashboard Endpoint

### GET /api/dashboard
Get role-specific dashboard data

**Response (200) - Student**
```json
{
  "enrolledCourses": [...],
  "enrollmentCount": 3,
  "upcomingSessions": [...],
  "certificatesEarned": 1
}
```

**Response (200) - Instructor**
```json
{
  "totalCourses": 5,
  "publishedCourses": 3,
  "totalStudents": 45,
  "upcomingSessions": [...]
}
```

**Response (200) - Admin**
```json
{
  "totalUsers": 50,
  "totalInstructors": 5,
  "totalStudents": 45,
  "totalCourses": 10,
  "totalEnrollments": 150,
  "totalPayments": 45,
  "totalRevenue": 224955.00
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid courseId or amount"
}
```

### 401 Unauthorized
```json
{
  "error": "User not found"
}
```

### 403 Forbidden
```json
{
  "error": "Only ADMIN can view users"
}
```

### 404 Not Found
```json
{
  "error": "Course not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Status Codes

- **200 OK** - Successful GET/PUT
- **201 Created** - Successful POST
- **204 No Content** - Successful DELETE (sometimes)
- **400 Bad Request** - Invalid input
- **401 Unauthorized** - Missing/invalid token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

---

## Testing Tips

1. Use Postman or cURL to test endpoints
2. Always include `Authorization: Bearer TOKEN` header for protected endpoints
3. Set `Content-Type: application/json` for POST/PUT requests
4. Use sample data provided in data.sql for testing
5. Check application logs for debugging

## Quick Test Commands

```bash
# Get public courses
curl http://localhost:8080/api/courses

# Get current user (with token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/auth/me

# Enroll in course
curl -X POST http://localhost:8080/api/enroll \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"courseId":1}'

# Get my enrollments
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/enrollments
```

---

This API reference covers all 50+ endpoints in the LMS backend.

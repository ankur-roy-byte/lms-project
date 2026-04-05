# EduLearn Frontend - API Integration Documentation

This document outlines all API endpoints used by the frontend and their expected request/response formats.

## Base URL
```
http://localhost:8080/api
```

## Authentication

All protected endpoints require an Authorization header with JWT token:
```
Authorization: Bearer {token}
```

The token is automatically attached by the axios interceptor in `src/api/axiosConfig.js`.

---

## Authentication Endpoints

### POST /auth/google
Sign in user with Google OAuth token.

**Request:**
```json
{
  "token": "google_credential_token"
}
```

**Response (200):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "STUDENT",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Implementation:** `src/api/authApi.js` - `googleLogin(credential)`

---

### GET /auth/me
Get current authenticated user.

**Response (200):**
```json
{
  "id": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  "role": "STUDENT",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Implementation:** `src/api/authApi.js` - `getCurrentUser()`

---

## Dashboard Endpoints

### GET /dashboard
Get role-specific dashboard data.

**Response (200) - Student:**
```json
{
  "role": "STUDENT",
  "streak": 5,
  "enrolledCourses": 3,
  "certificates": 1,
  "upcomingSessions": [
    {
      "id": "session_id",
      "title": "React Hooks Q&A",
      "courseName": "Advanced React",
      "instructorName": "John Doe",
      "scheduledAt": "2024-01-15T10:00:00Z",
      "duration": 60,
      "meetingLink": "https://meet.google.com/..."
    }
  ]
}
```

**Response (200) - Instructor:**
```json
{
  "role": "INSTRUCTOR",
  "courseCount": 3,
  "studentCount": 50,
  "revenue": 5000,
  "courses": [
    {
      "id": "course_id",
      "title": "Advanced React",
      "enrollmentCount": 20,
      "revenue": 2000
    }
  ]
}
```

**Response (200) - Admin:**
```json
{
  "role": "ADMIN",
  "totalUsers": 100,
  "totalCourses": 20,
  "totalEnrollments": 500,
  "totalRevenue": 50000
}
```

**Implementation:** `src/api/dashboardApi.js` - `getDashboard()`

---

## Course Endpoints

### GET /courses
Get paginated list of courses with search and filter.

**Query Parameters:**
- `page` (integer) - Page number (default: 1)
- `search` (string) - Search by course title
- `category` (string) - Filter by category

**Response (200):**
```json
{
  "courses": [
    {
      "id": "course_id",
      "title": "Advanced React",
      "description": "Master React 18...",
      "thumbnail": "https://...",
      "instructorName": "John Doe",
      "price": 999,
      "rating": 4.5,
      "enrollmentCount": 50,
      "category": "Web Development",
      "duration": 10
    }
  ],
  "totalPages": 3,
  "currentPage": 1
}
```

**Implementation:** `src/api/courseApi.js` - `getCourses(page, search, category)`

---

### GET /courses/{id}
Get detailed course information.

**Response (200):**
```json
{
  "id": "course_id",
  "title": "Advanced React",
  "description": "Master React 18...",
  "thumbnail": "https://...",
  "instructorName": "John Doe",
  "instructorId": "instructor_id",
  "price": 999,
  "rating": 4.5,
  "enrollmentCount": 50,
  "category": "Web Development",
  "duration": 10,
  "lessons": [
    {
      "id": "lesson_id",
      "title": "Hooks Deep Dive",
      "description": "Understanding hooks...",
      "videoUrl": "https://youtu.be/...",
      "duration": 45,
      "order": 1,
      "quizId": "quiz_id"
    }
  ]
}
```

**Implementation:** `src/api/courseApi.js` - `getCourse(id)`

---

### POST /courses
Create a new course (Instructor only).

**Request:**
```json
{
  "title": "New Course",
  "description": "Course description",
  "category": "Web Development",
  "price": 999
}
```

**Response (201):**
```json
{
  "id": "course_id",
  "title": "New Course",
  "description": "Course description",
  "category": "Web Development",
  "price": 999,
  "isPublished": false
}
```

**Implementation:** `src/api/courseApi.js` - `createCourse(data)`

---

### GET /courses/{courseId}/lessons
Get all lessons for a course.

**Response (200):**
```json
[
  {
    "id": "lesson_id",
    "title": "Hooks Deep Dive",
    "description": "Understanding hooks...",
    "videoUrl": "https://youtu.be/...",
    "duration": 45,
    "order": 1,
    "quizId": "quiz_id"
  }
]
```

**Implementation:** `src/api/courseApi.js` - `getLessons(courseId)`

---

## Enrollment Endpoints

### POST /enroll
Enroll student in a course.

**Request:**
```json
{
  "courseId": "course_id"
}
```

**Response (201):**
```json
{
  "enrollmentId": "enrollment_id",
  "courseId": "course_id",
  "userId": "user_id",
  "enrolledAt": "2024-01-01T00:00:00Z",
  "progressPercentage": 0
}
```

**Implementation:** `src/api/enrollmentApi.js` - `enroll(courseId)`

---

### GET /enrollments
Get all enrollments for current user.

**Response (200):**
```json
[
  {
    "id": "enrollment_id",
    "courseId": "course_id",
    "course": {
      "id": "course_id",
      "title": "Advanced React",
      "thumbnail": "https://...",
      "instructorName": "John Doe"
    },
    "progressPercentage": 45,
    "enrolledAt": "2024-01-01T00:00:00Z"
  }
]
```

**Implementation:** `src/api/enrollmentApi.js` - `getMyEnrollments()`

---

### POST /progress
Mark a lesson as complete.

**Request:**
```json
{
  "enrollmentId": "enrollment_id",
  "lessonId": "lesson_id"
}
```

**Response (200):**
```json
{
  "progressPercentage": 50,
  "completedLessons": ["lesson_id_1", "lesson_id_2"]
}
```

**Implementation:** `src/api/enrollmentApi.js` - `markLessonComplete(enrollmentId, lessonId)`

---

### GET /progress/{courseId}
Get course progress for student.

**Response (200):**
```json
{
  "courseId": "course_id",
  "progressPercentage": 50,
  "completedLessons": ["lesson_id_1", "lesson_id_2"],
  "totalLessons": 10
}
```

**Implementation:** `src/api/enrollmentApi.js` - `getCourseProgress(courseId)`

---

## Quiz Endpoints

### GET /quiz/lesson/{lessonId}
Get quiz questions for a lesson.

**Response (200):**
```json
{
  "id": "quiz_id",
  "title": "Hooks Quiz",
  "lessonId": "lesson_id",
  "passingScore": 70,
  "timeLimit": 15,
  "questions": [
    {
      "id": "question_id",
      "question": "What is a hook?",
      "optionA": "Option A",
      "optionB": "Option B",
      "optionC": "Option C",
      "optionD": "Option D",
      "correctAnswer": "A"
    }
  ]
}
```

**Implementation:** `src/api/quizApi.js` - `getLessonQuiz(lessonId)`

---

### GET /quiz/final/{courseId}
Get final assessment for a course.

**Response (200):**
```json
{
  "id": "final_quiz_id",
  "title": "Final Assessment",
  "courseId": "course_id",
  "passingScore": 60,
  "timeLimit": 120,
  "questions": [...]
}
```

**Implementation:** `src/api/quizApi.js` - `getFinalQuiz(courseId)`

---

### POST /quiz/submit
Submit quiz answers.

**Request:**
```json
{
  "quizId": "quiz_id",
  "answers": [
    {
      "questionId": "question_id",
      "selectedOption": "A"
    }
  ]
}
```

**Response (200):**
```json
{
  "quizId": "quiz_id",
  "score": 85,
  "percentage": 85,
  "correctAnswers": 17,
  "totalQuestions": 20,
  "passed": true,
  "passingScore": 60
}
```

**Implementation:** `src/api/quizApi.js` - `submitQuiz(quizId, answers)`

---

## Session Endpoints

### GET /sessions
Get all upcoming live sessions.

**Response (200):**
```json
[
  {
    "id": "session_id",
    "title": "React Q&A",
    "courseName": "Advanced React",
    "instructorName": "John Doe",
    "scheduledAt": "2024-01-15T10:00:00Z",
    "duration": 60,
    "meetingLink": "https://meet.google.com/..."
  }
]
```

**Implementation:** `src/api/sessionApi.js` - `getSessions()`

---

### POST /sessions
Create a new live session (Instructor only).

**Request:**
```json
{
  "title": "React Q&A",
  "courseName": "Advanced React",
  "meetingLink": "https://meet.google.com/...",
  "scheduledAt": "2024-01-15T10:00:00Z",
  "duration": 60
}
```

**Response (201):**
```json
{
  "id": "session_id",
  "title": "React Q&A",
  "courseName": "Advanced React",
  "meetingLink": "https://meet.google.com/...",
  "scheduledAt": "2024-01-15T10:00:00Z",
  "duration": 60
}
```

**Implementation:** `src/api/sessionApi.js` - `createSession(data)`

---

## Payment Endpoints

### POST /payment/create-order
Create Razorpay order for course enrollment.

**Request:**
```json
{
  "courseId": "course_id"
}
```

**Response (201):**
```json
{
  "orderId": "razorpay_order_id",
  "amount": 99900,
  "currency": "INR",
  "courseId": "course_id"
}
```

**Implementation:** `src/api/paymentApi.js` - `createOrder(courseId)`

---

### POST /payment/verify
Verify Razorpay payment and complete enrollment.

**Request:**
```json
{
  "orderId": "razorpay_order_id",
  "paymentId": "razorpay_payment_id",
  "signature": "razorpay_signature"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment verified and enrollment completed",
  "enrollmentId": "enrollment_id"
}
```

**Implementation:** `src/api/paymentApi.js` - `verifyPayment(paymentData)`

---

## Certificate Endpoints

### POST /certificate/generate/{courseId}
Generate certificate for completed course.

**Response (201):**
```json
{
  "id": "certificate_id",
  "userId": "user_id",
  "courseId": "course_id",
  "courseName": "Advanced React",
  "userName": "Student Name",
  "issuedAt": "2024-01-20T00:00:00Z",
  "certificateNumber": "CERT-2024-001"
}
```

**Implementation:** `src/api/certificateApi.js` - `generateCertificate(courseId)`

---

### GET /certificate/my
Get all certificates for current user.

**Response (200):**
```json
[
  {
    "id": "certificate_id",
    "courseId": "course_id",
    "courseName": "Advanced React",
    "userName": "Student Name",
    "issuedAt": "2024-01-20T00:00:00Z",
    "certificateNumber": "CERT-2024-001"
  }
]
```

**Implementation:** `src/api/certificateApi.js` - `getMyCertificates()`

---

### GET /certificate/download/{certId}
Download certificate as PDF.

**Response (200):** PDF file

**Implementation:** `src/api/certificateApi.js` - `downloadCertificate(certId)`

---

## Admin Endpoints

### GET /admin/users
Get all users (Admin only).

**Query Parameters:**
- `page` (integer)
- `search` (string)
- `role` (string) - STUDENT, INSTRUCTOR, ADMIN

**Response (200):**
```json
{
  "users": [
    {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "STUDENT",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "totalPages": 5
}
```

**Implementation:** `src/api/adminApi.js` - `getAllUsers(page, search, role)`

---

### PUT /admin/users/{userId}/role
Update user role (Admin only).

**Request:**
```json
{
  "role": "INSTRUCTOR"
}
```

**Response (200):**
```json
{
  "id": "user_id",
  "name": "User Name",
  "role": "INSTRUCTOR"
}
```

**Implementation:** `src/api/adminApi.js` - `updateUserRole(userId, role)`

---

### GET /admin/courses
Get all courses (Admin only).

**Response (200):**
```json
{
  "courses": [
    {
      "id": "course_id",
      "title": "Advanced React",
      "instructorName": "John Doe",
      "enrollmentCount": 50,
      "revenue": 49500,
      "isPublished": true
    }
  ],
  "totalPages": 2
}
```

**Implementation:** `src/api/adminApi.js` - `getAllCourses(page, search)`

---

### GET /admin/payments
Get all payments (Admin only).

**Response (200):**
```json
{
  "payments": [
    {
      "id": "payment_id",
      "orderId": "razorpay_order_id",
      "userName": "Student Name",
      "courseName": "Advanced React",
      "amount": 999,
      "status": "COMPLETED",
      "createdAt": "2024-01-15T00:00:00Z"
    }
  ],
  "totalPages": 3
}
```

**Implementation:** `src/api/adminApi.js` - `getPayments(page, status)`

---

## Error Handling

All endpoints may return errors. Common error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request parameters",
  "message": "Course ID is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "JWT token is invalid or expired"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Course with ID 123 not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

API has rate limiting to prevent abuse. Common limits:
- 100 requests per minute per IP
- 1000 requests per hour per user

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642320000
```

## Testing with Postman

To test these endpoints:

1. Create a new Postman collection
2. Set base URL to `http://localhost:8080/api`
3. After login, copy JWT token
4. Add to Authorization header: `Bearer {token}`
5. Test each endpoint

## Response Format

All successful responses follow this format:
```json
{
  "status": "success",
  "data": { /* endpoint-specific data */ },
  "message": "Success message"
}
```

Paginated responses include:
```json
{
  "status": "success",
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "totalItems": 100
  }
}
```

## Timeout

- Default timeout: 10 seconds
- For file downloads: 30 seconds

Adjust in `src/api/axiosConfig.js` if needed.

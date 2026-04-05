# LMS Backend - Production-Grade Learning Management System

A complete, deployable Learning Management System backend built with Java 17, Spring Boot 3.2, Spring Security, OAuth2, and PostgreSQL.

## Features

- **User Authentication & Authorization**
  - Google OAuth2 login integration
  - JWT token-based API authentication
  - Role-based access control (STUDENT, INSTRUCTOR, ADMIN)

- **Course Management**
  - Create, update, and publish courses
  - Lesson management with ordering
  - Course categorization and pricing

- **Student Enrollment**
  - Enroll in free and paid courses
  - Track learning progress per lesson
  - Monitor course completion

- **Quiz & Assessment**
  - Create quizzes with multiple choice questions
  - Final course assessments
  - Automatic score calculation and pass/fail determination

- **Live Sessions**
  - Schedule live classes with Zoom/Google Meet links
  - Track upcoming sessions
  - Instructor and student session management

- **Payment Integration**
  - Razorpay payment gateway integration
  - Secure payment verification with signature validation
  - Automatic enrollment after payment

- **Certificate Generation**
  - Automatic PDF certificate generation with PDFBox
  - Unique certificate numbers for verification
  - Eligibility checking (all lessons + final quiz)

- **Dashboard Analytics**
  - Student: enrolled courses, progress, upcoming sessions, certificates
  - Instructor: my courses, student count, upcoming sessions
  - Admin: system-wide statistics and revenue tracking

## Technology Stack

- **Language**: Java 17
- **Framework**: Spring Boot 3.2
- **Database**: PostgreSQL (prod), H2 (dev)
- **Authentication**: Spring Security, OAuth2 with Google, JWT (jjwt 0.12.3)
- **Payment**: Razorpay
- **PDF Generation**: Apache PDFBox 3.0.1
- **Build**: Maven
- **ORM**: Spring Data JPA / Hibernate

## Project Structure

```
src/main/java/com/lms/
├── config/              # Security, CORS, Razorpay configuration
├── auth/                # Google OAuth2, JWT, Authentication
├── user/                # User entity, repository, service, controller
├── course/              # Course and Lesson entities with full CRUD
├── enrollment/          # Student enrollment and progress tracking
├── quiz/                # Quiz, questions, and attempts
├── session/             # Live session management
├── payment/             # Payment processing and Razorpay integration
├── certificate/         # Certificate generation and management
├── dashboard/           # Role-based dashboard analytics
└── LmsApplication.java  # Main Spring Boot application
```

## API Endpoints

### Authentication
- `POST /api/auth/google` - Login with Google token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout

### Courses (Public)
- `GET /api/courses` - List published courses (paginated)
- `GET /api/courses/{id}` - Get course details
- `GET /api/courses/{id}/lessons` - Get course lessons

### Courses (Instructor/Admin)
- `POST /api/courses` - Create course
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course
- `POST /api/courses/{id}/lessons` - Add lesson
- `PUT /api/courses/lessons/{lessonId}` - Update lesson
- `DELETE /api/courses/lessons/{lessonId}` - Delete lesson

### Enrollment
- `POST /api/enroll` - Enroll in course
- `GET /api/enrollments` - Get my enrollments
- `POST /api/progress` - Mark lesson complete
- `GET /api/progress/{courseId}` - Get progress for course

### Quiz
- `GET /api/quiz/lesson/{lessonId}` - Get quiz for lesson
- `GET /api/quiz/final/{courseId}` - Get final assessment
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/attempts/{courseId}` - Get my attempts

### Live Sessions
- `GET /api/sessions` - Get upcoming sessions
- `GET /api/sessions/course/{courseId}` - Sessions for course
- `POST /api/sessions` - Create session
- `PUT /api/sessions/{id}` - Update session
- `DELETE /api/sessions/{id}` - Delete session

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment & auto-enroll

### Certificate
- `POST /api/certificate/generate/{courseId}` - Generate certificate
- `GET /api/certificate/download/{certificateId}` - Download PDF
- `GET /api/certificate/my` - List my certificates

### User Management (Admin)
- `GET /api/users` - List all users (paginated)
- `PUT /api/users/{id}/role` - Update user role

### Dashboard
- `GET /api/dashboard` - Get role-specific dashboard data

## Installation & Setup

### Prerequisites
- Java 17 or higher
- Maven 3.8+
- PostgreSQL 12+ (for production)
- Google OAuth2 credentials
- Razorpay account

### Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd lms-project/backend
```

2. Install dependencies:
```bash
mvn clean install
```

3. Set up environment variables (optional for dev, uses defaults):
```bash
export GOOGLE_CLIENT_ID=your-client-id
export GOOGLE_CLIENT_SECRET=your-client-secret
export RAZORPAY_KEY_ID=your-key-id
export RAZORPAY_KEY_SECRET=your-key-secret
export JWT_SECRET=your-jwt-secret-min-256-bits
```

4. Run the application:
```bash
mvn spring-boot:run
```

Application starts at `http://localhost:8080`

H2 Console available at `http://localhost:8080/h2-console`

### Production Setup

1. Create `application-prod.yml` or use environment variables:

```bash
export SPRING_PROFILES_ACTIVE=prod
export DB_HOST=your-db-host
export DB_NAME=lmsdb
export DB_USERNAME=postgres
export DB_PASSWORD=your-password
export GOOGLE_CLIENT_ID=your-client-id
export GOOGLE_CLIENT_SECRET=your-client-secret
export RAZORPAY_KEY_ID=your-key-id
export RAZORPAY_KEY_SECRET=your-key-secret
export JWT_SECRET=your-long-secret-key
```

2. Build and run:
```bash
mvn clean package
java -jar target/lms-backend-1.0.0.jar
```

## Database Schema

The application uses Hibernate with DDL auto-update (dev) or validate (prod).

Key tables:
- `users` - User accounts with roles
- `courses` - Course metadata
- `lessons` - Course lessons
- `enrollments` - Student course enrollments
- `lesson_progress` - Lesson completion tracking
- `quizzes` - Course and lesson quizzes
- `questions` - Quiz questions
- `quiz_attempts` - Student quiz submissions
- `live_sessions` - Scheduled live sessions
- `payments` - Payment records
- `certificates` - Issued certificates

## Security Features

- CORS enabled for `http://localhost:3000` and `http://localhost:3001`
- JWT token expiration: 24 hours (configurable)
- Password encoding with BCrypt
- OAuth2 flow with Google
- Signature verification for Razorpay payments
- Role-based authorization on all protected endpoints

## Sample Data

On first run, `data.sql` populates:
- 1 admin user
- 2 instructor users
- 2 student users
- 3 sample courses with lessons
- 3 quizzes with questions
- Sample enrollments and live sessions
- Sample payments

## Configuration Files

### application.yml
Development configuration using H2 in-memory database.

### application-prod.yml
Production configuration using PostgreSQL.

### pom.xml
Maven build configuration with all dependencies.

## Testing

The application includes sample data for quick testing. Test users:

**Admin**: `admin@lms.com`
**Instructor**: `john@lms.com`, `sarah@lms.com`
**Student**: `alice@lms.com`, `bob@lms.com`

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200 OK` - Successful GET/PUT
- `201 Created` - Successful POST
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Logging

Configured via `application.yml`:
- Development: DEBUG level
- Production: INFO level

## Future Enhancements

- Video streaming integration
- Real-time notifications
- Discussion forums
- Assignment submissions
- Student progress reports
- Email notifications
- Mobile app backend
- Webhook support

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact the development team.

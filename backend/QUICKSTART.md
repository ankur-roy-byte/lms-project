# LMS Backend - Quick Start Guide

## Prerequisites

- Java 17 JDK
- Maven 3.8+
- PostgreSQL 12+ (for production)

## Development Setup (5 minutes)

### 1. Navigate to Project
```bash
cd lms-project/backend
```

### 2. Build the Project
```bash
mvn clean install
```

### 3. Run the Application
```bash
mvn spring-boot:run
```

Application will start at `http://localhost:8080`

### 4. Verify It's Running
```bash
curl http://localhost:8080/api/courses
```

You should get a JSON response with published courses.

### 5. Access H2 Console (Development)
Visit: `http://localhost:8080/h2-console`

- JDBC URL: `jdbc:h2:mem:lmsdb`
- User: `sa`
- Password: (leave empty)

## Testing the API

### 1. Get Sample Course
```bash
curl http://localhost:8080/api/courses
```

### 2. Login with Google (requires Google OAuth2 setup)
```bash
curl -X POST http://localhost:8080/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"tokenId":"your-google-token-id"}'
```

### 3. Get Current User (requires JWT token)
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8080/api/courses/1
```

### 4. Enroll in Course
```bash
curl -X POST http://localhost:8080/api/enroll \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"courseId":1}'
```

## Sample Data

Pre-populated users in database:
- **Admin**: admin@lms.com (use Google OAuth2)
- **Instructor**: john@lms.com, sarah@lms.com
- **Student**: alice@lms.com, bob@lms.com

Sample courses:
1. Introduction to Java ($49.99)
2. Web Development with Spring Boot ($59.99)
3. Advanced Python ($69.99)

## Project Structure

```
src/main/java/com/lms/
├── config/        - Security, CORS, Razorpay
├── auth/          - Authentication, JWT
├── user/          - User management
├── course/        - Course and lessons
├── enrollment/    - Enrollment tracking
├── quiz/          - Quizzes and assessments
├── session/       - Live sessions
├── payment/       - Payment processing
├── certificate/   - Certificate generation
└── dashboard/     - Analytics
```

## API Documentation

### Public Endpoints (No Auth Required)
- `GET /api/courses` - List courses
- `GET /api/courses/{id}` - Get course details
- `POST /api/auth/google` - Login

### Protected Endpoints (Requires JWT Token)

#### Courses
- `POST /api/courses` - Create (INSTRUCTOR)
- `PUT /api/courses/{id}` - Update (INSTRUCTOR)
- `DELETE /api/courses/{id}` - Delete
- `POST /api/courses/{id}/lessons` - Add lesson

#### Enrollment
- `POST /api/enroll` - Enroll in course
- `GET /api/enrollments` - My enrollments
- `POST /api/progress` - Mark lesson done
- `GET /api/progress/{courseId}` - Progress

#### Quiz
- `GET /api/quiz/lesson/{id}` - Get quiz
- `POST /api/quiz/submit` - Submit answers
- `GET /api/quiz/attempts/{courseId}` - My attempts

#### Sessions
- `GET /api/sessions` - Upcoming sessions
- `POST /api/sessions` - Create (INSTRUCTOR)
- `DELETE /api/sessions/{id}` - Cancel

#### Payment
- `POST /api/payment/create-order` - Create order
- `POST /api/payment/verify` - Verify payment

#### Certificates
- `POST /api/certificate/generate/{courseId}` - Generate
- `GET /api/certificate/download/{id}` - Download
- `GET /api/certificate/my` - My certs

#### Users (ADMIN)
- `GET /api/users` - All users
- `PUT /api/users/{id}/role` - Update role

#### Dashboard
- `GET /api/dashboard` - Analytics

## Configuration Files

### application.yml (Development - H2)
- Database: H2 in-memory
- DDL: Auto-update
- Profiles: dev (default)

### application-prod.yml (Production - PostgreSQL)
- Database: PostgreSQL
- DDL: Validate
- Profiles: prod

## Environment Variables

### Development (Optional)
```bash
export GOOGLE_CLIENT_ID=your-client-id
export GOOGLE_CLIENT_SECRET=your-client-secret
export JWT_SECRET=your-secret-min-256-bits
export RAZORPAY_KEY_ID=your-razorpay-key
export RAZORPAY_KEY_SECRET=your-secret
```

### Production (Required)
```bash
export SPRING_PROFILES_ACTIVE=prod
export DB_HOST=localhost
export DB_NAME=lmsdb
export DB_USERNAME=postgres
export DB_PASSWORD=password
export GOOGLE_CLIENT_ID=your-client-id
export GOOGLE_CLIENT_SECRET=your-client-secret
export JWT_SECRET=your-secret-min-256-bits
export RAZORPAY_KEY_ID=your-razorpay-key
export RAZORPAY_KEY_SECRET=your-secret
```

## Production Setup

### 1. Create PostgreSQL Database
```bash
createdb lmsdb
```

### 2. Build JAR
```bash
mvn clean package
```

### 3. Run with PostgreSQL
```bash
export SPRING_PROFILES_ACTIVE=prod
export DB_HOST=your-db-host
export DB_USERNAME=postgres
export DB_PASSWORD=your-password
export GOOGLE_CLIENT_ID=your-id
export GOOGLE_CLIENT_SECRET=your-secret
export JWT_SECRET=your-long-secret
export RAZORPAY_KEY_ID=your-key
export RAZORPAY_KEY_SECRET=your-secret

java -jar target/lms-backend-1.0.0.jar
```

## Troubleshooting

### Port 8080 Already in Use
```bash
# Change port in application.yml
server:
  port: 8081
```

### H2 Console Not Accessible
- Verify `spring.h2.console.enabled: true` in application.yml
- Clear browser cache
- Try in incognito mode

### Database Connection Failed
- Check PostgreSQL is running
- Verify credentials in environment variables
- Check database name exists

### OAuth2 Login Failing
- Verify GOOGLE_CLIENT_ID and CLIENT_SECRET
- Check redirect URI configuration in Google Console
- Ensure redirect URI matches: `http://localhost:8080/login/oauth2/code/google`

### Razorpay Integration Failing
- Verify RAZORPAY_KEY_ID and KEY_SECRET
- Check Razorpay account is active
- Ensure test vs. production keys match environment

## Common Tasks

### View All Users
```bash
SELECT * FROM users;
```

### View Enrollments
```bash
SELECT * FROM enrollments;
```

### Check Quiz Scores
```bash
SELECT * FROM quiz_attempts;
```

### View Payments
```bash
SELECT * FROM payments WHERE status = 'PAID';
```

## Performance Tips

### Development
- Use H2 in-memory for fast startup
- Enable SQL logging: `spring.jpa.show-sql: true`

### Production
- Enable GZIP compression
- Configure connection pooling
- Use read replicas for queries
- Cache frequently accessed data
- Monitor with application monitoring tools

## Next Steps

1. Configure Google OAuth2 credentials
2. Set up Razorpay account
3. Create front-end client
4. Test API endpoints
5. Deploy to cloud (AWS, Heroku, DigitalOcean)
6. Set up CI/CD pipeline
7. Configure monitoring and logging
8. Implement additional features

## Support Resources

- README.md - Comprehensive documentation
- PROJECT_SUMMARY.md - Complete file listing
- pom.xml - All dependencies
- application.yml - Configuration reference

## Key Features

✓ Google OAuth2 Login
✓ JWT Authentication
✓ Role-Based Access Control
✓ Course Management
✓ Student Enrollment
✓ Quiz & Assessment
✓ Payment Processing (Razorpay)
✓ Certificate Generation
✓ Live Session Scheduling
✓ Progress Tracking
✓ Analytics Dashboard

---

You now have a fully functional LMS backend!

Happy coding!

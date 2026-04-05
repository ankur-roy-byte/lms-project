# EduLearn - Learning Management System Frontend

A modern, production-ready Learning Management System (LMS) frontend built with React 18, Tailwind CSS, and Vite.

## Features

### Student Features
- Browse and enroll in courses
- Watch video lessons with progress tracking
- Complete quizzes with instant feedback
- Earn certificates upon course completion
- Participate in live instructor sessions
- Track learning progress with visual indicators

### Instructor Features
- Create and manage courses
- Schedule live learning sessions
- Monitor student enrollments and progress
- View revenue analytics
- Create quizzes and assessments

### Admin Features
- Manage users and roles
- Monitor all courses and enrollments
- Track payments and transactions
- View platform analytics and statistics

## Tech Stack

- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server
- **Google OAuth** - Authentication
- **Razorpay** - Payment processing
- **Lucide Icons** - Icon library
- **date-fns** - Date utilities

## Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:8080`

### Setup

1. Clone the repository:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

5. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── api/               # API integration layer
│   ├── axiosConfig.js
│   ├── authApi.js
│   ├── courseApi.js
│   ├── enrollmentApi.js
│   ├── quizApi.js
│   ├── sessionApi.js
│   ├── paymentApi.js
│   ├── certificateApi.js
│   ├── dashboardApi.js
│   └── adminApi.js
├── components/        # Reusable components
│   ├── Navbar.jsx
│   ├── CourseCard.jsx
│   ├── VideoPlayer.jsx
│   ├── ProgressBar.jsx
│   ├── QuizBox.jsx
│   ├── LiveSessionCard.jsx
│   ├── CertificateCard.jsx
│   ├── StatsCard.jsx
│   ├── Sidebar.jsx
│   ├── Toast.jsx
│   └── ProtectedRoute.jsx
├── context/           # React Context providers
│   └── AuthContext.jsx
├── pages/             # Page components
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── CourseCatalogPage.jsx
│   ├── CourseDetailPage.jsx
│   ├── LiveSessionPage.jsx
│   ├── QuizPage.jsx
│   └── AdminPanelPage.jsx
├── App.jsx            # Main app component
├── main.jsx           # Entry point
├── index.css          # Global styles
└── vite.config.js     # Vite configuration
```

## API Integration

All API calls are centralized in the `src/api/` directory. The application communicates with the backend at `http://localhost:8080/api`.

### Key API Endpoints

- `POST /auth/google` - Google authentication
- `GET /auth/me` - Get current user
- `GET /dashboard` - Get dashboard data
- `GET /courses` - Get all courses
- `GET /courses/{id}` - Get course details
- `POST /enroll` - Enroll in course
- `GET /enrollments` - Get user enrollments
- `POST /progress` - Mark lesson complete
- `GET /quiz/{lessonId}` - Get quiz questions
- `POST /quiz/submit` - Submit quiz answers
- `GET /sessions` - Get live sessions
- `POST /sessions` - Create session (instructor only)
- `POST /payment/create-order` - Create Razorpay order
- `POST /payment/verify` - Verify payment
- `GET /certificate/my` - Get user certificates
- `POST /certificate/generate/{courseId}` - Generate certificate

## Authentication Flow

1. User clicks "Sign in with Google"
2. Google OAuth dialog opens
3. Backend validates credential and returns JWT token
4. Token stored in localStorage
5. Subsequent requests include token in Authorization header
6. On token expiration (401), user is redirected to login

## Styling

The application uses Tailwind CSS with a custom color scheme:

- **Primary Color**: Indigo (#4F46E5)
- **Secondary Color**: Purple (#8B5CF6)
- **Accent**: Green, Red, Orange for status indicators

### Custom CSS Classes

- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary buttons
- `.btn-outline` - Outline buttons
- `.card` - Card container
- `.input-field` - Form input
- `.spinner` - Loading spinner

## Development

### Running the Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Key Features Implementation

### Authentication
- Managed through AuthContext
- Automatic token refresh and validation
- Protected routes with role-based access control

### Course Management
- Pagination and search filtering
- Category filtering
- Progress tracking for enrolled students
- Video playback with YouTube integration

### Quiz System
- Multiple choice questions
- Instant score calculation
- Pass/fail determination
- Certificate generation on pass

### Payment Integration
- Razorpay integration for paid courses
- Direct enrollment for free courses
- Order verification and completion

### Real-time Features
- Live session countdown timers
- Progress bar animations
- Toast notifications for user feedback

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- Code splitting with React Router
- Image optimization
- Lazy loading of components
- Efficient API request caching
- Smooth animations with CSS transitions

## Security

- JWT token-based authentication
- HTTPOnly cookie storage (when available)
- CSRF protection via backend
- XSS protection through React
- Secure payment processing with Razorpay

## Troubleshooting

### API Connection Issues
- Ensure backend is running on `http://localhost:8080`
- Check CORS configuration on backend
- Verify API base URL in environment variables

### Google OAuth Issues
- Verify Google Client ID in environment variables
- Check Google OAuth consent screen setup
- Ensure redirect URI is whitelisted

### Payment Issues
- Verify Razorpay Key ID is correct
- Check payment gateway test mode
- Review browser console for errors

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - feel free to use this project

## Support

For issues and feature requests, please contact the development team.

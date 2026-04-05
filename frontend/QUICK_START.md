# EduLearn Frontend - Quick Start Guide

Get the EduLearn LMS frontend running in 5 minutes!

## Prerequisites

- Node.js 16+ installed
- Backend API running on `http://localhost:8080`
- Google Client ID (from Google Cloud Console)
- Razorpay Key ID (from Razorpay Dashboard)

## 1. Installation (2 minutes)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

## 2. Configuration (1 minute)

```bash
# Create environment file
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
REACT_APP_RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

## 3. Start Development Server (30 seconds)

```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 4. Test the Application (1.5 minutes)

### Test Login
1. Click "Sign in with Google"
2. Select your Google account
3. You should be redirected to dashboard

### Test Student Features
1. Go to "Courses"
2. Browse available courses
3. Click a course to view details
4. Enroll in a free course
5. Watch video lessons
6. Mark lessons as complete
7. Take quiz
8. View certificate

### Test Instructor Features
1. Switch role to Instructor (ask admin)
2. View course statistics
3. Schedule a live session

### Test Admin Features
1. Switch role to Admin (ask admin)
2. Manage users, courses, and payments

## Project Structure

```
frontend/
├── src/
│   ├── api/              # API calls to backend
│   ├── components/       # Reusable UI components
│   ├── context/          # React Context (auth)
│   ├── pages/            # Full page components
│   ├── App.jsx           # Main app
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static files
├── package.json          # Dependencies
├── vite.config.js        # Vite config
├── tailwind.config.js    # Tailwind config
└── index.html            # HTML template
```

## Key Files

| File | Purpose |
|------|---------|
| `src/context/AuthContext.jsx` | User authentication state |
| `src/api/` | API integration modules |
| `src/components/` | Reusable UI components |
| `src/pages/` | Full page views |
| `src/App.jsx` | Router setup |

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Using Google OAuth

### Get Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable Google+ API
4. Create OAuth credentials (Web)
5. Add `http://localhost:3000` to authorized URIs
6. Copy Client ID to `.env`

## Using Razorpay

### Get Razorpay Key

1. Sign up at [Razorpay](https://razorpay.com)
2. Go to Settings → API Keys
3. Copy Key ID (test mode)
4. Add to `.env`

## Test Razorpay Payment

Use test card: `4111 1111 1111 1111`
- Any future expiry date
- Any 3-digit CVV
- Any name

## API Base URL

The frontend connects to backend at:
```
http://localhost:8080/api
```

Make sure your backend is running before starting the frontend.

## Troubleshooting

### Port 3000 Already in Use

```bash
npm run dev -- --port 3001
```

### Dependencies Not Installing

```bash
rm -rf node_modules package-lock.json
npm install
```

### API Connection Error

1. Check backend is running on port 8080
2. Check `REACT_APP_API_BASE_URL` in `.env`
3. Check browser console for errors

### Google OAuth Not Working

1. Verify Google Client ID in `.env`
2. Check authorized URIs in Google Console
3. Clear browser cookies/cache

## Project Statistics

- **React Version**: 18
- **Build Tool**: Vite
- **CSS Framework**: Tailwind
- **Pages**: 7
- **Components**: 14
- **API Modules**: 9

## Features

### Student
- Browse courses
- Watch videos
- Track progress
- Take quizzes
- Get certificates
- Join live sessions

### Instructor
- Create courses
- Schedule sessions
- View analytics
- Manage students

### Admin
- Manage users
- Manage courses
- Monitor payments
- View statistics

## Deployment

### Build for Production

```bash
npm run build
```

Creates optimized files in `dist/` directory.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag dist/ to Netlify
```

## Support Files

- `README.md` - Full documentation
- `SETUP_GUIDE.md` - Detailed setup instructions
- `API_DOCUMENTATION.md` - API endpoints reference
- `PROJECT_CHECKLIST.md` - Complete project checklist

## Next Steps

1. Read `SETUP_GUIDE.md` for detailed configuration
2. Check `API_DOCUMENTATION.md` to understand API
3. Review `PROJECT_CHECKLIST.md` for features
4. Customize colors in `tailwind.config.js`
5. Deploy to production

## Quick Links

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Vite](https://vitejs.dev)
- [Axios](https://axios-http.com)

## Questions?

Refer to the detailed documentation files included in the project.

---

**Status**: Ready for Development
**Last Updated**: 2024-01-05

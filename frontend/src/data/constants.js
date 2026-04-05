// ============================================================
// ZenVedFoundation LMS — Data Constants
// Source: ZenVedFoundation_LMS.html reference design
// ============================================================

// ---- BRANDING ----
export const BRAND = {
  name: 'ZenVedFoundation',
  shortName: 'ZenVed',
  highlight: 'Foundation',
  tagline: 'AI & Python for Future Engineers',
  logo: '🎓',
};

// ---- SAMPLE USER (for dev/demo) ----
export const DEMO_USER = {
  name: 'Arjun Kumar',
  shortName: 'Arjun K.',
  initials: 'AK',
  email: 'arjun@zenved.com',
  role: 'STUDENT',
  avatarUrl: null,
};

// ---- DASHBOARD STATS ----
export const DASHBOARD_STATS = {
  modulesCompleted: 2,
  totalModules: 6,
  lessonsCompleted: 8,
  quizzesPassed: 3,
  daysStreak: 12,
  overallProgress: 38,
};

// ---- COURSE DATA ----
export const COURSE = {
  id: 'ai-python-engineers',
  title: 'AI & Python for Engineers',
  fullTitle: 'AI & Python for Future Engineers',
  description: '6 Modules · 24 Lessons · 18 hours of content',
  totalModules: 6,
  totalLessons: 24,
  totalHours: 18,
  price: 4999,
  category: 'Programming',
  instructor: 'ZenVed Faculty',
};

// ---- MODULES & LESSONS ----
export const MODULES = [
  {
    id: 1,
    number: 1,
    title: 'Python Foundations',
    fullTitle: 'Module 1 — Python Foundations',
    lessonCount: 5,
    status: 'completed', // completed | in_progress | locked
    progress: 100,
    lessons: [
      { id: 101, title: 'Introduction to Python', duration: 30, status: 'completed' },
      { id: 102, title: 'Variables & Data Types', duration: 25, status: 'completed' },
      { id: 103, title: 'Control Flow & Loops', duration: 35, status: 'completed' },
      { id: 104, title: 'Functions & Scope', duration: 40, status: 'completed' },
      { id: 105, title: 'Error Handling', duration: 20, status: 'completed' },
    ],
  },
  {
    id: 2,
    number: 2,
    title: 'Data & Libraries',
    fullTitle: 'Module 2 — Data & Libraries',
    lessonCount: 4,
    status: 'completed',
    progress: 100,
    lessons: [
      { id: 201, title: 'Lists, Tuples & Dictionaries', duration: 35, status: 'completed' },
      { id: 202, title: 'File I/O', duration: 25, status: 'completed' },
      { id: 203, title: 'NumPy Basics', duration: 40, status: 'completed' },
      { id: 204, title: 'Python Functions Deep Dive', duration: 45, status: 'completed' },
    ],
  },
  {
    id: 3,
    number: 3,
    title: 'Intro to AI & ML',
    fullTitle: 'Module 3 — Intro to AI & ML',
    lessonCount: 4,
    status: 'in_progress',
    progress: 38,
    lessons: [
      { id: 301, title: 'What is Artificial Intelligence?', duration: 20, status: 'completed', youtubeUrl: 'https://youtube.com/watch?v=example1' },
      { id: 302, title: 'Types of Machine Learning', duration: 22, status: 'current', youtubeUrl: 'https://youtube.com/watch?v=example2' },
      { id: 303, title: 'How Models Learn', duration: 18, status: 'locked' },
      { id: 304, title: 'Real-World AI Examples', duration: 15, status: 'locked' },
    ],
  },
  {
    id: 4,
    number: 4,
    title: 'Machine Learning',
    fullTitle: 'Module 4 — Machine Learning',
    lessonCount: 4,
    status: 'locked',
    progress: 0,
    lessons: [],
  },
  {
    id: 5,
    number: 5,
    title: 'Hands-On Projects',
    fullTitle: 'Module 5 — Hands-On Projects',
    lessonCount: 4,
    status: 'locked',
    progress: 0,
    lessons: [],
  },
  {
    id: 6,
    number: 6,
    title: 'Career Launchpad',
    fullTitle: 'Module 6 — Career Launchpad',
    lessonCount: 3,
    status: 'locked',
    progress: 0,
    lessons: [],
  },
];

// ---- CURRENT LESSON (continue where you left off) ----
export const CURRENT_LESSON = {
  moduleNumber: 3,
  moduleTitle: 'Intro to AI & ML',
  lessonNumber: 2,
  lessonTitle: 'Types of Machine Learning',
  duration: 22,
  youtubeUrl: 'https://youtube.com/watch?v=example2',
  resources: [
    { type: 'pdf', icon: '📄', label: 'Lesson Notes — Types of ML.pdf' },
    { type: 'code', icon: '💻', label: 'Starter Code — ml_types.py' },
    { type: 'link', icon: '🔗', label: 'Further Reading: Scikit-learn Docs' },
  ],
};

// ---- RECENT ACTIVITY ----
export const RECENT_ACTIVITY = [
  {
    id: 1,
    type: 'lesson_complete',
    icon: '✓',
    iconType: 'done',
    title: 'Completed: Python Functions Deep Dive',
    subtitle: 'Yesterday · Module 2',
    badge: 'Done',
    badgeType: 'done',
  },
  {
    id: 2,
    type: 'quiz_passed',
    icon: '✓',
    iconType: 'done',
    title: 'Quiz Passed: Python Basics Quiz',
    subtitle: '2 days ago · Score: 8/10',
    badge: '88%',
    badgeType: 'done',
  },
  {
    id: 3,
    type: 'assignment_pending',
    icon: '⏳',
    iconType: 'pending',
    title: 'Assignment: Build a Calculator in Python',
    subtitle: 'Due: Tomorrow',
    badge: 'Pending',
    badgeType: 'pending',
  },
];

// ---- QUIZ DATA ----
export const QUIZ = {
  id: 'module-3-quiz',
  title: 'Module 3 Quiz',
  subtitle: 'Intro to AI & ML · 5 questions',
  totalQuestions: 5,
  currentQuestion: 3,
  passingScore: 70,
  questions: [
    {
      id: 1,
      text: 'What is the primary goal of Artificial Intelligence?',
      options: ['Data storage', 'Simulating human intelligence', 'Web development', 'Database management'],
      correctOption: 1,
    },
    {
      id: 2,
      text: 'Which of the following is NOT a type of machine learning?',
      options: ['Supervised Learning', 'Unsupervised Learning', 'Compiled Learning', 'Reinforcement Learning'],
      correctOption: 2,
    },
    {
      id: 3,
      text: 'Which type of machine learning uses labelled data to train a model?',
      options: ['Unsupervised Learning', 'Reinforcement Learning', 'Supervised Learning', 'Deep Learning'],
      correctOption: 2,
    },
    {
      id: 4,
      text: 'What does ML stand for?',
      options: ['Meta Language', 'Machine Learning', 'Markup Logic', 'Module Library'],
      correctOption: 1,
    },
    {
      id: 5,
      text: 'Which library is commonly used for ML in Python?',
      options: ['React', 'Django', 'Scikit-learn', 'Flask'],
      correctOption: 2,
    },
  ],
};

// ---- CERTIFICATE ----
export const CERTIFICATE = {
  studentName: 'Arjun Kumar',
  courseName: 'AI & Python for Future Engineers',
  issuedDate: 'July 1, 2026',
  duration: '6 Weeks',
  score: '92%',
  certificateNumber: 'ZVF-2026-0712-AK',
};

// ---- NAVIGATION ITEMS ----
export const NAV_ITEMS = {
  learn: [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { id: 'courses', label: 'My Course', icon: '📚', path: '/courses' },
    { id: 'player', label: 'Continue Lesson', icon: '▶', path: '/lesson' },
    { id: 'quiz', label: 'Quiz', icon: '✏️', path: '/quiz' },
  ],
  achievements: [
    { id: 'cert', label: 'Certificate', icon: '🏆', path: '/certificate' },
  ],
};

// ---- THEME COLORS (from ZenVed HTML) ----
export const THEME = {
  bgPrimary: '#0B0F1A',
  bgSecondary: '#0F1520',
  bgSidebar: '#0D1220',
  accent: '#F59E0B',     // amber/gold
  accentHover: '#D97706',
  success: '#4ADE80',
  textPrimary: '#E8EDF5',
  textSecondary: 'rgba(232, 237, 245, 0.5)',
  textMuted: 'rgba(232, 237, 245, 0.35)',
  border: 'rgba(255, 255, 255, 0.07)',
  cardBg: 'rgba(255, 255, 255, 0.04)',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
};

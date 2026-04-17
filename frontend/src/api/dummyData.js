// Rich realistic demo data for the AI Readiness Program LMS.
// Every API call falls back to this when the backend is unreachable,
// so every page looks populated with believable content.

const now = new Date();
const days = (n) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000).toISOString();
const ago = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString();

// ---- USERS ----
export const DUMMY_USERS = [
  { id: 'u1', name: 'Ankur Roy', email: 'admin@zenved.com', role: 'ADMIN', createdAt: ago(180), profilePicture: null },
  { id: 'u2', name: 'Dr. Meera Kapoor', email: 'meera@zenved.com', role: 'INSTRUCTOR', createdAt: ago(160), profilePicture: null },
  { id: 'u3', name: 'Arjun Menon', email: 'arjun@zenved.com', role: 'INSTRUCTOR', createdAt: ago(150), profilePicture: null },
  { id: 'u4', name: 'Priya Sharma', email: 'priya@student.in', role: 'STUDENT', createdAt: ago(95), profilePicture: null },
  { id: 'u5', name: 'Rohit Verma', email: 'rohit@student.in', role: 'STUDENT', createdAt: ago(87), profilePicture: null },
  { id: 'u6', name: 'Ananya Iyer', email: 'ananya@student.in', role: 'STUDENT', createdAt: ago(80), profilePicture: null },
  { id: 'u7', name: 'Kabir Singh', email: 'kabir@student.in', role: 'STUDENT', createdAt: ago(70), profilePicture: null },
  { id: 'u8', name: 'Ishita Reddy', email: 'ishita@student.in', role: 'STUDENT', createdAt: ago(65), profilePicture: null },
  { id: 'u9', name: 'Yash Patel', email: 'yash@student.in', role: 'STUDENT', createdAt: ago(55), profilePicture: null },
  { id: 'u10', name: 'Neha Gupta', email: 'neha@student.in', role: 'STUDENT', createdAt: ago(45), profilePicture: null },
  { id: 'u11', name: 'Vikram Rao', email: 'vikram@student.in', role: 'STUDENT', createdAt: ago(40), profilePicture: null },
  { id: 'u12', name: 'Simran Kaur', email: 'simran@student.in', role: 'STUDENT', createdAt: ago(30), profilePicture: null },
  { id: 'u13', name: 'Aditya Nair', email: 'aditya@student.in', role: 'STUDENT', createdAt: ago(25), profilePicture: null },
  { id: 'u14', name: 'Riya Das', email: 'riya@student.in', role: 'STUDENT', createdAt: ago(18), profilePicture: null },
  { id: 'u15', name: 'Karan Malhotra', email: 'karan@student.in', role: 'STUDENT', createdAt: ago(10), profilePicture: null },
];

// ---- COURSES ----
export const DUMMY_COURSES = [
  {
    id: 'c1',
    title: 'AI Readiness Program — Semester Zero',
    description: 'The complete 5-phase bridge program for pre-UG students. From zero AI literacy to a public portfolio of real projects built with Claude, Gemini, Cursor & Google AI Studio.',
    price: 0,
    category: 'AI & Productivity',
    instructorName: 'Dr. Meera Kapoor',
    instructorId: 'u2',
    enrollmentCount: 487,
    rating: 4.9,
    totalModules: 5,
    totalLessons: 10,
    totalHours: 20,
    isPublished: true,
    thumbnail: null,
    createdAt: ago(120),
  },
  {
    id: 'c2',
    title: 'Deep Research with AI Tools',
    description: 'Master Semantic Scholar, Elicit, Connected Papers and Zotero. Build research briefs in hours, not days — with verified citations every time.',
    price: 1499,
    category: 'Research',
    instructorName: 'Dr. Meera Kapoor',
    instructorId: 'u2',
    enrollmentCount: 212,
    rating: 4.8,
    totalModules: 3,
    totalLessons: 6,
    totalHours: 12,
    isPublished: true,
    thumbnail: null,
    createdAt: ago(75),
  },
  {
    id: 'c3',
    title: 'Second Brain — Notion + Obsidian PARA',
    description: 'A knowledge architecture you will actually maintain for four years. Atomic notes, concept maps, and NotebookLM-powered querying of your own mind.',
    price: 999,
    category: 'Knowledge Management',
    instructorName: 'Arjun Menon',
    instructorId: 'u3',
    enrollmentCount: 354,
    rating: 4.7,
    totalModules: 2,
    totalLessons: 5,
    totalHours: 10,
    isPublished: true,
    thumbnail: null,
    createdAt: ago(60),
  },
  {
    id: 'c4',
    title: 'Build with AI — Cursor, Kiro & Gemini API',
    description: 'Ship real software without a CS degree. Cursor IDE, .cursorrules, Gemini API chatbots, and a RAG pipeline trained on your own notes.',
    price: 2499,
    category: 'Building',
    instructorName: 'Arjun Menon',
    instructorId: 'u3',
    enrollmentCount: 178,
    rating: 4.9,
    totalModules: 2,
    totalLessons: 4,
    totalHours: 8,
    isPublished: true,
    thumbnail: null,
    createdAt: ago(40),
  },
  {
    id: 'c5',
    title: 'Learning in Public — Portfolio & Identity',
    description: 'Turn every project into a compounding public asset. GitHub profile READMEs, personal sites on v0.dev, and LinkedIn posts that actually get noticed.',
    price: 799,
    category: 'Career',
    instructorName: 'Dr. Meera Kapoor',
    instructorId: 'u2',
    enrollmentCount: 298,
    rating: 4.8,
    totalModules: 1,
    totalLessons: 3,
    totalHours: 6,
    isPublished: true,
    thumbnail: null,
    createdAt: ago(30),
  },
  {
    id: 'c6',
    title: 'Agentic Workflows for Student Life',
    description: 'Zapier, n8n and MCP — design multi-step agents that run your week so your brain is free for what actually matters.',
    price: 1299,
    category: 'AI & Productivity',
    instructorName: 'Arjun Menon',
    instructorId: 'u3',
    enrollmentCount: 141,
    rating: 4.6,
    totalModules: 2,
    totalLessons: 4,
    totalHours: 8,
    isPublished: false,
    thumbnail: null,
    createdAt: ago(12),
  },
];

// ---- LESSONS (per course) ----
export const DUMMY_LESSONS = {
  c1: [
    { id: 'l1', title: 'L1 — The AI-Native Mindset & Your First Workspace', description: 'From search-engine user to operator — context windows, tokens, RCFC prompting and 3 Claude Projects.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 120, quizId: 'q1', order: 1 },
    { id: 'l2', title: 'L2 — Connecting Your Tools: MCP, APIs & Agent Plumbing', description: 'Make your AI workspace actually do things — Google Calendar via MCP + one working Zap.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 120, quizId: 'q2', order: 2 },
    { id: 'l3', title: 'L3 — Designing Agentic Workflows for Student Life', description: 'Map your week in Excalidraw. Build a morning-briefing agent that runs on a real schedule.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 120, quizId: 'q3', order: 3 },
    { id: 'l4', title: 'L4 — Building Your Second Brain (UG Edition)', description: 'PARA in Notion or Obsidian. Reading log with AI summaries. A weekly review you will actually keep.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 120, quizId: 'q4', order: 4 },
    { id: 'l5', title: 'L5 — Documenting as You Learn', description: 'Atomic notes, lecture transcription with Otter.ai, concept maps, and querying your notes with NotebookLM.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 120, quizId: 'q5', order: 5 },
    { id: 'l6', title: 'L6 — From Google to Groundtruth: AI-Powered Research', description: 'Semantic Scholar, Elicit, Connected Papers, Zotero. Read a paper in 20 minutes. Ship a verified brief.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 120, quizId: 'q6', order: 6 },
    { id: 'l7', title: 'L7 — Presenting & Archiving Your Research', description: 'Gamma AI decks with the Pyramid Principle. GitHub archives. Your first published post on dev.to.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 120, quizId: 'q7', order: 7 },
    { id: 'l8', title: 'L8 — Cursor, Kiro & Coding with AI as Pair Programmer', description: 'Install Cursor, write a .cursorrules, and ship a working CLI study tracker to GitHub.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 120, quizId: 'q8', order: 8 },
    { id: 'l9', title: 'L9 — Google AI Studio, APIs & Multimodal Prototyping', description: 'Gemini API keys stored safely. Build a RAG chatbot trained on your own notes. Deploy on Replit.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 120, quizId: 'q9', order: 9 },
    { id: 'l10', title: 'L10 — Learning in Public: Portfolio, GitHub & Identity', description: 'GitHub profile README, a personal site on v0.dev, and a LinkedIn post that announces your Semester Zero.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 120, quizId: 'q10', order: 10 },
  ],
  c2: [
    { id: 'l21', title: 'Finding Real Sources: Semantic Scholar & Elicit', description: 'Beyond Wikipedia — primary sources, citation counts, and citation neighbourhoods.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 110, quizId: 'q21', order: 1 },
    { id: 'l22', title: 'Read a Paper in 20 Minutes', description: 'The SQ3R-for-papers method. Abstract, conclusion, figures, Claude synthesis, verify.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 90, quizId: 'q22', order: 2 },
    { id: 'l23', title: 'Zotero: Citation Management that Actually Works', description: 'Browser plugin, APA/IEEE bibliographies, Notion integration.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 80, quizId: 'q23', order: 3 },
  ],
  c3: [
    { id: 'l31', title: 'PARA: The Only Filing System You Need', description: 'Projects, Areas, Resources, Archive — file by where you will use it, not by subject.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 100, quizId: 'q31', order: 1 },
    { id: 'l32', title: 'Atomic Notes — One Idea, One Note', description: 'Claim-format titles. 3-5 sentence bodies. Examples. Cross-links. Writing to learn.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 95, quizId: 'q32', order: 2 },
  ],
  c4: [
    { id: 'l41', title: 'Cursor & the 3-Step Verify Habit', description: 'Read every line. Find EDIT THIS markers. Test with bad input.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 115, quizId: 'q41', order: 1 },
    { id: 'l42', title: 'Gemini API + RAG from Scratch', description: 'API keys in .env, notes as context, your first chatbot deployed on Replit.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 130, quizId: 'q42', order: 2 },
  ],
  c5: [
    { id: 'l51', title: 'Your GitHub Profile is Your New CV', description: 'Profile README, pinned repos, stats cards, and the signals hiring managers read first.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 90, quizId: 'q51', order: 1 },
  ],
  c6: [
    { id: 'l61', title: 'Mapping Your Week', description: 'Red circles vs green circles — what to automate, what needs your brain.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 100, quizId: 'q61', order: 1 },
  ],
};

// ---- ENROLLMENTS (student-scoped view) ----
export const DUMMY_ENROLLMENTS = [
  { id: 'e1', courseId: 'c1', course: null, progressPercentage: 70, completedLessons: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7'], enrolledAt: ago(42) },
  { id: 'e2', courseId: 'c3', course: null, progressPercentage: 100, completedLessons: ['l31', 'l32'], enrolledAt: ago(55) },
  { id: 'e3', courseId: 'c2', course: null, progressPercentage: 33, completedLessons: ['l21'], enrolledAt: ago(9) },
  { id: 'e4', courseId: 'c5', course: null, progressPercentage: 0, completedLessons: [], enrolledAt: ago(2) },
];
// Attach course objects
DUMMY_ENROLLMENTS.forEach((e) => {
  e.course = DUMMY_COURSES.find((c) => c.id === e.courseId);
});

// ---- QUIZZES ----
const sampleQuestions = [
  { id: 1, question: 'What best describes a context window in an LLM?', optionA: 'The model\'s long-term memory across conversations', optionB: 'The set of tokens the model can see and reason over right now', optionC: 'A UI element in Claude.ai', optionD: 'Training data used to fine-tune the model', correctAnswer: 'B', questionNumber: 1 },
  { id: 2, question: 'MCP (Model Context Protocol) is most like…', optionA: 'A programming language', optionB: 'USB for AI — a standard way for models to connect to external tools', optionC: 'A vector database', optionD: 'A model fine-tuning technique', correctAnswer: 'B', questionNumber: 2 },
  { id: 3, question: 'The RCFC prompt framework stands for:', optionA: 'Role, Context, Format, Constraint', optionB: 'Request, Code, Feedback, Commit', optionC: 'Read, Compare, Formulate, Check', optionD: 'Retrieve, Connect, Filter, Cite', correctAnswer: 'A', questionNumber: 3 },
  { id: 4, question: 'Which is the safest place to store an API key?', optionA: 'Directly in your source code', optionB: 'Pasted into a Claude chat for safekeeping', optionC: 'A .env file listed in .gitignore', optionD: 'In the GitHub README', correctAnswer: 'C', questionNumber: 4 },
  { id: 5, question: 'The PARA method files notes by…', optionA: 'Subject', optionB: 'Date', optionC: 'Where you will use them — Projects, Areas, Resources, Archive', optionD: 'Alphabetical order', correctAnswer: 'C', questionNumber: 5 },
];

export const DUMMY_QUIZZES = {};
['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q21', 'q22', 'q23', 'q31', 'q32', 'q41', 'q42', 'q51', 'q61'].forEach((qid, i) => {
  DUMMY_QUIZZES[qid] = {
    id: qid,
    title: `Checkpoint Quiz ${i + 1}`,
    questions: sampleQuestions,
    timeLimit: 600,
    passingScore: 60,
  };
});

// ---- LIVE SESSIONS ----
export const DUMMY_SESSIONS = [
  { id: 's1', title: 'Live Q&A — Prompt Engineering Deep Dive', courseName: 'AI Readiness Program', instructorName: 'Dr. Meera Kapoor', meetingLink: 'https://meet.google.com/abc-defg-hij', scheduledAt: days(1), duration: 90 },
  { id: 's2', title: 'Workshop — Building Your First MCP Connection', courseName: 'AI Readiness Program', instructorName: 'Arjun Menon', meetingLink: 'https://meet.google.com/xyz-uvwx-rst', scheduledAt: days(3), duration: 120 },
  { id: 's3', title: 'Office Hours — Cursor & Gemini API Debugging', courseName: 'Build with AI', instructorName: 'Arjun Menon', meetingLink: 'https://meet.google.com/pqr-stuv-wxy', scheduledAt: days(6), duration: 60 },
  { id: 's4', title: 'Cohort Showcase — Semester Zero Portfolios', courseName: 'Learning in Public', instructorName: 'Dr. Meera Kapoor', meetingLink: 'https://meet.google.com/lmn-opqr-stu', scheduledAt: days(10), duration: 90 },
  { id: 's5', title: 'Past — Intro to PARA & Second Brain', courseName: 'Second Brain', instructorName: 'Arjun Menon', meetingLink: 'https://meet.google.com/old-abcd-efg', scheduledAt: ago(4), duration: 75 },
];

// ---- CERTIFICATES ----
export const DUMMY_CERTIFICATES = [
  { id: 'cert1', studentName: 'Priya Sharma', courseName: 'Second Brain — Notion + Obsidian PARA', issuedDate: ago(12), certificateNumber: 'ZV-2025-0001', score: 92, duration: '10 hours' },
  { id: 'cert2', studentName: 'Priya Sharma', courseName: 'Deep Research with AI Tools', issuedDate: ago(5), certificateNumber: 'ZV-2025-0014', score: 88, duration: '12 hours' },
];

// ---- PAYMENTS ----
export const DUMMY_PAYMENTS = [
  { id: 'p1', orderId: 'order_MN8kA2xP', userName: 'Rohit Verma', courseName: 'Build with AI', amount: 2499, status: 'COMPLETED', createdAt: ago(2) },
  { id: 'p2', orderId: 'order_MN4jK1yQ', userName: 'Ananya Iyer', courseName: 'Deep Research with AI Tools', amount: 1499, status: 'COMPLETED', createdAt: ago(4) },
  { id: 'p3', orderId: 'order_MN2hF0zR', userName: 'Kabir Singh', courseName: 'Second Brain', amount: 999, status: 'COMPLETED', createdAt: ago(6) },
  { id: 'p4', orderId: 'order_MN1gD9aS', userName: 'Ishita Reddy', courseName: 'Agentic Workflows', amount: 1299, status: 'PENDING', createdAt: ago(1) },
  { id: 'p5', orderId: 'order_MM9fC8bT', userName: 'Yash Patel', courseName: 'Learning in Public', amount: 799, status: 'COMPLETED', createdAt: ago(8) },
  { id: 'p6', orderId: 'order_MM7eB7cU', userName: 'Neha Gupta', courseName: 'Build with AI', amount: 2499, status: 'FAILED', createdAt: ago(10) },
  { id: 'p7', orderId: 'order_MM5dA6dV', userName: 'Vikram Rao', courseName: 'Deep Research with AI Tools', amount: 1499, status: 'COMPLETED', createdAt: ago(14) },
  { id: 'p8', orderId: 'order_MM3cZ5eW', userName: 'Simran Kaur', courseName: 'Second Brain', amount: 999, status: 'COMPLETED', createdAt: ago(18) },
];

// ---- DASHBOARD (role-aware) ----
export const getDummyDashboard = (role = 'STUDENT') => {
  if (role === 'ADMIN') {
    return {
      totalUsers: DUMMY_USERS.length,
      totalCourses: DUMMY_COURSES.length,
      totalEnrollments: 1234,
      totalRevenue: 487650,
      modulesCompleted: 0,
      totalModules: 0,
      lessonsCompleted: 0,
      quizzesPassed: 0,
      streak: 0,
      overallProgress: 0,
      upcomingSessions: DUMMY_SESSIONS.slice(0, 3),
      courseCount: DUMMY_COURSES.length,
      studentCount: DUMMY_USERS.filter((u) => u.role === 'STUDENT').length,
      revenue: 487650,
    };
  }
  if (role === 'INSTRUCTOR') {
    return {
      courseCount: 4,
      studentCount: 683,
      revenue: 124500,
      modulesCompleted: 0,
      totalModules: 0,
      lessonsCompleted: 0,
      quizzesPassed: 0,
      streak: 0,
      overallProgress: 0,
      upcomingSessions: DUMMY_SESSIONS.slice(0, 3),
    };
  }
  // STUDENT
  return {
    modulesCompleted: 3,
    totalModules: 5,
    lessonsCompleted: 7,
    quizzesPassed: 6,
    streak: 12,
    overallProgress: 68,
    upcomingSessions: DUMMY_SESSIONS.slice(0, 3),
    courseCount: 4,
    studentCount: 0,
    revenue: 0,
  };
};

// ---- ROLE HELPER ----
export const getCurrentRole = () => {
  try {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    return u?.role || 'STUDENT';
  } catch {
    return 'STUDENT';
  }
};

// ---- FALLBACK HELPER ----
// STATIC MODE: Always returns dummy data immediately — no network calls.
// To re-enable real API calls later, flip STATIC_MODE to false.
// The `realCall` function is preserved for future use but never executed.
const STATIC_MODE = true;

export const withFallback = async (realCall, dummy) => {
  if (STATIC_MODE) {
    // Pure frontend demo — no backend needed.
    return typeof dummy === 'function' ? dummy() : dummy;
  }

  // --- REAL API PATH (disabled while STATIC_MODE = true) ---
  const token = (typeof localStorage !== 'undefined' && localStorage.getItem('authToken')) || '';
  if (token.startsWith('demo-token-')) {
    return typeof dummy === 'function' ? dummy() : dummy;
  }
  try {
    return await realCall();
  } catch (err) {
    console.warn('API fallback → dummy data:', err?.message || err);
    return typeof dummy === 'function' ? dummy() : dummy;
  }
};

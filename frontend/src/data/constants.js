// ============================================================
// ZenVedFoundation LMS — Data Constants
// Source: AI Readiness Program — Facilitator Guide
// ============================================================

// ---- BRANDING ----
export const BRAND = {
  name: 'ZenVedFoundation',
  shortName: 'ZenVed',
  highlight: 'Foundation',
  tagline: 'AI Readiness Program — Class XII to Undergraduate Bridge',
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
  totalModules: 5,
  lessonsCompleted: 5,
  quizzesPassed: 2,
  daysStreak: 12,
  overallProgress: 50,
};

// ---- COURSE DATA ----
export const COURSE = {
  id: 'ai-readiness-program',
  title: 'AI Readiness Program',
  fullTitle: 'AI Readiness Program — Facilitator Guide',
  description: '5 Phases · 10 Lectures · 20 hours of content',
  totalModules: 5,
  totalLessons: 10,
  totalHours: 20,
  price: 0,
  category: 'AI & Productivity',
  instructor: 'ZenVed Faculty',
};

// ---- PROGRAM PHASES (MODULES) & LECTURES (LESSONS) ----
export const MODULES = [
  {
    id: 1,
    number: 1,
    title: 'Ground Zero',
    fullTitle: 'Phase 1 — Ground Zero',
    lessonCount: 3,
    status: 'completed',
    progress: 100,
    color: '#5b9cf6',
    lessons: [
      {
        id: 101,
        title: 'L1 — The AI-Native Mindset & Your First Workspace',
        subtitle: 'From search-engine user to operator — understanding the new stack',
        duration: 120,
        status: 'completed',
        deliverable: '3 Claude Projects with Custom System Prompts',
        topics: ['Context windows', 'Tokens', 'Model comparison', 'RCFC prompt framework', 'System prompts', 'Claude Projects'],
        tools: ['Claude', 'Gemini', 'Perplexity'],
      },
      {
        id: 102,
        title: 'L2 — Connecting Your Tools — MCP, APIs & Agent Plumbing',
        subtitle: 'Making your AI workspace actually do things beyond the chat window',
        duration: 120,
        status: 'completed',
        deliverable: 'One Working MCP Connection + One Working Zap',
        topics: ['MCP (Model Context Protocol)', 'A2A (Agent to Agent)', 'API keys & security', 'No-code automation'],
        tools: ['Claude MCP', 'Google Calendar', 'Zapier', 'Notion'],
      },
      {
        id: 103,
        title: 'L3 — Designing Agentic Workflows for Student Life',
        subtitle: 'Building a system that runs your week so your brain can focus on what matters',
        duration: 120,
        status: 'completed',
        deliverable: 'Workflow Diagram + Working Automation',
        topics: ['Workflow mapping', 'Multi-step agents', 'Morning briefing agent', 'n8n vs Zapier'],
        tools: ['Excalidraw', 'Zapier', 'n8n', 'Claude'],
      },
    ],
  },
  {
    id: 2,
    number: 2,
    title: 'Knowledge Architecture',
    fullTitle: 'Phase 2 — Knowledge Architecture',
    lessonCount: 2,
    status: 'completed',
    progress: 100,
    color: '#a78bfa',
    lessons: [
      {
        id: 201,
        title: 'L4 — Building Your Second Brain — The UG Edition',
        subtitle: 'A knowledge system you\'ll actually maintain for four years',
        duration: 120,
        status: 'completed',
        deliverable: 'PARA Workspace + Reading Log + Weekly Review',
        topics: ['PARA method (Projects, Areas, Resources, Archive)', 'Notion databases', 'AI-powered reading log', 'Weekly review ritual'],
        tools: ['Notion', 'Obsidian', 'Claude', 'Google Calendar'],
      },
      {
        id: 202,
        title: 'L5 — Documenting as You Learn',
        subtitle: 'Atomic notes, lecture transcription, concept maps, and querying your own knowledge with AI',
        duration: 120,
        status: 'completed',
        deliverable: '5 Atomic Notes + NotebookLM Project + Concept Map',
        topics: ['Atomic notes', 'Lecture transcription', 'Concept mapping', 'Grounded AI (NotebookLM)'],
        tools: ['Otter.ai', 'Whisper', 'NotebookLM', 'Excalidraw'],
      },
    ],
  },
  {
    id: 3,
    number: 3,
    title: 'Research & Synthesis',
    fullTitle: 'Phase 3 — Research & Synthesis',
    lessonCount: 2,
    status: 'in_progress',
    progress: 50,
    color: '#4caf7d',
    lessons: [
      {
        id: 301,
        title: 'L6 — From Google to Groundtruth — AI-Powered Research',
        subtitle: 'Academic search, reading papers, verifying sources, and building a research brief',
        duration: 120,
        status: 'completed',
        deliverable: 'Research Brief with 5 Verified Sources + Zotero Library',
        topics: ['Academic search tools', '20-minute paper reading method', 'Citation management', 'Research brief writing', 'AI verification habit'],
        tools: ['Semantic Scholar', 'Elicit', 'Connected Papers', 'Zotero', 'Claude'],
      },
      {
        id: 302,
        title: 'L7 — Presenting & Archiving Your Research',
        subtitle: 'From synthesis to communication — slides, visuals, and archives that outlast the semester',
        duration: 120,
        status: 'current',
        deliverable: 'Gamma Deck + GitHub Archive + Published Post',
        topics: ['Pyramid Principle', 'AI slide generation', 'GitHub archival', 'Learning in public', 'First published post'],
        tools: ['Gamma AI', 'GitHub', 'dev.to', 'Substack', 'Claude'],
      },
    ],
  },
  {
    id: 4,
    number: 4,
    title: 'Building with AI',
    fullTitle: 'Phase 4 — Building with AI',
    lessonCount: 2,
    status: 'locked',
    progress: 0,
    color: '#f0c040',
    lessons: [
      {
        id: 401,
        title: 'L8 — Cursor, Kiro & Coding with AI as Your Pair Programmer',
        subtitle: 'You don\'t need to know everything to build real things',
        duration: 120,
        status: 'locked',
        deliverable: 'Working App on GitHub with README',
        topics: ['Cursor IDE setup', '.cursorrules', '3-step verify habit', 'CLI app building', 'Git workflow'],
        tools: ['Cursor', 'Kiro', 'Replit', 'GitHub', 'Python'],
      },
      {
        id: 402,
        title: 'L9 — Google AI Studio, APIs & Multimodal Prototyping',
        subtitle: 'Going beyond chat — building with models directly, and making your own notes queryable',
        duration: 120,
        status: 'locked',
        deliverable: 'Working Notes Chatbot — Live Link',
        topics: ['Gemini API', 'Multimodal inputs', 'RAG concept', 'Notes chatbot', 'Deployment'],
        tools: ['Google AI Studio', 'Gemini API', 'Cursor', 'Replit', 'Python'],
      },
    ],
  },
  {
    id: 5,
    number: 5,
    title: 'Public Presence',
    fullTitle: 'Phase 5 — Public Presence',
    lessonCount: 1,
    status: 'locked',
    progress: 0,
    color: '#e05a3a',
    lessons: [
      {
        id: 501,
        title: 'L10 — Portfolio, GitHub & Digital Identity',
        subtitle: 'The compounding asset no one tells you to build — your Semester Zero',
        duration: 120,
        status: 'locked',
        deliverable: 'The Semester Zero Portfolio',
        topics: ['GitHub profile README', 'Personal site (v0.dev)', 'LinkedIn post', 'Learning in public', 'Cohort showcase'],
        tools: ['GitHub', 'v0.dev', 'Vercel', 'Framer', 'LinkedIn', 'Claude'],
      },
    ],
  },
];

// ---- CURRENT LESSON (continue where you left off) ----
export const CURRENT_LESSON = {
  moduleNumber: 3,
  moduleTitle: 'Research & Synthesis',
  lessonNumber: 7,
  lessonTitle: 'Presenting & Archiving Your Research',
  duration: 120,
  subtitle: 'From synthesis to communication — slides, visuals, and archives that outlast the semester',
  resources: [
    { type: 'link', icon: '🎨', label: 'Gamma AI — gamma.app' },
    { type: 'link', icon: '📦', label: 'GitHub — github.com' },
    { type: 'link', icon: '✍️', label: 'dev.to — Write your first post' },
    { type: 'pdf', icon: '📄', label: 'Pyramid Principle — One-pager' },
  ],
};

// ---- RECENT ACTIVITY ----
export const RECENT_ACTIVITY = [
  {
    id: 1,
    type: 'lesson_complete',
    icon: '✓',
    iconType: 'done',
    title: 'Completed: L6 — AI-Powered Research',
    subtitle: 'Yesterday · Phase 3',
    badge: 'Done',
    badgeType: 'done',
  },
  {
    id: 2,
    type: 'deliverable_submitted',
    icon: '✓',
    iconType: 'done',
    title: 'Deliverable: Research Brief with 5 Sources',
    subtitle: '2 days ago · Filed in PARA system',
    badge: 'Submitted',
    badgeType: 'done',
  },
  {
    id: 3,
    type: 'assignment_pending',
    icon: '⏳',
    iconType: 'pending',
    title: 'Deliverable: Gamma Deck + GitHub Archive + Published Post',
    subtitle: 'Due: End of Session 7',
    badge: 'Pending',
    badgeType: 'pending',
  },
];

// ---- QUIZ DATA ----
export const QUIZ = {
  id: 'phase-1-quiz',
  title: 'Phase 1 Quiz',
  subtitle: 'Ground Zero — AI Workspace & Workflows · 5 questions',
  totalQuestions: 5,
  currentQuestion: 1,
  passingScore: 70,
  questions: [
    {
      id: 1,
      text: 'What is a "context window" in AI?',
      options: [
        'The browser tab where you use AI',
        'The total information the AI can work with in one conversation',
        'The settings panel of the AI tool',
        'A type of operating system window',
      ],
      correctOption: 1,
    },
    {
      id: 2,
      text: 'What does MCP stand for?',
      options: [
        'Model Control Panel',
        'Multi-Channel Processing',
        'Model Context Protocol',
        'Machine Code Parser',
      ],
      correctOption: 2,
    },
    {
      id: 3,
      text: 'In the RCFC prompt framework, what does the "C" in Context refer to?',
      options: [
        'The AI model\'s capabilities',
        'The coding language to use',
        'The situation and background you give the AI',
        'The character count limit',
      ],
      correctOption: 2,
    },
    {
      id: 4,
      text: 'Why should you NEVER share an API key publicly?',
      options: [
        'It makes your code run slower',
        'It\'s only useful for one request',
        'Others can use your account and it may cost real money',
        'API keys expire after being viewed',
      ],
      correctOption: 2,
    },
    {
      id: 5,
      text: 'What is the main purpose of a system prompt in Claude Projects?',
      options: [
        'To make the chat window look different',
        'To give the AI persistent instructions before any conversation',
        'To reset the AI\'s memory',
        'To connect Claude to the internet',
      ],
      correctOption: 1,
    },
  ],
};

// ---- CERTIFICATE ----
export const CERTIFICATE = {
  studentName: 'Arjun Kumar',
  courseName: 'AI Readiness Program — Semester Zero',
  issuedDate: 'May 15, 2026',
  duration: '5 Weeks · 10 Sessions',
  score: '92%',
  certificateNumber: 'ZVF-2026-AIRP-AK',
};

// ---- NAVIGATION ITEMS ----
export const NAV_ITEMS = {
  learn: [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { id: 'courses', label: 'Program', icon: '📚', path: '/courses' },
    { id: 'player', label: 'Continue Lesson', icon: '▶', path: '/lesson' },
    { id: 'quiz', label: 'Quiz', icon: '✏️', path: '/quiz' },
  ],
  achievements: [
    { id: 'cert', label: 'Certificate', icon: '🏆', path: '/certificate' },
  ],
};

// ---- PROGRAM METADATA ----
export const PROGRAM_INFO = {
  title: 'AI Readiness Program',
  subtitle: 'Facilitator Guide — Complete Scripts',
  audience: 'Class XII to Undergraduate Bridge',
  description: 'A minute-by-minute guide for every lecture. Covers what to say, what to demonstrate, what students do hands-on, and how to handle async and live delivery.',
  stats: {
    lectures: 10,
    hoursPerSession: 2,
    scriptBlocks: '120+',
    handsOnTasks: '30+',
  },
  phases: [
    { number: 1, title: 'Ground Zero', color: '#5b9cf6', lectures: 3, pillar: 'Workspace' },
    { number: 2, title: 'Knowledge Architecture', color: '#a78bfa', lectures: 2, pillar: 'Knowledge Management' },
    { number: 3, title: 'Research & Synthesis', color: '#4caf7d', lectures: 2, pillar: 'Deep Research' },
    { number: 4, title: 'Building with AI', color: '#f0c040', lectures: 2, pillar: 'AI-Assisted Building' },
    { number: 5, title: 'Public Presence', color: '#e05a3a', lectures: 1, pillar: 'Public Portfolio' },
  ],
  toolsUsed: [
    'Claude', 'Gemini', 'Perplexity', 'Zapier', 'n8n', 'Notion', 'Obsidian',
    'NotebookLM', 'Otter.ai', 'Excalidraw', 'Semantic Scholar', 'Elicit',
    'Connected Papers', 'Zotero', 'Gamma AI', 'GitHub', 'Cursor', 'Kiro',
    'Google AI Studio', 'Replit', 'v0.dev', 'Vercel', 'Framer', 'LinkedIn', 'dev.to',
  ],
};

// ---- THEME COLORS ----
export const THEME = {
  bgPrimary: '#0B0F1A',
  bgSecondary: '#0F1520',
  bgSidebar: '#0D1220',
  accent: '#F59E0B',
  accentHover: '#D97706',
  success: '#4ADE80',
  textPrimary: '#E8EDF5',
  textSecondary: 'rgba(232, 237, 245, 0.5)',
  textMuted: 'rgba(232, 237, 245, 0.35)',
  border: 'rgba(255, 255, 255, 0.07)',
  cardBg: 'rgba(255, 255, 255, 0.04)',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  // Phase colors
  phaseBlue: '#5b9cf6',
  phasePurple: '#a78bfa',
  phaseGreen: '#4caf7d',
  phaseAmber: '#f0c040',
  phaseRed: '#e05a3a',
};

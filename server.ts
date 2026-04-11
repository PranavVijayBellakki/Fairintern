import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;

app.use(express.json());

// --- Mock Data ---
const mockInternships = [
  {
    id: "int-001",
    role: "Frontend Engineer Intern (LinkedIn)",
    company: "Google via LinkedIn",
    stipend: "₹45,000/month",
    description: "Join the Google Search frontend team. Work on React components with a dedicated mentor.",
    work_type: "learning",
    tasks: [{ id: "t1", title: "Build a responsive search bar component", type: "link" }],
    posted_at: new Date().toISOString().split('T')[0]
  },
  {
    id: "int-001b",
    role: "Backend Node.js Intern",
    company: "Zomato via Naukri",
    stipend: "₹30,000/month",
    description: "Work with our delivery scheduling team. Strong programming skills required. Fast-paced environment.",
    work_type: "learning",
    tasks: [{ id: "t1", title: "Implement a rate-limiter in Express", type: "link" }],
    posted_at: new Date().toISOString().split('T')[0]
  },
  {
    id: "int-002",
    role: "Marketing Intern",
    company: "GrowthX",
    stipend: "Unpaid",
    description: "Manage all social media accounts, create daily content, and run ad campaigns. Expected 40 hrs/week.",
    work_type: "production",
    tasks: [
      { id: "t1", title: "Submit a 1-month content calendar", type: "file" }
    ],
    posted_at: "2026-03-22"
  },
  {
    id: "int-003",
    role: "Data Science Intern",
    company: "AI Solutions",
    stipend: "₹15,000/month",
    description: "Assist in cleaning datasets and training basic models under senior supervision.",
    work_type: "learning",
    tasks: [
      { id: "t1", title: "Write a Python script to clean a CSV", type: "text" }
    ],
    posted_at: "2026-03-25"
  },
  {
    id: "int-004",
    role: "Graphic Design Intern",
    company: "Creative Agency",
    stipend: "Not listed",
    description: "Design logos and marketing materials for our clients. Must have own Adobe CC subscription.",
    work_type: "production",
    tasks: [
      { id: "t1", title: "Design 3 logo concepts", type: "file" }
    ],
    posted_at: "2026-03-28"
  },
  {
    id: "int-005",
    role: "Software Engineering Intern",
    company: "TechNova",
    stipend: "₹25,000/month",
    description: "Join our core team to develop new features. You will be paired with a mentor.",
    work_type: "learning",
    tasks: [
      { id: "t1", title: "Solve a basic algorithmic problem", type: "text" }
    ],
    posted_at: "2026-04-01"
  },
  {
    id: "int-006",
    role: "Content Writing Intern",
    company: "Blogosphere",
    stipend: "Unpaid",
    description: "Write 5 SEO-optimized articles per week. Great for exposure.",
    work_type: "production",
    tasks: [
      { id: "t1", title: "Submit a 1000-word sample article", type: "text" }
    ],
    posted_at: "2026-04-05"
  }
];

const mockSubmissions = [
  { id: "sub-001", internshipId: "int-001", studentId: "stu-1", status: "reviewed", score: 8, feedback: "Good component structure." },
  { id: "sub-002", internshipId: "int-003", studentId: "stu-1", status: "pending", score: null, feedback: null },
  { id: "sub-003", internshipId: "int-005", studentId: "stu-2", status: "accepted", score: 10, feedback: "Excellent algorithmic approach." },
  { id: "sub-004", internshipId: "int-002", studentId: "stu-3", status: "rejected", score: 4, feedback: "Content calendar lacks detail." },
  { id: "sub-005", internshipId: "int-004", studentId: "stu-1", status: "reviewed", score: 7, feedback: "Creative logos, but missing some brand guidelines." }
];

// --- API Routes ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/internships', (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  res.json(mockInternships.slice(0, limit));
});

app.get('/api/internships/:id', (req, res) => {
  const internship = mockInternships.find(i => i.id === req.params.id);
  if (internship) {
    res.json(internship);
  } else {
    res.status(404).json({ error: 'Internship not found' });
  }
});

app.get('/api/search', (req, res) => {
  // Mock search returning curated India internships
  const limit = parseInt(req.query.limit as string) || 5;
  res.json(mockInternships.slice(0, limit));
});

app.post('/api/internships', (req, res) => {
  const newInternship = {
    id: `int-00${mockInternships.length + 1}`,
    ...req.body,
    posted_at: new Date().toISOString().split('T')[0]
  };
  mockInternships.push(newInternship);
  res.status(201).json(newInternship);
});

app.post('/api/applications/:internshipId', (req, res) => {
  const newSubmission = {
    id: `sub-00${mockSubmissions.length + 1}`,
    internshipId: req.params.internshipId,
    studentId: "stu-current", // Mock current user
    status: "pending",
    score: null,
    feedback: null,
    ...req.body
  };
  mockSubmissions.push(newSubmission);
  res.status(201).json(newSubmission);
});

// --- AI Career Mentor Feedback Service ---
app.post('/api/ai/mentor-feedback', async (req, res) => {
  try {
    const { taskDescription, studentSubmission } = req.body;
    if (!taskDescription || !studentSubmission) {
      return res.status(400).json({ error: 'Task Description and Student Submission are required' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `You are an empathetic, senior-level Tech Lead and Career Mentor. Your job is to give concise, constructive feedback to a student who applied for an internship but was not selected.
    
    Inputs:
    1. Task Description: "${taskDescription}"
    2. Student Submission: "${studentSubmission}"

    Produce only a single raw JSON object (no surrounding text, no code fences) matching this exact schema:
    {
      "openingMessage": "A brief, kind 1-2 sentence opening thanking them for their effort.",
      "strengths": ["1 brief bullet point highlighting something they did well"],
      "actionableFeedback": ["1-2 brief, specific technical or structural bullet points on how to improve the submission"],
      "closingMessage": "A short, encouraging sign-off."
    }

    Rules:
    - Tone: Professional, encouraging, warm and constructive. Never condescending.
    - Brevity: Extremely concise.
    - Specificity: REFERENCE EXACT ELEMENTS (filenames, functions, lines, UI screens) from their submission. Cite them by name.
    - Guardrails: Do NOT provide complete fixes or copy-paste code. Point to directions to explore.
    - Actionable feedback: Prioritize 1-2 impactful improvements (bug, UX, edge case).
    
    Return VALID JSON ONLY.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || '{}');
    res.json(result);
  } catch (error) {
    console.error('Mentor feedback error:', error);
    res.status(500).json({ error: 'Failed to generate mentor feedback' });
  }
});


// --- AI Internship Discovery Agent (New) ---
app.post('/api/ai/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: `You are the "Discovery Agent," a specialized AI assistant designed EXCLUSIVELY to help students find current internships, career opportunities, and job-related advice.

# PRIMARY TASK
Your goal is to fetch current internships from the web and provide detailed, up-to-date information including role names, companies, and application links.

# OPERATIONAL RULES
1. TOPIC RESTRICTION: You answer ONLY questions related to internships, jobs, career advice, resumes, or interview prep.
2. REFUSAL PROTOCOL: If a user asks about general knowledge, coding help (unrelated to careers), history, math, or any non-career topic, you must politely refuse. 
   - Example Refusal: "I am specialized only in internship discovery. Please ask a question related to AI internships or career opportunities."
3. WEB SEARCH: Always prioritize fetching live, current data from the web using search tools to ensure the internships are not expired.
4. FORMATTING: Present internship listings in a clean, bulleted list or table with the following headers: Role, Company, Location (or Remote), and Link.

# TONE & STYLE
- Be professional, encouraging, and concise. 
- Do not use overly technical jargon unless it relates to the job description.`,
        tools: [{ googleSearch: {} }]
      }
    });

    const reply = response.text || "I couldn't find anything right now.";
    res.json({ reply });
  } catch (error: any) {
    console.error('Chat AI error details:', error);
    res.status(500).json({ error: 'Failed to discover internships: ' + (error.message || 'Unknown error') });
  }
});

// --- Auth Routes (Mock) ---
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const token = jwt.sign({ userId: 'user-1', email, role: email.includes('recruiter') ? 'recruiter' : 'student' }, JWT_SECRET);
    res.json({ token, user: { email, role: email.includes('recruiter') ? 'recruiter' : 'student' } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/recruiter-login', (req, res) => {
  const { name, company, phone } = req.body;
  if (name && company && phone) {
    const token = jwt.sign({ userId: 'rec-1', name, company, role: 'recruiter' }, JWT_SECRET);
    res.json({ token, user: { name, company, phone, role: 'recruiter' } });
  } else {
    res.status(400).json({ error: 'Missing parameters' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, role } = req.body;
  const token = jwt.sign({ userId: 'user-new', email, role }, JWT_SECRET);
  res.json({ token, user: { email, role } });
});




async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

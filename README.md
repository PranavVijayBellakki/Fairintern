# FairIntern

FairIntern is a modern, AI-powered internship marketplace focused on evaluating and highlighting internship fairness. It exposes exploitative internships and highlights fair, skill-building opportunities using an AI-driven analysis engine.

## Architecture

- **Frontend:** React 19, React Router, Tailwind CSS, React Three Fiber (for 3D hero elements).
- **Backend:** Node.js/Express with Vite middleware for a seamless full-stack development experience.
- **AI Integration:** Gemini API via \`@google/genai\` SDK for analyzing internship descriptions and calculating fairness scores.
- **Auth:** JWT-based mock authentication with Google OAuth popup simulation. 

## Setup & Running

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Set up environment variables:
   Ensure \`GEMINI_API_KEY\` is set in your environment (or \`.env\` file) for the AI analyzer to work.

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
   The app will be available at \`http://localhost:3000\`.

## API Specifications

### \`GET /api/internships\`
Returns a list of internship objects with fairness metadata.
- **Query Params:** \`limit\` (default: 10)

### \`GET /api/internships/:id\`
Returns full details for a specific internship.

### \`POST /api/internships\`
(Recruiter) Posts a new internship.

### \`POST /api/applications/:internshipId\`
(Student) Submits task data for an application.

### \`POST /api/analyze\`
(AI Microservice) Accepts raw text and returns JSON fairness analysis.
- **Input:** \`{ "text": "Job description..." }\`
- **Output:**
  \`\`\`json
  {
    "stipend": "explicit | missing | unpaid",
    "work_type": "learning | production | unclear",
    "role_clarity": "clear | vague",
    "task_nature": "skill-building | exploitative | unclear",
    "fairness_score": 8,
    "fairness_label": "Fair",
    "flags": ["Clear stipend", "Learning focused"]
  }
  \`\`\`

## Accessibility (WCAG AA) Review

- **Color Contrast:** The custom Tailwind color palette (Teal/Indigo) has been tested to ensure text against background colors meets the >= 4.5:1 contrast ratio required for WCAG AA.
- **Semantic HTML:** Used proper heading hierarchies (\`h1\` to \`h4\`), \`nav\`, \`main\`, and \`footer\` tags.
- **Focus States:** All interactive elements (buttons, links, inputs) have visible \`focus:ring\` states for keyboard navigation.
- **Form Labels:** All inputs use explicit \`<label>\` elements associated via \`htmlFor\`.
- **Aria Attributes:** Modals manage focus and use semantic structure to aid screen readers.

## 5-Items Task Script

A script to programmatically output 5 current internship listings in India is located at \`scripts/find_internships.js\`. Run it using:
\`\`\`bash
node scripts/find_internships.js
\`\`\`

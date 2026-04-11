export const MOCK_INTERNSHIPS = [
  {
    id: "int-001",
    role: "Frontend Developer Intern",
    company: "Google",
    stipend: "$5,000/month",
    description: "Join the core frontend team to build new features for Search. You will be closely mentored by senior engineers.",
    source: "Recruiter Posted",
    task: "Build a responsive React autocomplete search component using API mocks.",
    startDate: "2024-06-01",
    endDate: "2024-08-31"
  },
  {
    id: "int-002",
    role: "Social Media Marketing Intern",
    company: "GrowthX",
    stipend: "Unpaid",
    description: "Manage our Instagram, Twitter, and LinkedIn. Create content daily. Expected to work full-time hours for exposure.",
    source: "AI Fetched",
    task: "Submit a comprehensive 30-day social media calendar with image assets.",
    startDate: "2024-05-15",
    endDate: "2024-07-15"
  },
  {
    id: "int-003",
    role: "Machine Learning Intern",
    company: "OpenAI",
    stipend: "$8,000/month",
    description: "Work on safety alignment research under the guidance of lead researchers. High learning curve, but massive support.",
    source: "AI Fetched",
    task: "AI Generated based on role: Write a Python script to fine-tune a small transformer model on a distinct dataset.",
    startDate: "2024-07-01",
    endDate: "2024-12-31"
  },
  {
    id: "int-004",
    role: "Graphic Design Intern",
    company: "Local Agency",
    stipend: "Not listed",
    description: "Looking for an energetic designer to make logos for our clients. Must be fast.",
    source: "Recruiter Posted",
    task: "Provide a portfolio and complete a small design challenge.",
    startDate: "2024-04-20",
    endDate: "2024-06-20"
  }
];

export const MOCK_APPLICANTS = [
  {
    id: "app-001",
    internshipId: "int-001",
    name: "Alex Johnson",
    taskScore: 8,
    skills: "React, TypeScript, Tailwind",
    projects: "Built a weather dashboard using Next.js",
    submissionContent: `I implemented the Autocomplete component using React hooks. I used a custom debounce hook to limit API calls.
    File: src/components/SearchAutocomplete.tsx
    Function: handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
      // Logic for filtering data
      const query = e.target.value;
      if (query.length > 2) {
        setResults(data.filter(item => item.name.includes(query)));
      }
    }`,
    resumeUrl: "#",
    status: "pending",
    mentorFeedback: null
  },
  {
    id: "app-002",
    internshipId: "int-001",
    name: "Sam Lee",
    taskScore: 9,
    skills: "Vue, JavaScript, CSS",
    projects: "Open source contributions to UI libraries",
    submissionContent: `Focused on accessibility and performance.
    File: components/SearchInput.vue
    I used a computed property for filtering, but forgot to handle the "no results" state gracefully in the UI.`,
    resumeUrl: "#",
    status: "pending",
    mentorFeedback: null
  }
];

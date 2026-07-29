/**
 * This script simulates fetching 5 current internship listings in India.
 * In a real-world scenario, this would scrape a job board or call an external API.
 */

const mockIndiaInternships = [
  {
    role: "Frontend Developer Intern",
    company: "TechCorp India",
    location: "Bangalore, India (Hybrid)",
    stipend: "₹15,000/month",
    description: "Join our core product team to build responsive UI components using React and Tailwind CSS. You will be mentored by senior engineers.",
    work_type: "learning",
    tasks: ["Build a simple React component", "Submit GitHub profile"]
  },
  {
    role: "Social Media Marketing Intern",
    company: "ViralBrands",
    location: "Mumbai, India (Remote)",
    stipend: "Unpaid",
    description: "Manage 5 social media accounts, create daily posts, and run ad campaigns. Must be available 40 hours a week.",
    work_type: "production",
    tasks: ["Create a 1-month content calendar", "Design 3 sample posts"]
  },
  {
    role: "Data Analyst Intern",
    company: "DataSense",
    location: "Gurgaon, India (On-site)",
    stipend: "₹20,000/month",
    description: "Assist in data cleaning and creating dashboards using Python and Tableau. Training provided.",
    work_type: "learning",
    tasks: ["Write a Python script to clean a dataset"]
  },
  {
    role: "Graphic Design Intern",
    company: "Creative Studio",
    location: "Pune, India (Remote)",
    stipend: "Not listed",
    description: "Design logos and brochures for clients. Must have your own Adobe Creative Cloud subscription.",
    work_type: "production",
    tasks: ["Submit portfolio", "Design a sample logo"]
  },
  {
    role: "Backend Engineering Intern",
    company: "CloudScale",
    location: "Hyderabad, India (Hybrid)",
    stipend: "₹25,000/month",
    description: "Work on our Node.js microservices. You will pair program with our backend team to learn best practices.",
    work_type: "learning",
    tasks: ["Solve a basic algorithmic problem in JavaScript"]
  }
];

function findInternships() {
  console.log("Fetching 5 current internship listings in India...\n");

  mockIndiaInternships.forEach((internship, index) => {
    console.log(`[${index + 1}] ${internship.role} at ${internship.company}`);
    console.log(`    Location: ${internship.location}`);
    console.log(`    Stipend: ${internship.stipend}`);
    console.log(`    Type: ${internship.work_type}`);
    console.log(`    Description: ${internship.description}`);
    console.log(`    Tasks: ${internship.tasks.join(', ')}`);
    console.log("--------------------------------------------------");
  });
}

findInternships();

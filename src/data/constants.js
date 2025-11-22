export const ROLES = {
  VISITOR: 'visitor',
  STUDENT: 'student',
  ALUMNI: 'alumni',
  ADMIN: 'admin'
};

export const ALUMNI_DATA = [
  { id: 1, name: "Sarah Jenkins", gradYear: 2019, major: "Computer Science", company: "TechFlow Inc.", role: "Senior Frontend Dev", location: "San Francisco, CA", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=c0aede" },
  { id: 2, name: "Marcus Thorne", gradYear: 2015, major: "Business Admin", company: "Global Finance", role: "Project Manager", location: "New York, NY", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=b6e3f4" },
  { id: 3, name: "Elena Rodriguez", gradYear: 2021, major: "Graphic Design", company: "Freelance", role: "Art Director", location: "Austin, TX", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=ffdfbf" },
  { id: 4, name: "David Chen", gradYear: 2012, major: "Electrical Engineering", company: "Tesla", role: "Lead Engineer", location: "Fremont, CA", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=d1d4f9" },
];

export const INITIAL_USERS = [
  { id: 1, name: "Sarah Jenkins", role: 'alumni', status: 'active', email: 'sarah@test.com', image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", job: "Senior Dev @ TechFlow", location: "San Francisco", openToMentor: true, resources: [] },
  { id: 2, name: "Marcus Thorne", role: 'alumni', status: 'active', email: 'marcus@test.com', image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus", job: "PM @ GlobalFinance", location: "New York", openToMentor: false, resources: [] },
  { id: 3, name: "Rahul Kumar", role: 'student', status: 'active', email: 'rahul@test.com', image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul", techStack: "React, Java", achievements: "Hackathon Winner", experience: "Intern at TechFlow", joinedGroups: [] },
];

export const INITIAL_EVENTS = [
  { id: 1, title: "Class of 2014: 10-Year Reunion", date: "Oct 15, 2024", location: "Main Campus", category: "Reunion", attendees: 142 },
  { id: 2, title: "Tech Networking Night", date: "Nov 02, 2024", location: "Convention Center", category: "Networking", attendees: 85 },
];

export const EVENTS_DATA = INITIAL_EVENTS; // Export alias for compatibility

export const INITIAL_ANNOUNCEMENTS = [
  { id: 1, title: "Campus Renovation Update", date: "2 days ago", content: "The new library wing will be open from next Monday." },
  { id: 2, title: "Alumni Fund Drive", date: "1 week ago", content: "We reached 50% of our goal! Thank you for donating." },
];

export const INITIAL_GROUPS = [
  {
    id: 1, name: "React Ecosystem", tech: "React", members: 450, image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=500&q=60", description: "For Frontend Developers working with React, Next.js, and Remix.",
    jobs: [{ id: 101, title: "Senior React Dev", company: "TechFlow", location: "Remote", postedBy: "Sarah Jenkins" }]
  },
  { id: 2, name: "Python & AI", tech: "Python", members: 320, image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=500&q=60", description: "Data Science, Machine Learning, and Backend development with Python.", jobs: [] },
  { id: 3, name: "Java Enterprise", tech: "Java", members: 120, image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=60", description: "Spring Boot, Microservices, and legacy system modernization.", jobs: [] },
  {
    id: 4, name: "Class of 2020", tech: "General", members: 120, image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80", description: "Official group for the graduating batch of 2020.", jobs: []
  },
];

export const GROUPS_DATA = INITIAL_GROUPS; // Export alias for compatibility

export const MESSAGES_DATA = [
  { id: 1, name: "Sarah Jenkins", lastMessage: "Hey! Are you going to the gala?", time: "2m ago", unread: true, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { id: 2, name: "David Chen", lastMessage: "Thanks for the recommendation!", time: "1h ago", unread: false, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David" },
  { id: 3, name: "Tech Entrepreneurs", lastMessage: "Marcus: New meetup scheduled for Friday!", time: "3h ago", unread: false, image: "https://ui-avatars.com/api/?name=TE&background=random", isGroup: true },
];

export const JOBS_DATA = [
  { id: 1, title: "Marketing Specialist", company: "Alumni Ventures", location: "Remote", type: "Full-time", postedBy: "Jessica M. ('10)" },
  { id: 2, title: "Junior Software Engineer", company: "StartUp One", location: "Seattle, WA", type: "Full-time", postedBy: "Tom H. ('16)" },
];

export const ACTIVITY_LOGS = [
  { id: 1, action: "User Registered", detail: "Rahul Kumar (Student)", time: "10 mins ago" },
  { id: 2, action: "Job Posted", detail: "Senior React Dev", time: "1 hour ago" },
  { id: 3, action: "Event Created", detail: "AI Workshop 2025", time: "1 hour ago" },
  { id: 4, action: "Bulk Import", detail: "Batch_2024.xlsx uploaded", time: "1 day ago" },
];
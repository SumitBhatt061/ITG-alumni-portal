import React, { useState, useEffect } from 'react';
import {
  Users, Calendar, Briefcase, Search, Menu, X, GraduationCap, MapPin,
  Linkedin, Mail, Heart, Award, ArrowRight, Sparkles,
  MessageCircle, MessageSquare, Send, Loader2, Image as ImageIcon, Upload,
  Globe, MoreVertical, Phone, Video, BookOpen, Lock, ArrowLeft,
  FileText, Trash2, Shield, Activity, CheckCircle, Plus, Save, Bell,
  AlertCircle, FileSpreadsheet, UserCheck, FileCode, BrainCircuit
} from 'lucide-react';

// --- CONSTANTS & MOCK DATA ---

const apiKey = ""; // Add your Gemini API Key here

const ROLES = {
  VISITOR: 'visitor',
  STUDENT: 'student',
  ALUMNI: 'alumni',
  ADMIN: 'admin'
};

// Initial Users
const INITIAL_USERS = [
  { id: 1, name: "Sarah Jenkins", role: 'alumni', status: 'active', email: 'sarah@test.com', image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", job: "Senior Dev @ TechFlow", location: "San Francisco", openToMentor: true, resources: [] },
  { id: 2, name: "Marcus Thorne", role: 'alumni', status: 'active', email: 'marcus@test.com', image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus", job: "PM @ GlobalFinance", location: "New York", openToMentor: false, resources: [] },
  { id: 3, name: "Rahul Kumar", role: 'student', status: 'active', email: 'rahul@test.com', image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul", techStack: "React, Java", achievements: "Hackathon Winner", experience: "Intern at TechFlow", joinedGroups: [] },
];

const INITIAL_EVENTS = [
  { id: 1, title: "Class of 2014: 10-Year Reunion", date: "Oct 15, 2024", location: "Main Campus", category: "Reunion", attendees: 142 },
  { id: 2, title: "Tech Networking Night", date: "Nov 02, 2024", location: "Convention Center", category: "Networking", attendees: 85 },
];

const INITIAL_ANNOUNCEMENTS = [
  { id: 1, title: "Campus Renovation Update", date: "2 days ago", content: "The new library wing will be open from next Monday." },
  { id: 2, title: "Alumni Fund Drive", date: "1 week ago", content: "We reached 50% of our goal! Thank you for donating." },
];

// Tech-Stack Only Groups
const INITIAL_GROUPS = [
  {
    id: 1,
    name: "React Ecosystem",
    tech: "React",
    members: 450,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=500&q=60",
    description: "For Frontend Developers working with React, Next.js, and Remix.",
    jobs: [
      { id: 101, title: "Senior React Dev", company: "TechFlow", location: "Remote", postedBy: "Sarah Jenkins" }
    ]
  },
  {
    id: 2,
    name: "Python & AI",
    tech: "Python",
    members: 320,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=500&q=60",
    description: "Data Science, Machine Learning, and Backend development with Python.",
    jobs: []
  },
  {
    id: 3,
    name: "Java Enterprise",
    tech: "Java",
    members: 120,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=60",
    description: "Spring Boot, Microservices, and legacy system modernization.",
    jobs: []
  },
];

const ACTIVITY_LOGS = [
  { id: 1, action: "User Registered", detail: "Rahul Kumar (Student)", time: "10 mins ago" },
  { id: 2, action: "Job Posted", detail: "Senior React Dev in React Ecosystem", time: "1 hour ago" },
];

// --- SERVICES ---

const generateAIText = async (userPrompt) => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: userPrompt }] }] })
    });
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm disconnected right now.";
  } catch (e) { return "Service unavailable."; }
};

const generateAIImage = async (prompt) => { return null; };

// --- SHARED COMPONENTS ---

const Button = ({ children, variant = 'primary', className = '', onClick, disabled = false, icon }) => {
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600",
    danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
    success: "bg-green-600 text-white hover:bg-green-700",
    linkedin: "bg-[#0077b5] text-white hover:bg-[#006396]",
    google: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${variants[variant]} ${className}`}>
      {icon} {children}
    </button>
  );
};

const Badge = ({ children, color = 'indigo' }) => {
  const colors = { indigo: "bg-indigo-100 text-indigo-800", green: "bg-emerald-100 text-emerald-800", red: "bg-red-100 text-red-800", gray: "bg-slate-100 text-slate-800", orange: "bg-orange-100 text-orange-800", white: "bg-white/90 text-slate-800 backdrop-blur" };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${colors[color]}`}>{children}</span>;
};

// --- AUTH MODAL ---

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [view, setView] = useState('standard');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@college.edu') {
      onLogin({ name: 'System Admin', role: ROLES.ADMIN, email });
    } else if (email === 'student@college.edu') {
      onLogin({ id: 3, name: 'Rahul Kumar', role: ROLES.STUDENT, email, techStack: 'React, Java', achievements: 'Hackathon Winner', experience: 'Intern at TechFlow', joinedGroups: [] });
    } else {
      // Default generic login falls to Alumni for this demo
      onLogin({ id: 1, name: 'Sarah Jenkins', role: ROLES.ALUMNI, email, job: "Senior Dev @ TechFlow", location: "San Francisco", openToMentor: true, resources: [] });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">{view === 'alumni' ? 'Alumni Login' : 'Welcome Back'}</h2>
            <p className="text-slate-500 text-sm">{view === 'alumni' ? 'Verify via LinkedIn' : 'Sign in to access the portal'}</p>
          </div>
          {view === 'standard' ? (
            <form onSubmit={handleLogin} className="space-y-4">
                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-800 mb-2">
                    <strong>Demo Credentials:</strong><br/>
                    Admin: <code>admin@college.edu</code><br/>
                    Student: <code>student@college.edu</code>
                </div>
              <div className="space-y-3">
                <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="password" placeholder="Password" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              </div>
              <Button className="w-full">Sign In</Button>
              <div className="relative flex py-2 items-center"><div className="flex-grow border-t"></div><span className="mx-4 text-xs text-slate-400">OR</span><div className="flex-grow border-t"></div></div>
              <button type="button" onClick={() => setView('alumni')} className="w-full py-2 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center">
                <GraduationCap className="w-4 h-4 mr-2" /> Sign in as Alumni
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <Button variant="linkedin" className="w-full py-3" icon={<Linkedin className="w-5 h-5" />} onClick={() => handleLogin({ preventDefault: () => {} })}>Continue with LinkedIn</Button>
              <button onClick={() => setView('standard')} className="w-full text-sm text-slate-500 hover:text-slate-800">Back to Regular Login</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- ADMIN DASHBOARD ---

const AdminDashboard = ({ users, setUsers, events, setEvents, announcements, setAnnouncements }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [newEventTitle, setNewEventTitle] = useState('');
  const handleDeleteUser = (id) => setUsers(users.filter(u => u.id !== id));
  const handleBlockUser = (id) => setUsers(users.map(u => u.id === id ? { ...u, status: 'blocked' } : u));
  const handleAddEvent = () => { if(!newEventTitle) return; setEvents([...events, { id: Date.now(), title: newEventTitle, date: "Upcoming", location: "TBD", category: "General", attendees: 0 }]); setNewEventTitle(''); };
  const handleDeleteEvent = (id) => setEvents(events.filter(e => e.id !== id));
  const handleFileUpload = (e) => alert(`File "${e.target.files[0].name}" uploaded successfully. 150 students added to directory.`);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8"><h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1><Badge color="red">ADMIN ACCESS</Badge></div>
      <div className="flex gap-2 mb-8 border-b overflow-x-auto">
        {['users', 'events', 'announcements', 'logs', 'upload'].map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 px-4 capitalize font-medium whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>{tab}</button>))}
      </div>
      {activeTab === 'users' && <div className="bg-white rounded-xl border shadow-sm overflow-hidden"><table className="w-full text-left"><thead className="bg-slate-50 text-slate-500 font-medium text-sm"><tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{users.map(u => (<tr key={u.id} className="border-t hover:bg-slate-50"><td className="p-4 flex items-center gap-3"><img src={u.image} className="w-8 h-8 rounded-full" /> <div><div className="font-medium">{u.name}</div><div className="text-xs text-slate-400">{u.email}</div></div></td><td className="p-4 capitalize"><Badge color={u.role === 'alumni' ? 'indigo' : 'green'}>{u.role}</Badge></td><td className="p-4"><span className={`text-xs font-bold ${u.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{u.status.toUpperCase()}</span></td><td className="p-4 flex gap-2"><button onClick={() => handleBlockUser(u.id)} className="text-orange-500 hover:bg-orange-50 p-2 rounded"><Shield className="w-4 h-4" /></button><button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button></td></tr>))}</tbody></table></div>}
      {activeTab === 'events' && <div className="space-y-6"><div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex gap-2"><input type="text" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} placeholder="Event Title" className="flex-1 px-4 py-2 border rounded-lg" /><Button onClick={handleAddEvent} icon={<Plus className="w-4 h-4" />}>Post</Button></div><div className="grid gap-4">{events.map(event => (<div key={event.id} className="bg-white p-4 border rounded-xl flex justify-between items-center"><div><h3 className="font-bold">{event.title}</h3><p className="text-sm text-slate-500">{event.date}</p></div><Button variant="danger" className="text-xs py-1" onClick={() => handleDeleteEvent(event.id)}>Delete</Button></div>))}</div></div>}
      {activeTab === 'announcements' && <div className="space-y-4">{announcements.map(ann => (<div key={ann.id} className="bg-white p-4 border rounded-xl"><div className="flex justify-between mb-1"><h4 className="font-bold text-slate-900">{ann.title}</h4><span className="text-xs text-slate-400">{ann.date}</span></div><p className="text-sm text-slate-600">{ann.content}</p></div>))}</div>}
      {activeTab === 'logs' && <div className="space-y-4">{ACTIVITY_LOGS.map(log => (<div key={log.id} className="bg-white p-4 rounded-lg border flex justify-between items-center"><div className="flex items-center gap-3"><div className="p-2 bg-indigo-50 text-indigo-600 rounded"><Activity className="w-4 h-4" /></div><div><h4 className="font-bold text-sm">{log.action}</h4><p className="text-xs text-slate-500">{log.detail}</p></div></div><span className="text-xs text-slate-400">{log.time}</span></div>))}</div>}
      {activeTab === 'upload' && <div className="bg-white p-12 rounded-xl border-2 border-dashed text-center"><div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><FileSpreadsheet className="w-8 h-8" /></div><h3 className="font-bold text-lg">Upload Student Data</h3><p className="text-slate-500 mb-6">Supports .xlsx, .csv</p><input type="file" accept=".xlsx" onChange={handleFileUpload} className="mx-auto block text-sm text-slate-500" /></div>}
    </div>
  );
};

// --- STUDENT DASHBOARD ---

const StudentDashboard = ({ user, setUser, setPage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ techStack: user.techStack || '', achievements: user.achievements || '', experience: user.experience || '' });
  const handleSave = () => { setUser({ ...user, ...formData }); setIsEditing(false); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Student Dashboard</h1>
      <p className="text-slate-500 mb-8">Welcome back, {user.name}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4"><img src={user.image || "https://ui-avatars.com/api/?name=Student"} className="w-16 h-16 rounded-full border-2 border-indigo-100" /><div><h2 className="text-xl font-bold text-slate-900">{user.name}</h2><p className="text-slate-500 text-sm">{user.email}</p></div></div>
              {!isEditing ? <Button onClick={() => setIsEditing(true)} variant="secondary" icon={<FileText className="w-4 h-4" />}>Edit Profile</Button> : <Button onClick={handleSave} icon={<Save className="w-4 h-4" />}>Save</Button>}
            </div>
            <div className="space-y-6">
                <div><label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tech Stack</label>{isEditing ? <input type="text" value={formData.techStack} onChange={e => setFormData({...formData, techStack: e.target.value})} className="w-full p-2 border rounded-lg" /> : <div className="flex flex-wrap gap-2">{formData.techStack ? formData.techStack.split(',').map(t => <Badge key={t} color="gray">{t.trim()}</Badge>) : <span className="text-sm text-slate-400">No stack added</span>}</div>}</div>
                <div><label className="block text-xs font-bold text-slate-400 uppercase mb-2">Achievements</label>{isEditing ? <textarea value={formData.achievements} onChange={e => setFormData({...formData, achievements: e.target.value})} className="w-full p-2 border rounded-lg h-24" /> : <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{formData.achievements || "No achievements listed yet."}</p>}</div>
            </div>
          </div>
          <div className="space-y-6">
              <div className="bg-indigo-900 text-white p-6 rounded-2xl"><h3 className="font-bold text-lg mb-4">Quick Access</h3><ul className="space-y-3"><li><button onClick={() => setPage('directory')} className="flex items-center text-indigo-200 hover:text-white"><Users className="w-4 h-4 mr-2" /> Alumni Directory</button></li><li><button onClick={() => setPage('events')} className="flex items-center text-indigo-200 hover:text-white"><Calendar className="w-4 h-4 mr-2" /> Upcoming Events</button></li><li><button onClick={() => setPage('messages')} className="flex items-center text-indigo-200 hover:text-white"><MessageSquare className="w-4 h-4 mr-2" /> Messages</button></li></ul></div>
          </div>
      </div>
    </div>
  );
};

// --- ALUMNI DASHBOARD (UPDATED WITH RESOURCES) ---

const AlumniDashboard = ({ user, setUser, setPage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ job: user.job || '', location: user.location || '', openToMentor: user.openToMentor || false });
  const [resourceLink, setResourceLink] = useState('');

  const handleSave = () => { setUser({ ...user, ...formData }); setIsEditing(false); };
  const toggleMentor = () => { if(isEditing) setFormData({...formData, openToMentor: !formData.openToMentor}); };
  const handleUploadResource = () => {
      if(!resourceLink) return;
      const newResource = { id: Date.now(), title: "Development Roadmap", link: resourceLink };
      setUser({ ...user, resources: [...(user.resources || []), newResource] });
      setResourceLink('');
      alert("Resource added to your profile!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8"><div><h1 className="text-3xl font-bold text-slate-900">Alumni Dashboard</h1><p className="text-slate-500">Welcome back, {user.name}</p></div><Badge color="indigo">ALUMNI ACCESS</Badge></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
            {/* Profile Section */}
            <div className="bg-white rounded-2xl shadow-sm border p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4"><img src={user.image} className="w-20 h-20 rounded-full border-4 border-indigo-50" /><div><h2 className="text-2xl font-bold text-slate-900">{user.name}</h2><p className="text-slate-500">{user.email}</p><div className="mt-2">{user.openToMentor && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center w-fit"><UserCheck className="w-3 h-3 mr-1" /> Open to Mentor</span>}</div></div></div>
                  {!isEditing ? <Button onClick={() => setIsEditing(true)} variant="secondary" icon={<FileText className="w-4 h-4" />}>Edit Profile</Button> : <Button onClick={handleSave} icon={<Save className="w-4 h-4" />}>Save Changes</Button>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-xs font-bold text-slate-400 uppercase mb-2">Current Role</label>{isEditing ? <input type="text" value={formData.job} onChange={e => setFormData({...formData, job: e.target.value})} className="w-full p-2 border rounded-lg" /> : <div className="font-medium text-slate-800 flex items-center"><Briefcase className="w-4 h-4 mr-2 text-slate-400" /> {formData.job}</div>}</div>
                    <div><label className="block text-xs font-bold text-slate-400 uppercase mb-2">Location</label>{isEditing ? <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2 border rounded-lg" /> : <div className="font-medium text-slate-800 flex items-center"><MapPin className="w-4 h-4 mr-2 text-slate-400" /> {formData.location}</div>}</div>
                    {isEditing && <div className="md:col-span-2 border-t pt-4 mt-2"><label className="flex items-center cursor-pointer"><input type="checkbox" checked={formData.openToMentor} onChange={toggleMentor} className="w-4 h-4 text-indigo-600 rounded" /><span className="ml-2 text-sm font-medium text-slate-700">I am willing to mentor students</span></label></div>}
                </div>
            </div>
            {/* Resource Upload Section */}
            <div className="bg-white rounded-2xl shadow-sm border p-8">
                <h3 className="font-bold text-lg mb-4 flex items-center"><BrainCircuit className="w-5 h-5 mr-2 text-indigo-600" /> Share Roadmap Resources</h3>
                <p className="text-sm text-slate-500 mb-4">Upload links to roadmaps, drive folders, or articles to help students.</p>
                <div className="flex gap-2">
                    <input type="text" value={resourceLink} onChange={(e) => setResourceLink(e.target.value)} placeholder="Paste resource link here..." className="flex-1 p-2 border rounded-lg text-sm" />
                    <Button onClick={handleUploadResource} icon={<Upload className="w-4 h-4" />}>Upload</Button>
                </div>
                {user.resources && user.resources.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase">Your Uploads</h4>
                        {user.resources.map(res => (<div key={res.id} className="text-sm text-indigo-600 bg-indigo-50 p-2 rounded flex items-center"><FileCode className="w-4 h-4 mr-2" /> {res.title}</div>))}
                    </div>
                )}
            </div>
        </div>
        {/* Actions Sidebar */}
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-6 rounded-2xl shadow-lg"><h3 className="font-bold text-lg mb-4">Quick Access</h3><ul className="space-y-3">
                <li><button onClick={() => setPage('groups')} className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-lg text-left flex items-center transition-colors"><Users className="w-4 h-4 mr-3" /> View Tech Groups</button></li>
                <li><button onClick={() => setPage('directory')} className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-lg text-left flex items-center transition-colors"><Search className="w-4 h-4 mr-3" /> Student Directory</button></li>
                <li><button onClick={() => setPage('messages')} className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-lg text-left flex items-center transition-colors"><MessageSquare className="w-4 h-4 mr-3" /> Messages</button></li>
                <li><button onClick={() => setPage('events')} className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-lg text-left flex items-center transition-colors"><Calendar className="w-4 h-4 mr-3" /> Events & Announcements</button></li>
            </ul></div>
        </div>
      </div>
    </div>
  );
};

// --- GROUPS PAGE (UPDATED WITH TECH STACK & TEST) ---

const GroupsPage = ({ user, groups, setGroups }) => {
  const [testModal, setTestModal] = useState(null); // { group: groupObj }

  const handleGroupAction = (group) => {
      // 1. If Alumni -> Can post job directly (Enter Group)
      if (user.role === ROLES.ALUMNI) {
          alert(`Welcome to ${group.name}. You can now post jobs here.`);
          // In a real app, this would navigate to a detailed group view
      }
      // 2. If Student -> Check if member. If not, take test.
      else if (user.role === ROLES.STUDENT) {
          if (user.joinedGroups?.includes(group.id)) {
              alert("Entering group chat...");
          } else {
              setTestModal(group);
          }
      }
  };

  const handlePostJob = (groupId, e) => {
      e.stopPropagation();
      const jobTitle = prompt("Enter Job Title:");
      if (jobTitle) {
          const updatedGroups = groups.map(g => {
              if (g.id === groupId) return { ...g, jobs: [...g.jobs, { id: Date.now(), title: jobTitle, company: user.job.split('@')[1] || 'Unknown', location: 'Remote', postedBy: user.name }] };
              return g;
          });
          setGroups(updatedGroups);
      }
  };

  const handlePassTest = () => {
      alert("Congratulations! You passed the test and joined the group.");
      setTestModal(null);
      // Logic to add group to user's joined list would go here
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-2 text-slate-900">Tech Communities</h2>
      <p className="text-slate-500 mb-8">Join specialized tech stacks. Students must pass a skill test to join.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {groups.map(group => (
          <div key={group.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="h-32 bg-slate-200 relative"><img src={group.image} className="w-full h-full object-cover" /><div className="absolute bottom-2 left-2"><Badge color="white">{group.tech}</Badge></div></div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold">{group.name}</h3>
              <p className="text-sm text-slate-500 mb-4 flex-1">{group.description}</p>

              {/* Jobs Section INSIDE Group */}
              {group.jobs.length > 0 && (
                <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
                  <h4 className="text-xs font-bold text-indigo-800 uppercase mb-2">Active Jobs</h4>
                  {group.jobs.map((job, i) => <div key={i} className="text-sm text-indigo-700 truncate">• {job.title}</div>)}
                </div>
              )}

              <div className="flex gap-2 mt-auto pt-4 border-t">
                <Button onClick={() => handleGroupAction(group)} className="flex-1" variant="secondary">
                    {user?.role === ROLES.ALUMNI ? 'Enter Group' : 'Join (Take Test)'}
                </Button>
                {user?.role === ROLES.ALUMNI && (
                  <Button onClick={(e) => handlePostJob(group.id, e)} icon={<Plus className="w-4 h-4" />}>Post Job</Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SKILL TEST MODAL */}
      {testModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-xl max-w-md w-full animate-in zoom-in-95">
            <h3 className="text-xl font-bold mb-4">Skill Test: {testModal.tech}</h3>
            <p className="mb-6 text-slate-600">To ensure quality discussions, please answer this verification question.</p>
            <div className="bg-slate-50 p-4 rounded-lg mb-6">
                <p className="font-medium text-sm mb-3">Question: What is the primary use of {testModal.tech} in modern development?</p>
                <div className="space-y-2">
                    <button onClick={handlePassTest} className="w-full p-3 border bg-white rounded hover:bg-green-50 hover:border-green-500 text-left text-sm transition-colors">A. Building scalable, component-based applications.</button>
                    <button onClick={() => alert("Incorrect. Try again.")} className="w-full p-3 border bg-white rounded hover:bg-red-50 text-left text-sm transition-colors">B. Making coffee.</button>
                </div>
            </div>
            <Button variant="secondary" className="w-full" onClick={() => setTestModal(null)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const App = () => {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [authOpen, setAuthOpen] = useState(false);

  // Shared State
  const [users, setUsers] = useState(INITIAL_USERS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [heroBgImage, setHeroBgImage] = useState('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80');

  const renderPage = () => {
    if (page === 'admin' && user?.role === ROLES.ADMIN)
        return <AdminDashboard users={users} setUsers={setUsers} events={events} setEvents={setEvents} announcements={announcements} setAnnouncements={setAnnouncements} />;

    if (page === 'student-dash' && user?.role === ROLES.STUDENT)
        return <StudentDashboard user={user} setUser={setUser} setPage={setPage} />;

    if (page === 'alumni-dash' && user?.role === ROLES.ALUMNI)
        return <AlumniDashboard user={user} setUser={setUser} setPage={setPage} />;

    if (page === 'groups') return <GroupsPage user={user} groups={groups} setGroups={setGroups} />;

    if (page === 'messages') return <div className="max-w-7xl mx-auto px-4 py-12 min-h-[60vh] flex items-center justify-center text-slate-400"><div className="text-center"><MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" /><h2 className="text-xl font-bold text-slate-600">Messaging Center</h2><p>Select a contact to start chatting.</p></div></div>;

    if (page === 'directory') return <div className="p-12 text-center text-slate-500">Directory Component Placeholder (Access granted via Dashboard)</div>;

    // Default Home View
    return (
      <>
        <div className="relative bg-slate-900 text-white overflow-hidden min-h-[500px] flex flex-col justify-center transition-all duration-500">
          <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: `url('${heroBgImage}')` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-24 text-center z-10">
            <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-sm"><span className="w-2 h-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span><span className="text-sm font-medium text-indigo-200">Welcome back, ITG Alumni!</span></div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 drop-shadow-lg">Institute of Technology <br className="hidden md:block" /><span className="text-indigo-400">Gopeshwar</span></h1>
            <p className="text-lg text-slate-200 max-w-2xl mb-10 drop-shadow-md mx-auto">Join our exclusive network of graduates. Reconnect with batchmates, find mentors, and stay updated.</p>
            {!user && <div className="flex justify-center gap-4"><Button onClick={() => setAuthOpen(true)}>Login / Join</Button></div>}

            {/* Smart Dashboard Button based on Role */}
            {user && user.role === ROLES.STUDENT && <Button onClick={() => setPage('student-dash')}>Student Dashboard</Button>}
            {user && user.role === ROLES.ALUMNI && <Button onClick={() => setPage('alumni-dash')}>Alumni Dashboard</Button>}
            {user && user.role === ROLES.ADMIN && <Button onClick={() => setPage('admin')} variant="danger">Admin Dashboard</Button>}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Upcoming Events</h2>
            <div className="grid gap-6 md:grid-cols-2">
                {events.map(event => (<div key={event.id} className="bg-white border p-6 rounded-xl hover:border-indigo-400 transition-all"><Badge color="orange">{event.category}</Badge><h3 className="text-xl font-bold mt-2">{event.title}</h3><div className="flex gap-4 mt-2 text-sm text-slate-500"><span><Calendar className="w-4 h-4 inline" /> {event.date}</span><span><MapPin className="w-4 h-4 inline" /> {event.location}</span></div></div>))}
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Campus Announcements</h2>
            <div className="grid gap-4">
                {announcements.map(ann => (
                    <div key={ann.id} className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex justify-between items-center">
                        <div><h4 className="font-bold text-slate-800">{ann.title}</h4><p className="text-sm text-slate-600">{ann.content}</p></div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{ann.date}</span>
                    </div>
                ))}
            </div>
        </div>
      </>
    );
  };

  const NavLink = ({ page, label, icon: Icon }) => (
    <button onClick={() => setPage(page)} className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors">
      {Icon && <Icon className="w-4 h-4 mr-2" />}{label}
    </button>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
            <div className="flex items-center cursor-pointer" onClick={() => setPage('home')}>
              <div className="bg-indigo-600 p-1.5 rounded-lg mr-2"><GraduationCap className="h-6 w-6 text-white" /></div>
              <span className="text-xl font-bold text-indigo-900">ITG Alumni</span>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <NavLink page="home" label="Home" />
              <NavLink page="groups" label="Tech Groups" icon={Globe} />
              {user && <NavLink page="messages" label="Messages" icon={MessageSquare} />}
              <div className="h-6 w-px bg-slate-200 mx-4"></div>
              {user ? (
                 <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-600 flex items-center">
                        {user.role === ROLES.ADMIN && <Shield className="w-3 h-3 text-red-500 mr-1"/>}
                        {user.name}
                    </span>
                    {user.role === ROLES.ALUMNI && <button onClick={() => setPage('alumni-dash')} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold hover:bg-indigo-100">Dashboard</button>}
                    <Button variant="secondary" className="text-xs py-1.5 px-3" onClick={() => { setUser(null); setPage('home'); }}>Logout</Button>
                 </div>
              ) : (
                 <Button variant="secondary" className="text-sm py-1.5" onClick={() => setAuthOpen(true)}>Sign In</Button>
              )}
            </div>
        </div>
      </nav>

      <main>{renderPage()}</main>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onLogin={setUser} />
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs">© 2024 IT Gopeshwar Alumni Portal. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default App;
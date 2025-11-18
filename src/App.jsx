import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Calendar,
  Briefcase,
  Search,
  Menu,
  X,
  GraduationCap,
  MapPin,
  Linkedin,
  Mail,
  ChevronRight,
  Heart,
  Award,
  ArrowRight,
  Sparkles,
  MessageCircle,
  MessageSquare,
  Send,
  Loader2,
  Image as ImageIcon,
  Upload,
  Globe,
  MoreVertical,
  Phone,
  Video,
  BookOpen,
  Lock,
  ArrowLeft
} from 'lucide-react';

// --- API Helper Functions ---

const apiKey = ""; // API Key provided by environment

const generateAIImage = async (prompt) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt: prompt }],
          parameters: { sampleCount: 1 },
        }),
      }
    );
    if (!response.ok) throw new Error('Image generation failed');
    const data = await response.json();
    const base64Image = data.predictions?.[0]?.bytesBase64Encoded;
    if (!base64Image) throw new Error('No image data received');
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
};

const generateAIText = async (userPrompt) => {
  try {
    const systemPrompt = `You are the "IT Gopeshwar Alumni AI". Helpful, professional, encouraging. Context: We have active alumni, yearly events, mentorships.`;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      }
    );
    if (!response.ok) throw new Error('Text generation failed');
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    return "I'm having trouble connecting to the network. Please try again later.";
  }
};

// --- Mock Data ---

const ALUMNI_DATA = [
  { id: 1, name: "Sarah Jenkins", gradYear: 2019, major: "Computer Science", company: "TechFlow Inc.", role: "Senior Frontend Dev", location: "San Francisco, CA", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=c0aede" },
  { id: 2, name: "Marcus Thorne", gradYear: 2015, major: "Business Admin", company: "Global Finance", role: "Project Manager", location: "New York, NY", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=b6e3f4" },
  { id: 3, name: "Elena Rodriguez", gradYear: 2021, major: "Graphic Design", company: "Freelance", role: "Art Director", location: "Austin, TX", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=ffdfbf" },
  { id: 4, name: "David Chen", gradYear: 2012, major: "Electrical Engineering", company: "Tesla", role: "Lead Engineer", location: "Fremont, CA", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=d1d4f9" },
];

const EVENTS_DATA = [
  { id: 1, title: "Class of 2014: 10-Year Reunion", date: "Oct 15, 2024", location: "Main Campus, Grand Hall", category: "Reunion", attendees: 142 },
  { id: 2, title: "Tech Networking Night", date: "Nov 02, 2024", location: "Downtown Convention Center", category: "Networking", attendees: 85 },
];

const JOBS_DATA = [
  { id: 1, title: "Marketing Specialist", company: "Alumni Ventures", location: "Remote", type: "Full-time", postedBy: "Jessica M. ('10)" },
  { id: 2, title: "Junior Software Engineer", company: "StartUp One", location: "Seattle, WA", type: "Full-time", postedBy: "Tom H. ('16)" },
];

const GROUPS_DATA = [
  { id: 1, name: "Tech Entrepreneurs", members: 450, category: "Professional", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&q=60", description: "A space for founders and startup enthusiasts to share ideas." },
  { id: 2, name: "Hiking & Adventure", members: 85, category: "Interest", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=500&q=60", description: "Weekend treks and outdoor adventures for nature lovers." },
  { id: 3, name: "Women in Tech", members: 230, category: "Community", image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=500&q=60", description: "Supporting women graduates in technology fields." },
  { id: 4, name: "Class of 2020", members: 120, category: "Year Group", image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80  ", description: "Official group for the graduating batch of 2020." },

];

const MESSAGES_DATA = [
  { id: 1, name: "Sarah Jenkins", lastMessage: "Hey! Are you going to the gala?", time: "2m ago", unread: true, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=c0aede" },
  { id: 2, name: "David Chen", lastMessage: "Thanks for the recommendation!", time: "1h ago", unread: false, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=d1d4f9" },
  { id: 3, name: "Tech Entrepreneurs", lastMessage: "Marcus: New meetup scheduled for Friday!", time: "3h ago", unread: false, image: "https://ui-avatars.com/api/?name=TE&background=random", isGroup: true },
];

// --- Components ---

const Button = ({ children, variant = 'primary', className = '', onClick, disabled = false, icon }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600",
    outline: "border-2 border-white text-white hover:bg-white/10",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    linkedin: "bg-[#0077b5] text-white hover:bg-[#006396] shadow-sm",
    google: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-sm"
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} onClick={onClick} disabled={disabled}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const Badge = ({ children, color = 'indigo', className = '' }) => {
  const colors = {
    indigo: "bg-indigo-100 text-indigo-800",
    green: "bg-emerald-100 text-emerald-800",
    blue: "bg-blue-100 text-blue-800",
    orange: "bg-orange-100 text-orange-800",
    white: "bg-white/90 text-slate-800 backdrop-blur"
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color] || colors.indigo} ${className}`}>{children}</span>;
};

// --- Feature Sections ---

const AuthModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('selection'); // selection, alumni, student

  useEffect(() => { if (isOpen) setStep('selection'); }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10"><X className="w-5 h-5" /></button>
        <div className="p-8">
          {step === 'selection' && (
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600"><Users className="w-6 h-6" /></div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-500 mb-8">Choose how you want to sign in to the portal.</p>
              <div className="space-y-4">
                <button onClick={() => setStep('alumni')} className="w-full group p-4 border-2 border-slate-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/30 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4"><div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><GraduationCap className="w-5 h-5" /></div><div className="text-left"><h3 className="font-bold text-slate-900">Alumni</h3><p className="text-xs text-slate-500">Graduates & Faculty</p></div></div><ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </button>
                <button onClick={() => setStep('student')} className="w-full group p-4 border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50/30 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4"><div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"><BookOpen className="w-5 h-5" /></div><div className="text-left"><h3 className="font-bold text-slate-900">Student</h3><p className="text-xs text-slate-500">Current Students</p></div></div><ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </button>
              </div>
            </div>
          )}
          {step === 'alumni' && (
            <div>
              <button onClick={() => setStep('selection')} className="mb-6 text-slate-400 hover:text-slate-600 flex items-center text-sm font-medium"><ArrowLeft className="w-4 h-4 mr-1" /> Back</button>
              <div className="text-center mb-8"><div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600"><GraduationCap className="w-6 h-6" /></div><h2 className="text-2xl font-bold text-slate-900">Alumni Login</h2><p className="text-slate-500 mt-2 text-sm">Verify your graduate status via LinkedIn.</p></div>
              <Button variant="linkedin" className="w-full py-3 text-base" icon={<Linkedin className="w-5 h-5" />}>Sign in with LinkedIn</Button>
              <div className="mt-6 text-center"><p className="text-xs text-slate-400">By continuing, you agree to our Terms of Service.</p></div>
            </div>
          )}
          {step === 'student' && (
            <div>
              <button onClick={() => setStep('selection')} className="mb-6 text-slate-400 hover:text-slate-600 flex items-center text-sm font-medium"><ArrowLeft className="w-4 h-4 mr-1" /> Back</button>
              <div className="text-center mb-6"><h2 className="text-2xl font-bold text-slate-900">Student Login</h2><p className="text-slate-500 text-sm mt-1">Access campus resources and events.</p></div>
              <div className="space-y-4">
                <Button variant="google" className="w-full py-2.5 flex items-center justify-center" icon={<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>}>Continue with Google</Button>
                <div className="relative flex py-2 items-center"><div className="flex-grow border-t border-slate-200"></div><span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase font-bold">Or with email</span><div className="flex-grow border-t border-slate-200"></div></div>
                <div className="space-y-3">
                  <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="email" placeholder="Student Email ID" className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                  <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="password" placeholder="Password" className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                  <div className="flex justify-end"><button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Forgot Password?</button></div>
                </div>
                <Button className="w-full">Sign In</Button>
                <p className="text-center text-xs text-slate-500 mt-4">Don't have an account? <button className="text-indigo-600 font-bold hover:underline">Sign Up</button></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'system', content: 'Hi there! I\'m your IT Gopeshwar Assistant.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isOpen]);
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    const aiResponseText = await generateAIText(input);
    setMessages(prev => [...prev, { role: 'system', content: aiResponseText }]);
    setLoading(false);
  };
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-indigo-600 p-4 flex justify-between items-center"><div className="flex items-center text-white"><Sparkles className="w-5 h-5 mr-2" /><span className="font-bold">ITG Assistant</span></div><button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button></div>
          <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg, idx) => (<div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'}`}>{msg.content}</div></div>))}
            {loading && <div className="flex justify-start"><div className="bg-white p-3 rounded-2xl shadow-sm"><Loader2 className="w-5 h-5 text-indigo-600 animate-spin" /></div></div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 bg-white border-t border-slate-200 flex gap-2"><input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask anything..." className="flex-1 px-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /><button onClick={handleSend} disabled={loading} className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50"><Send className="w-4 h-4" /></button></div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">{isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />}</button>
    </div>
  );
};

const HeroSection = ({ setPage, bgImage, setBgImage }) => {
  const [isEditingBg, setIsEditingBg] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateBg = async () => {
    if (!prompt) return;
    setLoading(true);
    const newImage = await generateAIImage(prompt + " high quality, photorealistic, wide shot");
    if (newImage) { setBgImage(newImage); setIsEditingBg(false); }
    setLoading(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setBgImage(reader.result); setIsEditingBg(false); };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative bg-slate-900 text-white overflow-hidden min-h-[600px] flex flex-col justify-center transition-all duration-500">
      <div className="absolute inset-0 opacity-40 bg-cover bg-center transition-all duration-1000 ease-in-out" style={{ backgroundImage: `url('${bgImage}')` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900"></div>
      <div className="absolute top-4 right-4 z-20">
        {!isEditingBg ? (
          <button onClick={() => setIsEditingBg(true)} className="flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium border border-white/20 transition-all text-white/90 hover:text-white"><Sparkles className="w-3 h-3" />Customize Background</button>
        ) : (
          <div className="bg-white p-4 rounded-xl shadow-2xl w-72 animate-in slide-in-from-top-2 duration-200 text-slate-800">
             <div className="flex justify-between items-center mb-3"><h4 className="font-bold text-sm flex items-center gap-2"><ImageIcon className="w-4 h-4 text-indigo-600" />Customize Hero</h4><button onClick={() => setIsEditingBg(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button></div>
             <div className="mb-4"><p className="text-xs text-slate-500 mb-2 font-semibold">OPTION 1: AI GENERATE</p><textarea className="w-full text-sm border border-slate-200 rounded-lg p-2 mb-2 h-16 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="E.g., 'University campus at night'..." value={prompt} onChange={(e) => setPrompt(e.target.value)} /><Button className="w-full text-xs py-2 h-8" onClick={handleGenerateBg} disabled={loading}>{loading ? <><Loader2 className="w-3 h-3 mr-2 animate-spin" />Generating...</> : <><Sparkles className="w-3 h-3 mr-2" />Generate AI Image</>}</Button></div>
             <div className="relative my-4"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div><div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-white px-2 text-slate-400">Or Upload Photo</span></div></div>
             <div><label className="block w-full cursor-pointer group"><input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} /><div className="w-full border-2 border-dashed border-slate-200 rounded-lg p-3 text-center group-hover:border-indigo-500 group-hover:bg-indigo-50 transition-all"><Upload className="w-5 h-5 text-slate-400 mx-auto mb-1 group-hover:text-indigo-500" /><span className="text-xs text-slate-600 font-medium block">Click to Upload</span></div></label></div>
          </div>
        )}
      </div>
      <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:py-32 flex flex-col items-center text-center z-10">
        <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-sm"><span className="w-2 h-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span><span className="text-sm font-medium text-indigo-200">Welcome back, ITG Alumni!</span></div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 drop-shadow-lg">Institute of Technology <br className="hidden md:block" /><span className="text-indigo-400">Gopeshwar</span></h1>
        <p className="text-lg text-slate-200 max-w-2xl mb-10 drop-shadow-md">Join our exclusive network of graduates. Reconnect with batchmates, find mentors, and stay updated.</p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button onClick={() => setPage('directory')} className="w-full sm:w-auto text-lg py-3 px-8 shadow-xl shadow-indigo-900/20">Find Batchmates</Button>
          <Button variant="outline" onClick={() => setPage('events')} className="w-full sm:w-auto text-lg py-3 px-8 backdrop-blur-sm">Upcoming Events</Button>
        </div>
      </div>
    </div>
  );
};

const DirectorySection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMajor, setFilterMajor] = useState('All');
  const filteredAlumni = ALUMNI_DATA.filter(person => (person.name.toLowerCase().includes(searchTerm.toLowerCase()) || person.company.toLowerCase().includes(searchTerm.toLowerCase())) && (filterMajor === 'All' || person.major === filterMajor));
  const uniqueMajors = ['All', ...new Set(ALUMNI_DATA.map(p => p.major))];
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"><div><h2 className="text-3xl font-bold text-slate-900">Alumni Directory</h2><p className="text-slate-500 mt-1">Search for classmates by name, company, or year.</p></div><div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div><select className="px-4 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none" value={filterMajor} onChange={(e) => setFilterMajor(e.target.value)}>{uniqueMajors.map(major => (<option key={major} value={major}>{major}</option>))}</select></div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredAlumni.map(person => (<div key={person.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center group"><div className="relative mb-4"><img src={person.image} alt={person.name} className="w-24 h-24 rounded-full border-4 border-indigo-50 object-cover" /><div className="absolute bottom-0 right-0 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white">'{person.gradYear.toString().slice(2)}</div></div><h3 className="text-xl font-bold text-slate-900">{person.name}</h3><p className="text-slate-500 text-sm mb-4">{person.major}</p><div className="w-full border-t border-slate-100 pt-4 mt-auto"><div className="flex items-center justify-center text-slate-600 text-sm mb-2"><Briefcase className="w-4 h-4 mr-2 text-indigo-500" />{person.role} at <span className="font-medium ml-1">{person.company}</span></div><div className="flex items-center justify-center text-slate-600 text-sm mb-4"><MapPin className="w-4 h-4 mr-2 text-indigo-500" />{person.location}</div><div className="flex justify-center gap-3"><button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"><Linkedin className="w-5 h-5" /></button><button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full"><Mail className="w-5 h-5" /></button></div></div></div>))}</div>
    </div>
  );
};

const GroupsSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6">
      <div className="mb-8"><h2 className="text-3xl font-bold text-slate-900">Groups & Communities</h2><p className="text-slate-500 mt-1">Join interest-based groups to connect with like-minded alumni.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {GROUPS_DATA.map(group => (
          <div key={group.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
            <div className="h-32 bg-slate-200 relative overflow-hidden"><img src={group.image} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /><div className="absolute top-4 left-4"><Badge color="white" className="bg-white/90 backdrop-blur">{group.category}</Badge></div></div>
            <div className="p-6"><div className="flex justify-between items-start mb-2"><h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{group.name}</h3><div className="flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full"><Users className="w-3 h-3 mr-1" /> {group.members}</div></div><p className="text-slate-600 text-sm mb-6 line-clamp-2">{group.description}</p><Button variant="secondary" className="w-full">Join Group</Button></div>
          </div>
        ))}
        <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer"><div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4"><Globe className="w-6 h-6" /></div><h3 className="text-lg font-bold text-slate-900">Start a New Group</h3><p className="text-slate-500 text-sm mt-2">Don't see your interest? Create a new community.</p></div>
      </div>
    </div>
  );
};

const MessagingSection = () => {
  const [selectedId, setSelectedId] = useState(1);
  const [messageText, setMessageText] = useState('');
  const [chatHistory, setChatHistory] = useState([{ id: 1, sender: 'them', text: 'Hey! Are you going to the gala?', time: '10:00 AM' }, { id: 2, sender: 'me', text: 'Yes, I just bought my tickets! Are you?', time: '10:05 AM' }]);
  const activeChat = MESSAGES_DATA.find(m => m.id === selectedId);
  const handleSendMessage = () => { if (!messageText.trim()) return; setChatHistory([...chatHistory, { id: Date.now(), sender: 'me', text: messageText, time: 'Now' }]); setMessageText(''); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 h-[calc(100vh-5rem)]">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex h-full">
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center"><h3 className="font-bold text-lg">Messages</h3><button className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-full"><MoreVertical className="w-5 h-5" /></button></div>
          <div className="p-3 border-b border-slate-200"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search messages..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-indigo-500" /></div></div>
          <div className="flex-1 overflow-y-auto">
            {MESSAGES_DATA.map(msg => (
              <div key={msg.id} onClick={() => setSelectedId(msg.id)} className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${selectedId === msg.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}>
                <div className="relative"><img src={msg.image} alt={msg.name} className="w-10 h-10 rounded-full object-cover" />{msg.unread && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>}</div>
                <div className="flex-1 min-w-0"><div className="flex justify-between items-baseline"><h4 className={`text-sm font-semibold truncate ${msg.unread ? 'text-slate-900' : 'text-slate-700'}`}>{msg.name}</h4><span className="text-xs text-slate-400">{msg.time}</span></div><p className={`text-sm truncate ${msg.unread ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>{msg.lastMessage}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col hidden md:flex">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white"><div className="flex items-center gap-3"><img src={activeChat?.image} alt={activeChat?.name} className="w-10 h-10 rounded-full" /><div><h3 className="font-bold text-slate-900">{activeChat?.name}</h3><p className="text-xs text-green-600 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>Online</p></div></div><div className="flex gap-2"><button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><Phone className="w-5 h-5" /></button><button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><Video className="w-5 h-5" /></button></div></div>
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">{chatHistory.map(chat => (<div key={chat.id} className={`flex ${chat.sender === 'me' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[70%] p-3 rounded-2xl text-sm ${chat.sender === 'me' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'}`}><p>{chat.text}</p><p className={`text-[10px] mt-1 text-right ${chat.sender === 'me' ? 'text-indigo-200' : 'text-slate-400'}`}>{chat.time}</p></div></div>))}</div>
          <div className="p-4 bg-white border-t border-slate-200"><div className="flex gap-2"><input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type a message..." className="flex-1 px-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" /><button onClick={handleSendMessage} className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-md"><Send className="w-4 h-4" /></button></div></div>
        </div>
      </div>
    </div>
  );
};

const EventsSection = () => (
  <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6">
    <h2 className="text-3xl font-bold text-slate-900 mb-8">Upcoming Events</h2>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl overflow-hidden text-white relative">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Calendar className="w-64 h-64" /></div>
        <div className="p-8 md:p-12 relative z-10 h-full flex flex-col justify-center"><div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium mb-4">Featured Event</div><h3 className="text-3xl md:text-4xl font-bold mb-4">The Grand Alumni Gala 2024</h3><p className="text-indigo-100 text-lg mb-8 max-w-xl">Join us for an evening of celebration, networking, and awards as we honor distinguished graduates.</p><div className="flex flex-col sm:flex-row gap-6 text-sm font-medium mb-8"><div className="flex items-center"><Calendar className="w-5 h-5 mr-2" /> Dec 10, 2024 • 7:00 PM</div><div className="flex items-center"><MapPin className="w-5 h-5 mr-2" /> Grand Hotel Ballroom</div></div><Button variant="secondary" className="self-start">Get Tickets</Button></div>
      </div>
      <div className="space-y-6">
        {EVENTS_DATA.map(event => (<div key={event.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:border-indigo-300 transition-colors cursor-pointer group"><div className="flex justify-between items-start mb-2"><Badge color={event.category === 'Reunion' ? 'orange' : 'blue'}>{event.category}</Badge><span className="text-xs text-slate-400 font-medium">{event.attendees} attending</span></div><h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">{event.title}</h4><div className="text-sm text-slate-500 space-y-1"><div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {event.date}</div><div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {event.location}</div></div></div>))}
        <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center">View Full Calendar <ArrowRight className="w-4 h-4 ml-2" /></button>
      </div>
    </div>
  </div>
);

const CareerSection = () => (
  <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 bg-slate-50 rounded-3xl my-8">
    <div className="flex flex-col md:flex-row justify-between items-end mb-8"><div><h2 className="text-3xl font-bold text-slate-900">Career Center</h2><p className="text-slate-500 mt-2">Exclusive job postings from alumni, for alumni.</p></div><Button>Post a Job</Button></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {JOBS_DATA.map(job => (<div key={job.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"><div className="flex justify-between items-start mb-4"><div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600"><Briefcase className="w-6 h-6" /></div><Badge color="green">{job.type}</Badge></div><h3 className="text-lg font-bold text-slate-900 mb-1">{job.title}</h3><p className="text-slate-600 font-medium text-sm mb-4">{job.company} • {job.location}</p><div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs"><span className="text-slate-400">Referral by {job.postedBy}</span><button className="text-indigo-600 font-bold hover:underline">Apply Now</button></div></div>))}
      <div className="bg-indigo-900 p-6 rounded-xl text-white flex flex-col justify-center items-center text-center"><Award className="w-12 h-12 mb-4 text-indigo-300" /><h3 className="text-lg font-bold mb-2">Need Career Advice?</h3><p className="text-indigo-200 text-sm mb-4">Connect with senior alumni for mentorship and guidance.</p><Button variant="secondary" className="w-full">Find a Mentor</Button></div>
    </div>
  </div>
);

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // Lifted State: Maintained here so it persists across page changes
  const [heroBgImage, setHeroBgImage] = useState('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80');

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return (
          <>
            <HeroSection
              setPage={setCurrentPage}
              bgImage={heroBgImage}
              setBgImage={setHeroBgImage}
            />
            <div className="bg-slate-50 py-8">
               <EventsSection />
               <CareerSection />
            </div>
          </>
        );
      case 'directory': return <DirectorySection />;
      case 'events': return <div className="bg-slate-50 py-8 min-h-screen"><EventsSection /></div>;
      case 'career': return <div className="bg-slate-50 py-8 min-h-screen"><CareerSection /></div>;
      case 'groups': return <div className="bg-slate-50 min-h-screen"><GroupsSection /></div>;
      case 'messages': return <div className="bg-slate-50 min-h-screen"><MessagingSection /></div>;
      default:
        return (
          <HeroSection
            setPage={setCurrentPage}
            bgImage={heroBgImage}
            setBgImage={setHeroBgImage}
          />
        );
    }
  };

  const NavLink = ({ page, label, icon: Icon }) => (
    <button onClick={() => { setCurrentPage(page); setMobileMenuOpen(false); }} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === page ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
      {Icon && <Icon className="w-4 h-4 mr-2" />}{label}
    </button>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="bg-indigo-600 p-1.5 rounded-lg mr-2"><GraduationCap className="h-6 w-6 text-white" /></div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">ITG Alumni</span>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <NavLink page="home" label="Home" />
              <NavLink page="directory" label="Directory" icon={Users} />
              <NavLink page="groups" label="Groups" icon={Globe} />
              <NavLink page="messages" label="Messages" icon={MessageSquare} />
              <NavLink page="events" label="Events" icon={Calendar} />
              <NavLink page="career" label="Jobs" icon={Briefcase} />
              <div className="h-6 w-px bg-slate-200 mx-2"></div>
              <Button variant="secondary" className="text-sm py-1.5" onClick={() => setIsAuthModalOpen(true)}>Sign In</Button>
            </div>
            <div className="flex items-center md:hidden"><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-500 hover:text-slate-700 p-2">{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button></div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 shadow-lg">
            <NavLink page="home" label="Home" />
            <NavLink page="directory" label="Directory" icon={Users} />
            <NavLink page="groups" label="Groups" icon={Globe} />
            <NavLink page="messages" label="Messages" icon={MessageSquare} />
            <NavLink page="events" label="Events" icon={Calendar} />
            <NavLink page="career" label="Jobs" icon={Briefcase} />
            <div className="pt-4 flex flex-col gap-2"><Button variant="secondary" className="w-full" onClick={() => { setIsAuthModalOpen(true); setMobileMenuOpen(false); }}>Sign In</Button></div>
          </div>
        )}
      </nav>
      <main className="min-h-[calc(100vh-4rem)]">{renderPage()}</main>
      <ChatWidget />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2"><div className="flex items-center mb-4"><GraduationCap className="h-6 w-6 text-indigo-400 mr-2" /><span className="text-xl font-bold text-white">ITG Alumni Connect</span></div><p className="max-w-sm text-sm">Connecting graduates, fostering relationships, and building a stronger community for Institute of Technology, Gopeshwar.</p></div>
          <div><h4 className="text-white font-bold mb-4">Quick Links</h4><ul className="space-y-2 text-sm"><li><button onClick={() => setCurrentPage('directory')} className="hover:text-white">Find Classmates</button></li><li><button onClick={() => setCurrentPage('events')} className="hover:text-white">Events Calendar</button></li><li><button onClick={() => setCurrentPage('career')} className="hover:text-white">Job Board</button></li></ul></div>
          <div><h4 className="text-white font-bold mb-4">Contact</h4><ul className="space-y-2 text-sm"><li>alumni@itgopeshwar.ac.in</li><li>+91 1372-262244</li><li className="flex gap-4 mt-4"><Heart className="w-5 h-5 hover:text-red-500 cursor-pointer transition-colors" /><Linkedin className="w-5 h-5 hover:text-blue-500 cursor-pointer transition-colors" /></li></ul></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pt-8 border-t border-slate-800 text-center text-xs">© 2024 IT Gopeshwar Alumni Portal. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default App;
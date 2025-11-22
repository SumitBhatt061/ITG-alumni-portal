import React, { useState } from 'react';
/* FIXED: Added ArrowRight to imports below */
import { Sparkles, ImageIcon, Upload, Loader2, Calendar, MapPin, Briefcase, Award, Plus, ArrowRight } from 'lucide-react';
import { Button, Badge } from '../components/ui/Shared';
import { generateAIImage } from '../services/aiService';
import { ROLES, EVENTS_DATA, JOBS_DATA } from '../data/constants';

export const HeroSection = ({ setPage, bgImage, setBgImage, user, setAuthOpen }) => {
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
    <div className="relative bg-slate-900 text-white overflow-hidden min-h-[500px] flex flex-col justify-center transition-all duration-500">
      <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: `url('${bgImage}')` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900"></div>
      <div className="absolute top-4 right-4 z-20">
        {!isEditingBg ? (
          <button onClick={() => setIsEditingBg(true)} className="flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium border border-white/20 transition-all text-white/90 hover:text-white"><Sparkles className="w-3 h-3" />Customize Background</button>
        ) : (
          <div className="bg-white p-4 rounded-xl shadow-2xl w-72 animate-in slide-in-from-top-2 duration-200 text-slate-800">
             <div className="flex justify-between items-center mb-3"><h4 className="font-bold text-sm flex items-center gap-2"><ImageIcon className="w-4 h-4 text-indigo-600" />Customize Hero</h4><button onClick={() => setIsEditingBg(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button></div>
             <div className="mb-4"><textarea className="w-full text-sm border border-slate-200 rounded-lg p-2 mb-2 h-16 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="E.g., 'University campus at night'..." value={prompt} onChange={(e) => setPrompt(e.target.value)} /><Button className="w-full text-xs py-2 h-8" onClick={handleGenerateBg} disabled={loading}>{loading ? <><Loader2 className="w-3 h-3 mr-2 animate-spin" />Generating...</> : <><Sparkles className="w-3 h-3 mr-2" />Generate AI Image</>}</Button></div>
             <div className="relative my-4"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div><div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-white px-2 text-slate-400">Or Upload Photo</span></div></div>
             <div><label className="block w-full cursor-pointer group"><input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} /><div className="w-full border-2 border-dashed border-slate-200 rounded-lg p-3 text-center group-hover:border-indigo-500 group-hover:bg-indigo-50 transition-all"><Upload className="w-5 h-5 text-slate-400 mx-auto mb-1 group-hover:text-indigo-500" /><span className="text-xs text-slate-600 font-medium block">Click to Upload</span></div></label></div>
          </div>
        )}
      </div>
      <div className="relative max-w-7xl mx-auto px-4 py-24 text-center z-10">
        <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-sm"><span className="w-2 h-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span><span className="text-sm font-medium text-indigo-200">Welcome back, ITG Alumni!</span></div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 drop-shadow-lg">Institute of Technology <br className="hidden md:block" /><span className="text-indigo-400">Gopeshwar</span></h1>
        <p className="text-lg text-slate-200 max-w-2xl mb-10 drop-shadow-md mx-auto">Join our exclusive network of graduates. Reconnect with batchmates, find mentors, and stay updated.</p>
        {!user && <div className="flex justify-center gap-4"><Button onClick={() => setAuthOpen(true)}>Login / Join</Button></div>}
        {user && user.role === ROLES.STUDENT && <Button onClick={() => setPage('student-dash')}>Go to Student Dashboard</Button>}
        {user && user.role === ROLES.ALUMNI && <Button onClick={() => setPage('alumni-dash')}>Go to Alumni Dashboard</Button>}
        {user && user.role === ROLES.ADMIN && <Button onClick={() => setPage('admin')} variant="danger">Admin Dashboard</Button>}
      </div>
    </div>
  );
};

export const GroupsPage = ({ user, groups, setGroups }) => {
  const [testModal, setTestModal] = useState(null);

  const handleGroupAction = (group) => {
      if (user.role === ROLES.ALUMNI) {
          alert('Welcome to ${group.name}. You can now post jobs here.');
      } else if (user.role === ROLES.STUDENT) {
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
              {group.jobs.length > 0 && (
                <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
                  <h4 className="text-xs font-bold text-indigo-800 uppercase mb-2">Active Jobs</h4>
                  {group.jobs.map((job, i) => <div key={i} className="text-sm text-indigo-700 truncate">• {job.title}</div>)}
                </div>
              )}
              <div className="flex gap-2 mt-auto pt-4 border-t">
                <Button onClick={() => handleGroupAction(group)} className="flex-1" variant="secondary">{user?.role === ROLES.ALUMNI ? 'Enter Group' : 'Join (Take Test)'}</Button>
                {user?.role === ROLES.ALUMNI && <Button onClick={(e) => handlePostJob(group.id, e)} icon={<Plus className="w-4 h-4" />}>Post Job</Button>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {testModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-xl max-w-md w-full animate-in zoom-in-95">
            <h3 className="text-xl font-bold mb-4">Skill Test: {testModal.tech}</h3>
            <p className="mb-6 text-slate-600">To ensure quality discussions, please answer this verification question.</p>
            <div className="bg-slate-50 p-4 rounded-lg mb-6">
                <p className="font-medium text-sm mb-3">Question: What is the primary use of {testModal.tech} in modern development?</p>
                <div className="space-y-2">
                    <button onClick={handlePassTest} className="w-full p-3 border bg-white rounded hover:bg-green-50 hover:border-green-500 text-left text-sm transition-colors">A. Building scalable applications.</button>
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

export const EventsSection = () => (
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

export const CareerSection = ({ user }) => (
  <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 bg-slate-50 rounded-3xl my-8">
    <div className="flex flex-col md:flex-row justify-between items-end mb-8">
      <div><h2 className="text-3xl font-bold text-slate-900">Career Center</h2><p className="text-slate-500 mt-2">Exclusive job postings from alumni, for alumni.</p></div>
      {user && <Button>Post a Job</Button>}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {JOBS_DATA.map(job => (<div key={job.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"><div className="flex justify-between items-start mb-4"><div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600"><Briefcase className="w-6 h-6" /></div><Badge color="green">{job.type}</Badge></div><h3 className="text-lg font-bold text-slate-900 mb-1">{job.title}</h3><p className="text-slate-600 font-medium text-sm mb-4">{job.company} • {job.location}</p><div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs"><span className="text-slate-400">Referral by {job.postedBy}</span><button className="text-indigo-600 font-bold hover:underline">Apply Now</button></div></div>))}
      <div className="bg-indigo-900 p-6 rounded-xl text-white flex flex-col justify-center items-center text-center"><Award className="w-12 h-12 mb-4 text-indigo-300" /><h3 className="text-lg font-bold mb-2">Need Career Advice?</h3><p className="text-indigo-200 text-sm mb-4">Connect with senior alumni for mentorship and guidance.</p><Button variant="secondary" className="w-full">Find a Mentor</Button></div>
    </div>
  </div>
);
import React, { useState } from 'react';
import { X, Mail, Lock, Linkedin, GraduationCap } from 'lucide-react';
import { Button } from '../ui/Shared';
import { ROLES } from '../../data/constants';

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
              <div className="space-y-3">
                <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (admin@college.edu)" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><input type="password" placeholder="Password" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              </div>
              <Button className="w-full">Sign In</Button>
              <div className="relative flex py-2 items-center"><div className="flex-grow border-t"></div><span className="mx-4 text-xs text-slate-400">OR</span><div className="flex-grow border-t"></div></div>
              <button type="button" onClick={() => setView('alumni')} className="w-full py-2 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center"><GraduationCap className="w-4 h-4 mr-2" /> Sign in as Alumni</button>
            </form>
          ) : (
            <div className="space-y-4">
              <Button variant="linkedin" className="w-full py-3" icon={<Linkedin className="w-5 h-5" />} onClick={handleLogin}>Continue with LinkedIn</Button>
              <button onClick={() => setView('standard')} className="w-full text-sm text-slate-500 hover:text-slate-800">Back to Regular Login</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

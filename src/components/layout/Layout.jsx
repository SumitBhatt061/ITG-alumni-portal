import React from 'react';
import { GraduationCap, Menu, X, Heart, Linkedin, Users, Globe, MessageSquare, Calendar, Briefcase, Shield } from 'lucide-react';
import { Button } from '../ui/Shared';
import { ROLES } from '../../data/constants';

export const Navbar = ({ user, setPage, mobileMenuOpen, setMobileMenuOpen, setAuthOpen, setUser }) => {
  const NavLink = ({ page, label, icon: Icon }) => (
    <button onClick={() => { setPage(page); setMobileMenuOpen(false); }} className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors">
      {Icon && <Icon className="w-4 h-4 mr-2" />}{label}
    </button>
  );

  return (
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
        <div className="flex items-center md:hidden"><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-500 hover:text-slate-700 p-2">{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button></div>
      </div>
      {/* Mobile Menu could be added here similarly */}
    </nav>
  );
};

export const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-auto">
    <div className="max-w-7xl mx-auto px-4 text-center text-xs">© 2024 IT Gopeshwar Alumni Portal. All rights reserved.</div>
  </footer>
);
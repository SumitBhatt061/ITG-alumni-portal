import React, { useState } from 'react';
import { Navbar, Footer } from './components/layout/Layout';
import AuthModal from './components/features/AuthModal';
import ChatWidget from './components/features/ChatWidget';
import { HeroSection, GroupsPage, EventsSection, CareerSection } from './pages/Home';
import { AdminDashboard, StudentDashboard, AlumniDashboard } from './pages/Dashboards';
import { DirectorySection, MessagingSection } from './pages/Features';
import { INITIAL_USERS, INITIAL_GROUPS, INITIAL_EVENTS, INITIAL_ANNOUNCEMENTS, ROLES } from './data/constants';

const App = () => {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [authOpen, setAuthOpen] = useState(false);

  // Global State
  const [users, setUsers] = useState(INITIAL_USERS);
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [heroBgImage, setHeroBgImage] = useState('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80');

  const renderPage = () => {
    if (page === 'admin' && user?.role === ROLES.ADMIN)
        return <AdminDashboard users={users} setUsers={setUsers} events={events} setEvents={setEvents} announcements={announcements} />;

    if (page === 'student-dash' && user?.role === ROLES.STUDENT)
        return <StudentDashboard user={user} setUser={setUser} setPage={setPage} />;

    if (page === 'alumni-dash' && user?.role === ROLES.ALUMNI)
        return <AlumniDashboard user={user} setUser={setUser} setPage={setPage} />;

    if (page === 'groups') return <GroupsPage user={user} groups={groups} setGroups={setGroups} />;

    if (page === 'messages') return user ? <div className="bg-slate-50 min-h-screen"><MessagingSection /></div> : <HeroSection setPage={setCurrentPage} bgImage={heroBgImage} setBgImage={setHeroBgImage} user={user} setAuthOpen={setAuthOpen} />;

    if (page === 'directory') return <DirectorySection />;

    // --- FIXED: Added missing routes for Events and Career ---
    if (page === 'events') return <div className="bg-slate-50 py-8 min-h-screen"><EventsSection /></div>;

    if (page === 'career') return <div className="bg-slate-50 py-8 min-h-screen"><CareerSection user={user} /></div>;

    // --- FIXED: Restored full Home Page (Hero + Content) ---
    return (
      <>
        <HeroSection setPage={setPage} bgImage={heroBgImage} setBgImage={setHeroBgImage} user={user} setAuthOpen={setAuthOpen} />
        <div className="bg-slate-50 py-8">
           <EventsSection />
           <CareerSection user={user} />
        </div>
      </>
    );
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setAuthOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar
        user={user}
        setPage={setPage}
        mobileMenuOpen={false}
        setMobileMenuOpen={() => {}}
        setAuthOpen={setAuthOpen}
        setUser={setUser}
      />
      <main className="min-h-[calc(100vh-4rem)]">{renderPage()}</main>
      <ChatWidget user={user} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onLogin={handleLogin} />
      <Footer setPage={setPage} />
    </div>
  );
};

export default App;
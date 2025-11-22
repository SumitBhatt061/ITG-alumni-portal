import React, { useState } from 'react';
import { Users, Calendar, Plus, Shield, Trash2, Activity, FileSpreadsheet, FileText, Save, MessageSquare, Briefcase, MapPin, UserCheck, Upload, FileCode, BrainCircuit, Search } from 'lucide-react';
import { Button, Badge } from '../components/ui/Shared';

export const AdminDashboard = ({ users, setUsers, events, setEvents, announcements, handleFileUpload }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [newEventTitle, setNewEventTitle] = useState('');
  const handleDeleteUser = (id) => setUsers(users.filter(u => u.id !== id));
  const handleBlockUser = (id) => setUsers(users.map(u => u.id === id ? { ...u, status: 'blocked' } : u));
  const handleAddEvent = () => { if(!newEventTitle) return; setEvents([...events, { id: Date.now(), title: newEventTitle, date: "Upcoming", location: "TBD", category: "General", attendees: 0 }]); setNewEventTitle(''); };
  const handleDeleteEvent = (id) => setEvents(events.filter(e => e.id !== id));

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

export const StudentDashboard = ({ user, setUser, setPage }) => {
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
              <div className="flex items-center gap-4"><img src={user.image} className="w-16 h-16 rounded-full border-2 border-indigo-100" /><div><h2 className="text-xl font-bold text-slate-900">{user.name}</h2><p className="text-slate-500 text-sm">{user.email}</p></div></div>
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

export const AlumniDashboard = ({ user, setUser, setPage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ job: user.job || '', location: user.location || '', openToMentor: user.openToMentor || false });
  const [resourceLink, setResourceLink] = useState('');

  const handleSave = () => { setUser({ ...user, ...formData }); setIsEditing(false); };
  const toggleMentor = () => { if(isEditing) setFormData({...formData, openToMentor: !formData.openToMentor}); };
  const handleUploadResource = () => { if(!resourceLink) return; setUser({ ...user, resources: [...(user.resources || []), { id: Date.now(), title: "Development Roadmap", link: resourceLink }] }); setResourceLink(''); alert("Resource added!"); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8"><div><h1 className="text-3xl font-bold text-slate-900">Alumni Dashboard</h1><p className="text-slate-500">Welcome back, {user.name}</p></div><Badge color="indigo">ALUMNI ACCESS</Badge></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
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
            <div className="bg-white rounded-2xl shadow-sm border p-8">
                <h3 className="font-bold text-lg mb-4 flex items-center"><BrainCircuit className="w-5 h-5 mr-2 text-indigo-600" /> Share Roadmap Resources</h3>
                <div className="flex gap-2"><input type="text" value={resourceLink} onChange={(e) => setResourceLink(e.target.value)} placeholder="Paste link..." className="flex-1 p-2 border rounded-lg text-sm" /><Button onClick={handleUploadResource} icon={<Upload className="w-4 h-4" />}>Upload</Button></div>
                {user.resources && user.resources.length > 0 && <div className="mt-4 space-y-2"><h4 className="text-xs font-bold text-slate-400 uppercase">Your Uploads</h4>{user.resources.map(res => (<div key={res.id} className="text-sm text-indigo-600 bg-indigo-50 p-2 rounded flex items-center"><FileCode className="w-4 h-4 mr-2" /> {res.title}</div>))}</div>}
            </div>
        </div>
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-6 rounded-2xl shadow-lg"><h3 className="font-bold text-lg mb-4">Quick Access</h3><ul className="space-y-3"><li><button onClick={() => setPage('groups')} className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-lg text-left flex items-center transition-colors"><Users className="w-4 h-4 mr-3" /> Tech Groups</button></li><li><button onClick={() => setPage('directory')} className="w-full bg-white/10 hover:bg-white/20 p-3 rounded-lg text-left flex items-center transition-colors"><Search className="w-4 h-4 mr-3" /> Student Directory</button></li></ul></div>
        </div>
      </div>
    </div>
  );
};

// Dummy ACTIVITY_LOGS for Dashboards.jsx to prevent reference error if not passed or imported
const ACTIVITY_LOGS = [
  { id: 1, action: "User Registered", detail: "Rahul Kumar (Student)", time: "10 mins ago" },
  { id: 2, action: "Event Posted", detail: "AI Workshop 2025", time: "1 hour ago" },
  { id: 3, action: "User Blocked", detail: "Spam Account #232", time: "3 hours ago" },
  { id: 4, action: "Bulk Import", detail: "Batch_2024.xlsx uploaded", time: "1 day ago" },
];
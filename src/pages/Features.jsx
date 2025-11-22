import React, { useState } from 'react';
import { Search, Briefcase, MapPin, Linkedin, Mail, Users, Globe, MoreVertical, Phone, Video, Send } from 'lucide-react';
import { Button, Badge } from '../components/ui/Shared';
import { ALUMNI_DATA, GROUPS_DATA, MESSAGES_DATA } from '../data/constants';

export const DirectorySection = () => {
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

export const GroupsSection = () => {
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

export const MessagingSection = () => {
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
              <div
                key={msg.id}
                onClick={() => setSelectedId(msg.id)}
                /* FIXED LINE BELOW: Added backticks */
                className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${selectedId === msg.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
              >
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
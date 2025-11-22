import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, MessageCircle, Loader2 } from 'lucide-react';
import { generateAIText } from '../../services/aiService';

const ChatWidget = ({ user }) => {
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

  // IMPORTANT: Returns null if no user is logged in
  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-indigo-600 p-4 flex justify-between items-center">
            <div className="flex items-center text-white"><Sparkles className="w-5 h-5 mr-2" /><span className="font-bold">ITG Assistant</span></div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg, idx) => (
              /* FIXED LINE BELOW: Added backticks around the className string */
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
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

export default ChatWidget;
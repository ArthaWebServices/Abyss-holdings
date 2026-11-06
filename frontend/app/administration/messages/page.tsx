'use client';
import { useEffect, useState } from 'react';
import { getMessages, markMessageRead, deleteMessage } from '@/lib/api';
import { Message } from '@/types';
import { Trash2, Mail, MailOpen } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const load = () => getMessages().then(setMessages).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const open = async (msg: Message) => {
    setSelected(msg);
    if (!msg.read) { await markMessageRead(msg.id); load(); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete message?')) return;
    await deleteMessage(id);
    if (selected?.id === id) setSelected(null);
    load();
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-dark">Messages</h1>
        <p className="text-gray-400 text-sm mt-1">
          {messages.filter(m => !m.read).length} unread · {messages.length} total
        </p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-160px)]">
        {/* List */}
        <div className="w-80 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-y-auto flex-shrink-0">
          {loading ? (
            <div className="p-4 space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm py-20">
              <Mail size={32} className="mb-3 opacity-30" />
              <p>No messages yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {messages.map(msg => (
                <button key={msg.id} onClick={() => open(msg)}
                  className={`w-full text-left px-4 py-3.5 hover:bg-gray-50 transition-colors ${selected?.id === msg.id ? 'bg-primary/5 border-r-2 border-primary' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className={`text-sm truncate ${!msg.read ? 'font-bold text-dark' : 'font-medium text-gray-600'}`}>{msg.name}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{msg.message}</p>
                    </div>
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-[10px] text-gray-300 mt-1.5">{new Date(msg.createdAt).toLocaleDateString()}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-auto">
          {selected ? (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-bold text-dark text-lg">{selected.name}</h2>
                  <p className="text-gray-400 text-sm">{selected.email}</p>
                  {selected.phone && <p className="text-gray-400 text-sm">{selected.phone}</p>}
                  <p className="text-xs text-gray-300 mt-1">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => remove(selected.id)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <a href={`mailto:${selected.email}`}
                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90">
                <Mail size={14} /> Reply via Email
              </a>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300">
              <MailOpen size={48} className="mb-3" />
              <p className="text-sm">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



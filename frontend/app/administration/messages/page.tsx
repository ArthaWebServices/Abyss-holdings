'use client';
import { useEffect, useState, useCallback } from 'react';
import { getMessages, markMessageRead, deleteMessage } from '@/lib/api';
import { Message } from '@/types';
import { Trash2, Mail, MailOpen, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

type MessagesListState =
  | { status: 'loading' }
  | { status: 'success'; messages: Message[] }
  | { status: 'error'; message: string };

type ActionState =
  | { status: 'idle' }
  | { status: 'deleting'; id: string };

export default function AdminMessagesPage() {
  const [listState, setListState] = useState<MessagesListState>({ status: 'loading' });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionState, setActionState] = useState<ActionState>({ status: 'idle' });

  const load = useCallback(async () => {
    setListState({ status: 'loading' });
    try {
      const data = await getMessages();
      setListState({ status: 'success', messages: Array.isArray(data) ? data : [] });
    } catch (err: any) {
      setListState({
        status: 'error',
        message: err?.response?.data?.error || err?.message || 'Failed to fetch messages from server',
      });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const messages = listState.status === 'success' ? listState.messages : [];
  const selected = messages.find((m) => m.id === selectedId) || null;

  const open = async (msg: Message) => {
    setSelectedId(msg.id);
    if (!msg.read) {
      // Optimistically mark as read in local explicit state
      setListState((prev) => {
        if (prev.status !== 'success') return prev;
        return {
          ...prev,
          messages: prev.messages.map((m) => (m.id === msg.id ? { ...m, read: true } : m)),
        };
      });
      try {
        await markMessageRead(msg.id);
      } catch (err) {
        console.error('Failed to mark message read on server:', err);
      }
    }
  };

  const remove = async (id: string) => {
    if (actionState.status === 'deleting') return; // Guard against concurrent deletes
    if (!confirm('Delete message?')) return;

    setActionState({ status: 'deleting', id });
    try {
      await deleteMessage(id);
      if (selectedId === id) setSelectedId(null);
      // Explicitly update message list state without full flash
      setListState((prev) => {
        if (prev.status !== 'success') return prev;
        return {
          ...prev,
          messages: prev.messages.filter((m) => m.id !== id),
        };
      });
    } catch (err: any) {
      alert(err?.response?.data?.error || err?.message || 'Failed to delete message');
    } finally {
      setActionState({ status: 'idle' });
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-dark">Messages</h1>
        <p className="text-gray-400 text-sm mt-1">
          {listState.status === 'loading'
            ? 'Loading messages…'
            : listState.status === 'error'
            ? 'Error loading messages'
            : `${messages.filter((m) => !m.read).length} unread · ${messages.length} total`}
        </p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-160px)]">
        {/* List */}
        <div className="w-80 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-y-auto flex-shrink-0">
          {listState.status === 'loading' ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : listState.status === 'error' ? (
            <div className="p-6 text-center">
              <AlertCircle size={32} className="mx-auto text-red-500 mb-2" />
              <p className="text-xs text-red-600 font-semibold mb-3">{listState.message}</p>
              <button
                onClick={load}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-all"
              >
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm py-20">
              <Mail size={32} className="mb-3 opacity-30" />
              <p>No messages yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {messages.map((msg) => {
                const isSelected = selectedId === msg.id;
                const isDeleting = actionState.status === 'deleting' && actionState.id === msg.id;
                return (
                  <button
                    key={msg.id}
                    onClick={() => open(msg)}
                    disabled={isDeleting}
                    className={`w-full text-left px-4 py-3.5 hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-primary/5 border-r-2 border-primary' : ''
                    } ${isDeleting ? 'opacity-40 pointer-events-none' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className={`text-sm truncate ${!msg.read ? 'font-bold text-dark' : 'font-medium text-gray-600'}`}>
                          {msg.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{msg.message}</p>
                      </div>
                      {!msg.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-[10px] text-gray-300 mt-1.5">{new Date(msg.createdAt).toLocaleDateString()}</p>
                  </button>
                );
              })}
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
                <button
                  onClick={() => remove(selected.id)}
                  disabled={actionState.status === 'deleting'}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40"
                  title="Delete message"
                >
                  {actionState.status === 'deleting' && actionState.id === selected.id ? (
                    <Loader2 size={18} className="animate-spin text-red-500" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <a
                href={`mailto:${selected.email}`}
                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90"
              >
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




'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getAllServices, createService, updateService, deleteService } from '@/lib/api';
import { Service } from '@/types';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

const EMPTY: Partial<Service> = { title: '', description: '', imageUrl: '', order: 1, active: true };

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const load = () => getAllServices().then(setServices).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.title || !editing?.description) return;
    setSaving(true);
    setSaveError('');
    try {
      if (editing.id) { await updateService(editing.id, editing); }
      else             { await createService(editing); }
      setEditing(null); load();
    } catch (err: any) {
      setSaveError(err?.response?.data?.error || err?.message || 'Save failed. Please try again.');
    }
    finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    await deleteService(id); load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-dark">Services</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your service offerings</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Form Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-dark text-lg">{editing.id ? 'Edit' : 'New'} Service</h2>
              <button onClick={() => setEditing(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { key: 'title',       label: 'Title *',       type: 'text' },
                { key: 'description', label: 'Description *', type: 'text' },
                { key: 'imageUrl',    label: 'Image URL or Path', type: 'text' },
                { key: 'order',       label: 'Order',         type: 'number' },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
                  <input type={type} value={(editing as any)[key] ?? ''}
                    onChange={e => setEditing(s => ({ ...s, [key]: type === 'number' ? +e.target.value : e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                </div>
              ))}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editing.active ?? true}
                  onChange={e => setEditing(s => ({ ...s, active: e.target.checked }))}
                  className="w-4 h-4 accent-primary" />
                <span className="text-sm text-gray-600">Active (visible on website)</span>
              </label>
              {/* C-2: Inline error instead of alert() */}
              {saveError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{saveError}</p>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={saving}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
                <Check size={15} />{saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['#','Image','Title','Description','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {services.map((s, i) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-xs text-gray-400">{i+1}</td>
                  <td className="px-4 py-3">
                    <div className="relative w-12 h-10 rounded-lg overflow-hidden">
                      <Image src={s.imageUrl || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=200'} alt={s.title} fill className="object-cover" sizes="48px" />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-dark text-sm">{s.title}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs max-w-xs truncate">{s.description}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {s.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(s)}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => remove(s.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {services.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">📦</p>
              <p className="text-sm">No services yet. Add your first one!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}



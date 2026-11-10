'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getProjects, createProject, updateProject, deleteProject } from '@/lib/api';
import { Project } from '@/types';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

const STATUSES = ['Ongoing', 'Completed', 'Planned'];
const CATEGORIES = ['Construction', 'Investments', 'Realities', 'Technologies', 'Automobiles', 'Earth Movers', 'Apparels', 'General'];
const EMPTY: Partial<Project> = { title: '', description: '', imageUrl: '', category: 'General', status: 'Ongoing', year: new Date().getFullYear(), order: 1 };

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const load = () => getProjects().then(setProjects).catch(() => { }).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.title) return;
    setSaving(true);
    setSaveError('');
    try {
      if (editing.id) await updateProject(editing.id, editing);
      else await createProject(editing);
      setEditing(null); load();
    } catch (err: any) {
      setSaveError(err?.response?.data?.error || err?.message || 'Save failed. Please try again.');
    }
    finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await deleteProject(id); load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-dark">Projects</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your project portfolio</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-dark text-lg">{editing.id ? 'Edit' : 'New'} Project</h2>
              <button onClick={() => setEditing(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Title *</label>
                <input type="text" value={editing.title ?? ''}
                  onChange={e => setEditing(p => ({ ...p, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Description</label>
                <textarea rows={3} value={editing.description ?? ''}
                  onChange={e => setEditing(p => ({ ...p, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Image URL or Path</label>
                <input type="text" value={editing.imageUrl ?? ''}
                  onChange={e => setEditing(p => ({ ...p, imageUrl: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Category</label>
                  <select value={editing.category ?? 'General'}
                    onChange={e => setEditing(p => ({ ...p, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Status</label>
                  <select value={editing.status ?? 'Ongoing'}
                    onChange={e => setEditing(p => ({ ...p, status: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Year</label>
                  <input type="number" value={editing.year ?? new Date().getFullYear()}
                    onChange={e => setEditing(p => ({ ...p, year: +e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Order</label>
                  <input type="number" value={editing.order ?? 1}
                    onChange={e => setEditing(p => ({ ...p, order: +e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
              </div>
            </div>
            {/* C-2: Inline error instead of alert() */}
            {saveError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-3">{saveError}</p>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500">Cancel</button>
              <button onClick={save} disabled={saving}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
                <Check size={15} />{saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-4">{[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(p => (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="relative h-40">
                <Image src={p.imageUrl || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600'} alt={p.title} fill className="object-cover" sizes="600px" />
                <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    p.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>{p.status}</span>
              </div>
              <div className="p-4">
                <p className="text-xs text-primary font-semibold">{p.category} · {p.year}</p>
                <p className="font-bold text-dark mt-1 text-sm">{p.title}</p>
                <p className="text-gray-400 text-xs mt-1 line-clamp-2">{p.description}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setEditing(p)} className="flex items-center gap-1 px-3 py-1.5 text-xs text-primary border border-primary/30 rounded-lg hover:bg-primary/5"><Pencil size={12} /> Edit</button>
                  <button onClick={() => remove(p.id)} className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50"><Trash2 size={12} /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



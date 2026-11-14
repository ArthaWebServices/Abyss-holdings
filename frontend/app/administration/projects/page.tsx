'use client';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { getProjects, createProject, updateProject, deleteProject } from '@/lib/api';
import { Project } from '@/types';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

const STATUSES = ['Ongoing', 'Completed', 'Planned'];
const CATEGORIES = ['Construction', 'Investments', 'Realities', 'Technologies', 'Automobiles', 'Earth Movers', 'Apparels', 'General'];
const EMPTY: Partial<Project> = { title: '', description: '', imageUrl: '', category: 'General', status: 'Ongoing', year: new Date().getFullYear(), order: 1 };

/**
 * Explicit Finite State Machine for Projects Administration.
 * Replaces uncoordinated boolean flags (loading, editing, saving, saveError) with discrete state models.
 */
type ListState =
  | { status: 'loading' }
  | { status: 'success'; items: Project[] }
  | { status: 'error'; message: string };

type ModalState =
  | { mode: 'closed' }
  | { mode: 'editing'; draft: Partial<Project>; isSaving: boolean; error: string | null };

export default function AdminProjectsPage() {
  const [listState, setListState] = useState<ListState>({ status: 'loading' });
  const [modalState, setModalState] = useState<ModalState>({ mode: 'closed' });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setListState((prev) => (prev.status === 'success' ? prev : { status: 'loading' }));
    getProjects()
      .then((items) => setListState({ status: 'success', items }))
      .catch((err) => setListState({ status: 'error', message: err?.message || 'Failed to load projects' }));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setModalState({ mode: 'editing', draft: { ...EMPTY }, isSaving: false, error: null });
  };

  const openEdit = (p: Project) => {
    setModalState({ mode: 'editing', draft: { ...p }, isSaving: false, error: null });
  };

  const closeModal = () => {
    setModalState({ mode: 'closed' });
  };

  const updateDraft = (key: string, value: any) => {
    setModalState((prev) => {
      if (prev.mode !== 'editing') return prev;
      return {
        ...prev,
        draft: { ...prev.draft, [key]: value },
        error: null,
      };
    });
  };

  const save = async () => {
    if (modalState.mode !== 'editing' || modalState.isSaving) return;
    const { draft } = modalState;
    if (!draft.title?.trim()) {
      setModalState((prev) =>
        prev.mode === 'editing'
          ? { ...prev, error: 'Project title is required.' }
          : prev
      );
      return;
    }

    setModalState((prev) =>
      prev.mode === 'editing' ? { ...prev, isSaving: true, error: null } : prev
    );

    try {
      if (draft.id) {
        await updateProject(draft.id, draft);
      } else {
        await createProject(draft);
      }
      setModalState({ mode: 'closed' });
      load();
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.error || err?.message || 'Save failed. Please try again.';
      setModalState((prev) =>
        prev.mode === 'editing' ? { ...prev, isSaving: false, error: errorMsg } : prev
      );
    }
  };

  const remove = async (id: string) => {
    if (deletingId) return;
    if (!confirm('Delete this project?')) return;
    setDeletingId(id);
    try {
      await deleteProject(id);
      load();
    } finally {
      setDeletingId(null);
    }
  };

  const projects = listState.status === 'success' ? listState.items : [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-dark">Projects</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your project portfolio</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Form Modal with Explicit Modal State */}
      {modalState.mode === 'editing' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-dark text-lg">
                {modalState.draft.id ? 'Edit' : 'New'} Project
              </h2>
              <button onClick={closeModal} disabled={modalState.isSaving}>
                <X size={20} className="text-gray-400 hover:text-dark transition-colors" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Title *</label>
                <input
                  type="text"
                  value={modalState.draft.title ?? ''}
                  disabled={modalState.isSaving}
                  onChange={(e) => updateDraft('title', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Description</label>
                <textarea
                  rows={3}
                  value={modalState.draft.description ?? ''}
                  disabled={modalState.isSaving}
                  onChange={(e) => updateDraft('description', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Image URL or Path</label>
                <input
                  type="text"
                  value={modalState.draft.imageUrl ?? ''}
                  disabled={modalState.isSaving}
                  onChange={(e) => updateDraft('imageUrl', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Category</label>
                  <select
                    value={modalState.draft.category ?? 'General'}
                    disabled={modalState.isSaving}
                    onChange={(e) => updateDraft('category', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Status</label>
                  <select
                    value={modalState.draft.status ?? 'Ongoing'}
                    disabled={modalState.isSaving}
                    onChange={(e) => updateDraft('status', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50"
                  >
                    {STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Year</label>
                  <input
                    type="number"
                    value={modalState.draft.year ?? new Date().getFullYear()}
                    disabled={modalState.isSaving}
                    onChange={(e) => updateDraft('year', +e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Order</label>
                  <input
                    type="number"
                    value={modalState.draft.order ?? 1}
                    disabled={modalState.isSaving}
                    onChange={(e) => updateDraft('order', +e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50"
                  />
                </div>
              </div>

              {modalState.error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 animate-in fade-in duration-150">
                  {modalState.error}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={closeModal}
                disabled={modalState.isSaving}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={modalState.isSaving}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/20"
              >
                <Check size={15} />
                {modalState.isSaving ? 'Saving…' : 'Save Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {listState.status === 'loading' ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : listState.status === 'error' ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600 text-sm">
          <p>{listState.message}</p>
          <button
            onClick={load}
            className="mt-3 px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:opacity-90"
          >
            Retry Loading
          </button>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 text-gray-400 text-sm">
          No projects registered yet. Click &quot;Add Project&quot; above to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => {
            const isDeleting = deletingId === p.id;
            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-200 ${
                  isDeleting ? 'opacity-40 pointer-events-none' : ''
                }`}
              >
                <div className="relative h-40 bg-gray-100">
                  <Image
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600'}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="600px"
                  />
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : p.status === 'Ongoing'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs text-primary font-semibold">
                    {p.category} · {p.year}
                  </p>
                  <p className="font-bold text-dark mt-1 text-sm">{p.title}</p>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-2">{p.description}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => openEdit(p)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      disabled={isDeleting}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

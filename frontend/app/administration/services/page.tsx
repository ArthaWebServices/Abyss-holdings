'use client';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { getAllServices, createService, updateService, deleteService } from '@/lib/api';
import { Service } from '@/types';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

const EMPTY: Partial<Service> = { title: '', description: '', imageUrl: '', active: true, order: 1 };

/**
 * Explicit Finite State Machine for Services Administration.
 * Replaces loose booleans (loading, editing, saving, saveError) with discrete state models.
 */
type ListState =
  | { status: 'loading' }
  | { status: 'success'; items: Service[] }
  | { status: 'error'; message: string };

type ModalState =
  | { mode: 'closed' }
  | { mode: 'editing'; draft: Partial<Service>; isSaving: boolean; error: string | null };

export default function AdminServicesPage() {
  const [listState, setListState] = useState<ListState>({ status: 'loading' });
  const [modalState, setModalState] = useState<ModalState>({ mode: 'closed' });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setListState((prev) => (prev.status === 'success' ? prev : { status: 'loading' }));
    getAllServices()
      .then((items) => setListState({ status: 'success', items }))
      .catch((err) => setListState({ status: 'error', message: err?.message || 'Failed to load services' }));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setModalState({ mode: 'editing', draft: { ...EMPTY }, isSaving: false, error: null });
  };

  const openEdit = (service: Service) => {
    setModalState({ mode: 'editing', draft: { ...service }, isSaving: false, error: null });
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
    if (!draft.title?.trim() || !draft.description?.trim()) {
      setModalState((prev) =>
        prev.mode === 'editing'
          ? { ...prev, error: 'Title and description are required fields.' }
          : prev
      );
      return;
    }

    setModalState((prev) =>
      prev.mode === 'editing' ? { ...prev, isSaving: true, error: null } : prev
    );

    try {
      if (draft.id) {
        await updateService(draft.id, draft);
      } else {
        await createService(draft);
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
    if (!confirm('Delete this service?')) return;
    setDeletingId(id);
    try {
      await deleteService(id);
      load();
    } finally {
      setDeletingId(null);
    }
  };

  const services = listState.status === 'success' ? listState.items : [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-dark">Services</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your service offerings</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Form Modal with Explicit Modal State */}
      {modalState.mode === 'editing' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-dark text-lg">
                {modalState.draft.id ? 'Edit' : 'New'} Service
              </h2>
              <button onClick={closeModal} disabled={modalState.isSaving}>
                <X size={20} className="text-gray-400 hover:text-dark transition-colors" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { key: 'title', label: 'Title *', type: 'text' },
                { key: 'description', label: 'Description *', type: 'text' },
                { key: 'imageUrl', label: 'Image URL or Path', type: 'text' },
                { key: 'order', label: 'Order', type: 'number' },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
                  <input
                    type={type}
                    value={(modalState.draft as any)[key] ?? ''}
                    disabled={modalState.isSaving}
                    onChange={(e) =>
                      updateDraft(key, type === 'number' ? +e.target.value : e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50 transition-all"
                  />
                </div>
              ))}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={modalState.draft.active ?? true}
                  disabled={modalState.isSaving}
                  onChange={(e) => updateDraft('active', e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm text-gray-600">Active (visible on website)</span>
              </label>

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
                {modalState.isSaving ? 'Saving…' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {listState.status === 'loading' ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
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
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['#', 'Image', 'Title', 'Description', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {services.map((s, i) => {
                const isDeleting = deletingId === s.id;
                return (
                  <tr
                    key={s.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      isDeleting ? 'opacity-40 pointer-events-none' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-xs text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={s.imageUrl || 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=200'}
                          alt={s.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-dark text-sm">{s.title}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs max-w-xs truncate">{s.description}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {s.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="Edit service"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => remove(s.id)}
                          disabled={isDeleting}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete service"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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

'use client';
import { useEffect, useState, useCallback } from 'react';
import { getLocations, createLocation, updateLocation, deleteLocation } from '@/lib/api';
import { Location } from '@/types';
import { Plus, Pencil, Trash2, X, Check, Star } from 'lucide-react';

const EMPTY: Partial<Location> = { country: '', city: '', address: '', phone: '', email: '', isHeadquarter: false, order: 1 };

/**
 * Explicit Finite State Machine for Locations CRUD Management.
 * Replaces uncoordinated boolean flags (loading, editing, saving, saveError)
 * with mutually exclusive state models that eliminate impossible states.
 */
type ListState =
  | { status: 'loading' }
  | { status: 'success'; items: Location[] }
  | { status: 'error'; message: string };

type ModalState =
  | { mode: 'closed' }
  | { mode: 'editing'; draft: Partial<Location>; isSaving: boolean; error: string | null };

export default function AdminLocationsPage() {
  const [listState, setListState] = useState<ListState>({ status: 'loading' });
  const [modalState, setModalState] = useState<ModalState>({ mode: 'closed' });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setListState((prev) => (prev.status === 'success' ? prev : { status: 'loading' }));
    getLocations()
      .then((items) => setListState({ status: 'success', items }))
      .catch((err) => setListState({ status: 'error', message: err?.message || 'Failed to load locations' }));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setModalState({ mode: 'editing', draft: { ...EMPTY }, isSaving: false, error: null });
  };

  const openEdit = (loc: Location) => {
    setModalState({ mode: 'editing', draft: { ...loc }, isSaving: false, error: null });
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
        error: null, // Clear error on user edit
      };
    });
  };

  const save = async () => {
    if (modalState.mode !== 'editing' || modalState.isSaving) return;
    const { draft } = modalState;
    if (!draft.country?.trim() || !draft.city?.trim()) {
      setModalState((prev) =>
        prev.mode === 'editing'
          ? { ...prev, error: 'Country and City are required fields.' }
          : prev
      );
      return;
    }

    setModalState((prev) =>
      prev.mode === 'editing' ? { ...prev, isSaving: true, error: null } : prev
    );

    try {
      if (draft.id) {
        await updateLocation(draft.id, draft);
      } else {
        await createLocation(draft);
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
    if (deletingId) return; // Prevent concurrent delete operations
    if (!confirm('Delete this location?')) return;
    setDeletingId(id);
    try {
      await deleteLocation(id);
      load();
    } finally {
      setDeletingId(null);
    }
  };

  const FIELDS = [
    { key: 'country', label: 'Country *' },
    { key: 'city',    label: 'City *' },
    { key: 'address', label: 'Address' },
    { key: 'phone',   label: 'Phone' },
    { key: 'email',   label: 'Email' },
    { key: 'order',   label: 'Order', type: 'number' },
  ];

  const items = listState.status === 'success' ? listState.items : [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-dark">Locations</h1>
          <p className="text-gray-400 text-sm mt-1">Manage office locations worldwide</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
        >
          <Plus size={16} /> Add Location
        </button>
      </div>

      {/* Form Modal with Explicit Modal State */}
      {modalState.mode === 'editing' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-dark text-lg">
                {modalState.draft.id ? 'Edit' : 'New'} Location
              </h2>
              <button onClick={closeModal} disabled={modalState.isSaving}>
                <X size={20} className="text-gray-400 hover:text-dark transition-colors" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {FIELDS.map(({ key, label, type = 'text' }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
                  <input
                    type={type}
                    value={(modalState.draft as any)[key] ?? ''}
                    disabled={modalState.isSaving}
                    onChange={(e) =>
                      updateDraft(key, type === 'number' ? +e.target.value : e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50 transition-all"
                  />
                </div>
              ))}
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-4">
              <input
                type="checkbox"
                checked={modalState.draft.isHeadquarter ?? false}
                disabled={modalState.isSaving}
                onChange={(e) => updateDraft('isHeadquarter', e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-gray-600">Mark as Headquarters</span>
            </label>

            {modalState.error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-3 animate-in fade-in duration-150">
                {modalState.error}
              </p>
            )}

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
                {modalState.isSaving ? 'Saving…' : 'Save Location'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {listState.status === 'loading' ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
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
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 text-gray-400 text-sm">
          No office locations registered yet. Click &quot;Add Location&quot; above to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((loc) => {
            const isDeleting = deletingId === loc.id;
            return (
              <div
                key={loc.id}
                className={`bg-white rounded-2xl p-5 border shadow-sm transition-all duration-200 ${
                  loc.isHeadquarter ? 'border-primary' : 'border-gray-100'
                } ${isDeleting ? 'opacity-40 pointer-events-none' : ''}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-dark">{loc.country}</p>
                      {loc.isHeadquarter && <Star size={12} fill="#A6192E" className="text-primary" />}
                    </div>
                    <p className="text-gray-400 text-sm">{loc.city}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(loc)}
                      className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Edit location"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => remove(loc.id)}
                      disabled={isDeleting}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete location"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-400 flex flex-col gap-1">
                  {loc.address && <span>📍 {loc.address}</span>}
                  {loc.phone && <span>📞 {loc.phone}</span>}
                  {loc.email && <span>✉️ {loc.email}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

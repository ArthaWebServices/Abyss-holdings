'use client';
import { useEffect, useState } from 'react';
import { getLocations, createLocation, updateLocation, deleteLocation } from '@/lib/api';
import { Location } from '@/types';
import { Plus, Pencil, Trash2, X, Check, Star } from 'lucide-react';

const EMPTY: Partial<Location> = { country: '', city: '', address: '', phone: '', email: '', isHeadquarter: false, order: 1 };

export default function AdminLocationsPage() {
  const [items, setItems] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Location> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => getLocations().then(setItems).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.country || !editing?.city) return;
    setSaving(true);
    try {
      if (editing.id) await updateLocation(editing.id, editing);
      else             await createLocation(editing);
      setEditing(null); load();
    } catch { alert('Save failed'); }
    finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this location?')) return;
    await deleteLocation(id); load();
  };

  const FIELDS = [
    { key: 'country', label: 'Country *' },
    { key: 'city',    label: 'City *' },
    { key: 'address', label: 'Address' },
    { key: 'phone',   label: 'Phone' },
    { key: 'email',   label: 'Email' },
    { key: 'order',   label: 'Order', type: 'number' },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-dark">Locations</h1>
          <p className="text-gray-400 text-sm mt-1">Manage office locations worldwide</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
          <Plus size={16} /> Add Location
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-dark text-lg">{editing.id ? 'Edit' : 'New'} Location</h2>
              <button onClick={() => setEditing(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {FIELDS.map(({ key, label, type = 'text' }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
                  <input type={type} value={(editing as any)[key] ?? ''}
                    onChange={e => setEditing(l => ({ ...l, [key]: type === 'number' ? +e.target.value : e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </div>
              ))}
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-4">
              <input type="checkbox" checked={editing.isHeadquarter ?? false}
                onChange={e => setEditing(l => ({ ...l, isHeadquarter: e.target.checked }))}
                className="w-4 h-4 accent-primary" />
              <span className="text-sm text-gray-600">Mark as Headquarters</span>
            </label>
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
        <div className="grid grid-cols-2 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(loc => (
            <div key={loc.id} className={`bg-white rounded-2xl p-5 border shadow-sm ${loc.isHeadquarter ? 'border-primary' : 'border-gray-100'}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-dark">{loc.country}</p>
                    {loc.isHeadquarter && <Star size={12} fill="#E84545" className="text-primary" />}
                  </div>
                  <p className="text-gray-400 text-sm">{loc.city}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(loc)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg"><Pencil size={14} /></button>
                  <button onClick={() => remove(loc.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="text-xs text-gray-400 flex flex-col gap-1">
                {loc.address && <span>📍 {loc.address}</span>}
                {loc.phone   && <span>📞 {loc.phone}</span>}
                {loc.email   && <span>✉️ {loc.email}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



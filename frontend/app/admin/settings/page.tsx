'use client';
import { useEffect, useState } from 'react';
import { getCompany, updateCompany } from '@/lib/api';
import { Company } from '@/types';
import { Check, Palette, Globe, Phone, MapPin, Mail, Share2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getCompany().then(setCompany).catch(() => {}); }, []);

  const update = (key: string, val: any) => setCompany(c => c ? { ...c, [key]: val } : c);
  const updateSocial = (key: string, val: string) =>
    setCompany(c => c ? { ...c, socialLinks: { ...c.socialLinks, [key]: val } } : c);

  const save = async () => {
    if (!company) return;
    setSaving(true);
    try {
      await updateCompany(company);
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch { alert('Failed to save'); }
    finally { setSaving(false); }
  };

  if (!company) return (
    <div className="p-8 flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  );

  const Section = ({ title, icon: Icon, children }: any) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="font-bold text-dark text-base mb-5 flex items-center gap-2">
        <Icon size={16} className="text-primary" /> {title}
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );

  const Field = ({ label, children }: any) => (
    <div>
      <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );

  const input = (key: keyof Company, type = 'text') => (
    <input type={type} value={(company as any)[key] ?? ''}
      onChange={e => update(key, e.target.value)}
      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-dark">Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Customize your website content and branding</p>
        </div>
        <button onClick={save} disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
            ${saved ? 'bg-green-500 text-white' : 'bg-primary text-white hover:opacity-90'} disabled:opacity-60`}>
          <Check size={15} />
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Company Info */}
        <Section title="Company Information" icon={Globe}>
          <Field label="Company Name">{input('name')}</Field>
          <Field label="Tagline">{input('tagline')}</Field>
          <Field label="Description">
            <textarea rows={3} value={company.description ?? ''}
              onChange={e => update('description', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
          </Field>
          <Field label="Website">{input('website')}</Field>
        </Section>

        {/* Branding */}
        <Section title="Branding & Colors" icon={Palette}>
          <Field label="Primary Color">
            <div className="flex gap-3 items-center">
              <input type="color" value={company.primaryColor ?? '#E84545'}
                onChange={e => update('primaryColor', e.target.value)}
                className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-1" />
              <input type="text" value={company.primaryColor ?? '#E84545'}
                onChange={e => update('primaryColor', e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
          </Field>
          <Field label="Secondary Color">
            <div className="flex gap-3 items-center">
              <input type="color" value={company.secondaryColor ?? '#1a1a2e'}
                onChange={e => update('secondaryColor', e.target.value)}
                className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-1" />
              <input type="text" value={company.secondaryColor ?? '#1a1a2e'}
                onChange={e => update('secondaryColor', e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
          </Field>
          <Field label="Logo URL (optional)">{input('logoUrl')}</Field>
          {/* Preview */}
          <div className="mt-2 p-4 rounded-xl bg-gray-50">
            <p className="text-xs text-gray-400 mb-2">Color Preview</p>
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-lg shadow" style={{ background: company.primaryColor }} />
              <div className="w-10 h-10 rounded-lg shadow" style={{ background: company.secondaryColor }} />
            </div>
          </div>
        </Section>

        {/* Contact */}
        <Section title="Contact Details" icon={Phone}>
          <Field label="Phone">{input('phone', 'tel')}</Field>
          <Field label="Email">{input('email', 'email')}</Field>
          <Field label="Address">{input('address')}</Field>
        </Section>

        {/* Social */}
        <Section title="Social Links" icon={Share2}>
          {['facebook','instagram','twitter','linkedin'].map(key => (
            <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
              <input type="url" value={(company.socialLinks as any)?.[key] ?? ''}
                onChange={e => updateSocial(key, e.target.value)}
                placeholder={`https://${key}.com/abyssholdings`}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
            </Field>
          ))}
        </Section>
      </div>
    </div>
  );
}


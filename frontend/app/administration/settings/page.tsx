'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { getCompany, updateCompany } from '@/lib/api';
import { Company } from '@/types';
import {
  Check, AlertCircle, Loader2, Palette, Globe,
  Phone, Share2, RefreshCw, Wifi, WifiOff
} from 'lucide-react';

type SettingsState =
  | { status: 'loading' }
  | {
      status: 'ready';
      company: Company;
      original: Company;
      saveStatus: 'idle' | 'saving' | 'saved' | 'save_error';
      saveError?: string;
    }
  | { status: 'error'; message: string };

export default function AdminSettingsPage() {
  const [state, setState] = useState<SettingsState>({ status: 'loading' });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  // ── Load company data ─────────────────────────────────────────
  const load = useCallback(async () => {
    clearTimer();
    setState({ status: 'loading' });
    try {
      const data = await getCompany();
      setState({
        status: 'ready',
        company: data,
        original: data,
        saveStatus: 'idle',
      });
    } catch (err: any) {
      setState({
        status: 'error',
        message:
          err?.response?.data?.error ||
          err?.message ||
          'Cannot reach API server. Please make sure the server is running.',
      });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ── Field updaters ────────────────────────────────────────────
  const update = (key: keyof Company, val: any) => {
    setState((prev) => {
      if (prev.status !== 'ready') return prev;
      return {
        ...prev,
        company: { ...prev.company, [key]: val },
        saveStatus: prev.saveStatus === 'save_error' ? 'idle' : prev.saveStatus,
      };
    });
  };

  const updateSocial = (key: string, val: string) => {
    setState((prev) => {
      if (prev.status !== 'ready') return prev;
      return {
        ...prev,
        company: {
          ...prev.company,
          socialLinks: { ...prev.company.socialLinks, [key]: val },
        },
        saveStatus: prev.saveStatus === 'save_error' ? 'idle' : prev.saveStatus,
      };
    });
  };

  // ── Save ──────────────────────────────────────────────────────
  const save = async () => {
    if (state.status !== 'ready' || state.saveStatus === 'saving') return;
    clearTimer();
    const currentCompany = state.company;

    setState((prev) => (prev.status === 'ready' ? { ...prev, saveStatus: 'saving', saveError: undefined } : prev));

    try {
      const result = await updateCompany(currentCompany);
      const saved = result?.company ?? result ?? currentCompany;
      setState((prev) =>
        prev.status === 'ready'
          ? {
              ...prev,
              company: saved,
              original: saved,
              saveStatus: 'saved',
              saveError: undefined,
            }
          : prev
      );
      timerRef.current = setTimeout(() => {
        setState((prev) => (prev.status === 'ready' && prev.saveStatus === 'saved' ? { ...prev, saveStatus: 'idle' } : prev));
      }, 3000);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Save failed. Check that the backend is running and you are logged in.';
      setState((prev) =>
        prev.status === 'ready'
          ? {
              ...prev,
              saveStatus: 'save_error',
              saveError: msg,
            }
          : prev
      );
      timerRef.current = setTimeout(() => {
        setState((prev) =>
          prev.status === 'ready' && prev.saveStatus === 'save_error' ? { ...prev, saveStatus: 'idle' } : prev
        );
      }, 5000);
    }
  };

  // ── Discard changes ───────────────────────────────────────────
  const discard = () => {
    clearTimer();
    setState((prev) => {
      if (prev.status !== 'ready') return prev;
      return {
        ...prev,
        company: { ...prev.original },
        saveStatus: 'idle',
        saveError: undefined,
      };
    });
  };

  // ── UI Helpers ────────────────────────────────────────────────
  const inputCls =
    'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white';

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wider">{label}</label>
      {children}
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

  // ── Loading state ─────────────────────────────────────────────
  if (state.status === 'loading') {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 size={32} className="animate-spin text-primary" />
        <p className="text-gray-400 text-sm">Loading company data…</p>
      </div>
    );
  }

  // ── Error / offline state ─────────────────────────────────────
  if (state.status === 'error') {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-lg">
          <div className="flex items-start gap-3">
            <WifiOff size={20} className="text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-red-700 mb-1">Cannot load company data</p>
              <p className="text-sm text-red-600 mb-4">{state.message}</p>
              <div className="bg-red-100 rounded-xl p-3 text-xs text-red-700 font-mono mb-4">
                Make sure the API server is running and reachable.
              </div>
              <button
                onClick={load}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition-all"
              >
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { company, original, saveStatus, saveError } = state;
  const isDirty = JSON.stringify(company) !== JSON.stringify(original);

  return (
    <div className="p-8">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-dark">Company Settings</h1>
          <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
            Customize your website content and branding
            <span className="inline-flex items-center gap-1 text-green-600 text-xs">
              <Wifi size={11} /> Backend online
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isDirty && (
            <button
              onClick={discard}
              disabled={saveStatus === 'saving'}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Discard
            </button>
          )}
          <button
            onClick={save}
            disabled={saveStatus === 'saving' || !isDirty}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed
              ${
                saveStatus === 'saved'
                  ? 'bg-green-500 text-white'
                  : saveStatus === 'save_error'
                  ? 'bg-red-500 text-white'
                  : 'bg-primary text-white hover:opacity-90'
              }`}
          >
            {saveStatus === 'saving' ? (
              <Loader2 size={15} className="animate-spin" />
            ) : saveStatus === 'saved' ? (
              <Check size={15} />
            ) : saveStatus === 'save_error' ? (
              <AlertCircle size={15} />
            ) : (
              <Check size={15} />
            )}
            {saveStatus === 'saving'
              ? 'Saving…'
              : saveStatus === 'saved'
              ? 'Saved!'
              : saveStatus === 'save_error'
              ? 'Failed!'
              : isDirty
              ? 'Save Changes'
              : 'No Changes'}
          </button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {saveStatus === 'save_error' && saveError && (
        <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">Save failed</p>
            <p className="text-xs text-red-600 mt-0.5">{saveError}</p>
          </div>
        </div>
      )}

      {/* ── Success banner ── */}
      {saveStatus === 'saved' && (
        <div className="mb-5 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <Check size={18} className="text-green-500" />
          <p className="text-sm font-semibold text-green-700">Company details saved successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* ── Company Info ── */}
        <Section title="Company Information" icon={Globe}>
          <Field label="Company Name">
            <input type="text" value={company.name ?? ''}
              onChange={e => update('name', e.target.value)}
              placeholder="Abyss Holdings"
              className={inputCls} />
          </Field>
          <Field label="Tagline">
            <input type="text" value={company.tagline ?? ''}
              onChange={e => update('tagline', e.target.value)}
              placeholder="Group of Companies"
              className={inputCls} />
          </Field>
          <Field label="Description">
            <textarea rows={4} value={company.description ?? ''}
              onChange={e => update('description', e.target.value)}
              placeholder="A diversified group of companies…"
              className={`${inputCls} resize-none`} />
          </Field>
          <Field label="Website URL">
            <input type="text" value={company.website ?? ''}
              onChange={e => update('website', e.target.value)}
              placeholder="abyssholding.com"
              className={inputCls} />
          </Field>
        </Section>

        {/* ── Branding ── */}
        <Section title="Branding & Colors" icon={Palette}>
          <Field label="Primary Color">
            <div className="flex gap-3 items-center">
              <input type="color" value={company.primaryColor ?? '#E84545'}
                onChange={e => update('primaryColor', e.target.value)}
                className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-1 shrink-0" />
              <input type="text" value={company.primaryColor ?? '#E84545'}
                onChange={e => update('primaryColor', e.target.value)}
                placeholder="#E84545"
                className={inputCls} />
            </div>
          </Field>
          <Field label="Secondary Color">
            <div className="flex gap-3 items-center">
              <input type="color" value={company.secondaryColor ?? '#1a1a2e'}
                onChange={e => update('secondaryColor', e.target.value)}
                className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-1 shrink-0" />
              <input type="text" value={company.secondaryColor ?? '#1a1a2e'}
                onChange={e => update('secondaryColor', e.target.value)}
                placeholder="#1a1a2e"
                className={inputCls} />
            </div>
          </Field>
          <Field label="Logo URL (optional)">
            <input type="text" value={company.logoUrl ?? ''}
              onChange={e => update('logoUrl', e.target.value)}
              placeholder="https://…/logo.png or /images/logo.png"
              className={inputCls} />
          </Field>
          {/* Color preview */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-xs text-gray-400 mb-2 font-medium">Live Preview</p>
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-xl shadow-sm border border-white/50"
                style={{ background: company.primaryColor }} />
              <div className="w-12 h-12 rounded-xl shadow-sm border border-white/50"
                style={{ background: company.secondaryColor }} />
              <div className="text-xs text-gray-500">
                <p>Primary: <span className="font-mono">{company.primaryColor}</span></p>
                <p>Secondary: <span className="font-mono">{company.secondaryColor}</span></p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Contact Details ── */}
        <Section title="Contact Details" icon={Phone}>
          <Field label="Main Phone">
            <input type="tel" value={company.phone ?? ''}
              onChange={e => update('phone', e.target.value)}
              placeholder="+91 22 1234 5678"
              className={inputCls} />
          </Field>
          <Field label="Admin Email">
            <input type="email" value={company.email ?? ''}
              onChange={e => update('email', e.target.value)}
              placeholder="Admin@abyssholding.com"
              className={inputCls} />
          </Field>
          <Field label="HQ Address">
            <input type="text" value={company.address ?? ''}
              onChange={e => update('address', e.target.value)}
              placeholder="Mumbai, Maharashtra, India"
              className={inputCls} />
          </Field>
        </Section>

        {/* ── Social Links ── */}
        <Section title="Social Media Links" icon={Share2}>
          {(['facebook', 'instagram', 'twitter', 'linkedin', 'youtube'] as const).map(key => (
            <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
              <input type="url"
                value={(company.socialLinks as any)?.[key] ?? ''}
                onChange={e => updateSocial(key, e.target.value)}
                placeholder={`https://${key}.com/abyssholdings`}
                className={inputCls} />
            </Field>
          ))}
        </Section>

      </div>

      {/* ── Bottom save bar (always visible when dirty) ── */}
      {isDirty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-dark text-white rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-4">
          <span className="text-sm">You have unsaved changes</span>
          <button onClick={discard}
            className="text-sm text-gray-400 hover:text-white transition-all">Discard</button>
          <button onClick={save} disabled={saveStatus === 'saving'}
            className="bg-primary text-white px-4 py-1.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-60">
            {saveStatus === 'saving'
              ? <><Loader2 size={13} className="animate-spin" /> Saving…</>
              : <><Check size={13} /> Save Now</>}
          </button>
        </div>
      )}
    </div>
  );
}

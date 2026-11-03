'use client';
import { useState } from 'react';
import { sendMessage } from '@/lib/api';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle');
  const [err, setErr] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await sendMessage(form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
      setErr('Failed to send message. Please try again.');
    }
  };

  return (
    <>
      <section className="min-h-screen px-12 py-20 bg-white">
        <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-2">Reach Out</p>
        <h1 className="text-4xl font-black text-dark mb-10">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <h2 className="font-bold text-dark text-xl mb-6">Get In Touch</h2>
            <div className="flex flex-col gap-5">
              {[
                { icon: '📍', label: 'Address', val: 'Abu Dhabi, Mussafah, M39, UAE' },
                { icon: '📞', label: 'Phone', val: '+971 2 551 3222' },
                { icon: '✉️', label: 'Email', val: 'info@abyssholdings.com' },
              ].map(({ icon, label, val }) => (
                <div key={label} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
                    <p className="text-dark font-medium text-sm mt-0.5">{val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Locations teaser */}
            <div className="mt-8 p-5 rounded-xl bg-dark text-white">
              <p className="text-xs text-gray-400 mb-1">We're present in</p>
              <p className="font-bold text-lg">4 Countries</p>
              <p className="text-gray-300 text-sm mt-1">UAE · Saudi Arabia · UK · Bahrain</p>
            </div>
          </div>

          {/* Form */}
          <div>
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-bold text-dark text-xl mb-2">Message Sent!</h3>
                <p className="text-gray-400 text-sm mb-6">We'll get back to you shortly.</p>
                <button onClick={() => setStatus('idle')}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {[
                  { name: 'name',    label: 'Full Name *',      type: 'text',  required: true },
                  { name: 'email',   label: 'Email Address *',  type: 'email', required: true },
                  { name: 'phone',   label: 'Phone Number',     type: 'tel',   required: false },
                ].map(({ name, label, type, required }) => (
                  <div key={name}>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">{label}</label>
                    <input
                      type={type}
                      required={required}
                      value={(form as any)[name]}
                      onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder={label.replace(' *', '')}
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Message *</label>
                  <textarea
                    required rows={4}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    placeholder="How can we help you?"
                  />
                </div>
                {status === 'error' && <p className="text-red-500 text-xs">{err}</p>}
                <button type="submit" disabled={status === 'sending'}
                  className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all">
                  {status === 'sending' ? 'Sending…' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}


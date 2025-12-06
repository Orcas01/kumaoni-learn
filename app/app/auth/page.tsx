'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const sendLink = async () => {
    setMsg('Sending...');
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMsg('Error: ' + error.message);
    else setMsg('Check your email for a magic link (may appear in Supabase Auth logs in dev).');
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-3">Sign in or Sign up</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full p-3 rounded bg-gray-900 border border-gray-800" />
      <button onClick={sendLink} className="mt-3 px-4 py-2 bg-indigo-600 rounded">Send magic link</button>
      {msg && <div className="mt-3 text-sm text-gray-300">{msg}</div>}
    </div>
  );
}


'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSupabase() {
  const [info, setInfo] = useState({
    stage: 'starting',
    msg: '',
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '(no URL)',
    anonKeyPresent: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    rows: null as any,
    error: null as any,
  });

  useEffect(() => {
    (async () => {
      try {
        setInfo(p => ({ ...p, stage: 'attempting fetch', msg: 'fetching /rest/v1...' }));
        const r = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1`, { method: 'GET' });
        setInfo(p => ({ ...p, stage: 'fetch done', msg: `status ${r.status}` }));
      } catch (err) {
        setInfo(p => ({ ...p, stage: 'fetch error', error: String(err), msg: 'fetch /rest/v1 failed' }));
      }

      try {
        const { data, error } = await supabase.from('vocabulary').select('*').limit(5);
        if (error) setInfo(p => ({ ...p, stage: 'supabase returned error', error, msg: 'supabase error' }));
        else setInfo(p => ({ ...p, stage: 'success', rows: data, msg: 'fetched rows' }));
      } catch (err) {
        setInfo(p => ({ ...p, stage: 'supabase exception', error: String(err) }));
      }
    })();
  }, []);

  return (
    <div style={{ color: '#fff', background: '#111', minHeight: '100vh', padding: 20 }}>
      <h1>Debug — Supabase test</h1>
      <div><b>Stage:</b> {info.stage}</div>
      <div><b>Message:</b> {String(info.msg)}</div>
      <div><b>Supabase URL:</b> {info.url}</div>
      <div><b>Anon present:</b> {String(info.anonKeyPresent)}</div>
      <div style={{ marginTop: 12 }}><b>Rows:</b><pre>{JSON.stringify(info.rows, null, 2)}</pre></div>
      <div style={{ marginTop: 12, color: '#f88' }}><b>Error:</b><pre>{JSON.stringify(info.error, null, 2)}</pre></div>
    </div>
  );
}

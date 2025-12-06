'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LessonsPage() {
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('vocabulary').select('*').order('created_at');
      if (error) {
        console.error('Supabase error:', error);
        setWords([]);
      } else setWords(data || []);
      setLoading(false);
    })();
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'hi-IN'; // approximate; adjust later if you add custom audio
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } else alert('Speech not supported by your browser');
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Learn Kumaoni</h1>

      {loading ? (
        <div className="text-gray-300">Loading words...</div>
      ) : (
        <div className="grid gap-4">
          {words.map((w) => (
            <article key={w.id} className="bg-gray-900 rounded-md p-4 border border-gray-800">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-400">English</div>
                  <div className="text-2xl font-semibold">{w.english_word}</div>

                  <div className="mt-3 text-sm text-gray-400">Kumaoni</div>
                  <div className="text-2xl">{w.kumaoni_word}</div>

                  {w.romanization && <div className="mt-1 text-gray-300 italic">{w.romanization}</div>}
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <button onClick={() => speak(w.kumaoni_word)} className="px-3 py-1 bg-indigo-600 rounded">🔊 Play</button>
                </div>
              </div>

              {w.example_sentence && <div className="mt-3 text-gray-300">Example: {w.example_sentence}</div>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

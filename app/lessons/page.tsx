'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type VocabRow = {
  id: string;
  english_word: string;
  kumaoni_word: string;
  romanization: string | null;
  example_sentence: string | null;
};

export default function LessonsPage() {
  const [words, setWords] = useState<VocabRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('vocabulary')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
      } else {
        setWords((data as VocabRow[]) || []);
      }
      setLoading(false);
    })();
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'hi-IN'; // closest for Kumaoni
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } else {
      alert('Speech not supported in this browser.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">Kumaoni Lessons</h1>
      <p className="text-gray-300 mb-6">
        Practice basic words and phrases. Tap 🔊 to hear Kumaoni.
      </p>

      {loading && <div className="text-gray-400">Loading vocabulary...</div>}

      {!loading && words.length === 0 && (
        <div className="text-gray-400">No words yet. Add more in Supabase.</div>
      )}

      <div className="grid gap-4">
        {words.map((w) => (
          <article
            key={w.id}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div>
              <div className="text-sm uppercase tracking-wide text-gray-400">
                English
              </div>
              <div className="text-2xl font-semibold">{w.english_word}</div>

              <div className="mt-3 text-sm uppercase tracking-wide text-gray-400">
                Kumaoni
              </div>
              <div className="text-2xl">{w.kumaoni_word}</div>
              {w.romanization && (
                <div className="text-gray-300 italic mt-1">
                  {w.romanization}
                </div>
              )}

              {w.example_sentence && (
                <div className="mt-3 text-gray-200">
                  Example: {w.example_sentence}
                </div>
              )}
            </div>

            <div className="flex sm:flex-col gap-2 sm:items-end">
              <button
                onClick={() => speak(w.kumaoni_word)}
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-sm"
              >
                🔊 Play
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

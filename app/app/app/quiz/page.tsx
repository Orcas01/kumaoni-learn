'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function QuizPage() {
  const [qs, setQs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      // For now we'll create simple quiz from vocabulary: ask "Which is Kumaoni for X?"
      const { data } = await supabase.from('vocabulary').select('*').limit(5);
      setQs(data || []);
    })();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl mb-4">Quick Quiz</h1>
      <div className="text-gray-300">Quiz skeleton (we will add choices, scoring and progress soon).</div>
      <pre className="mt-4 bg-gray-900 p-3 rounded">{JSON.stringify(qs, null, 2)}</pre>
    </div>
  );
}

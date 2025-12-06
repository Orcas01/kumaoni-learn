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

type Question = {
  correct: VocabRow;
  options: VocabRow[];
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickQuestion(all: VocabRow[]): Question | null {
  if (all.length < 4) return null;

  const correctIndex = Math.floor(Math.random() * all.length);
  const correct = all[correctIndex];

  // pick 3 incorrect options
  const others = all.filter((_, idx) => idx !== correctIndex);
  const shuffledOthers = shuffle(others).slice(0, 3);

  const options = shuffle([correct, ...shuffledOthers]);
  return { correct, options };
}

export default function QuizPage() {
  const [vocab, setVocab] = useState<VocabRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('vocabulary')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error(error);
        setError(error.message);
      } else {
        setVocab((data as VocabRow[]) || []);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (vocab.length >= 4) {
      const q = pickQuestion(vocab);
      setQuestion(q);
      setSelectedId(null);
      setIsCorrect(null);
    }
  }, [vocab]);

  const handleOptionClick = (id: string) => {
    if (!question || selectedId) return; // already answered

    setSelectedId(id);
    const correct = question.correct.id === id;
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (vocab.length < 4) return;
    const q = pickQuestion(vocab);
    setQuestion(q);
    setSelectedId(null);
    setIsCorrect(null);
    setQuestionNumber((n) => n + 1);
  };

  const handleReset = () => {
    setScore(0);
    setQuestionNumber(1);
    if (vocab.length >= 4) {
      const q = pickQuestion(vocab);
      setQuestion(q);
      setSelectedId(null);
      setIsCorrect(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">Kumaoni Quiz</h1>
      <p className="text-gray-300 mb-4">
        Choose the correct Kumaoni translation for the English word.
      </p>

      <div className="flex justify-between items-center mb-4 text-sm text-gray-300">
        <div>Question #{questionNumber}</div>
        <div>Score: {score}</div>
      </div>

      {loading && <div className="text-gray-400">Loading quiz words…</div>}

      {!loading && error && (
        <div className="text-red-400">Error: {error}</div>
      )}

      {!loading && !error && vocab.length < 4 && (
        <div className="text-gray-300">
          You need at least 4 vocabulary items to play the quiz.
          <br />
          Add more words in Supabase &amp; refresh this page.
        </div>
      )}

      {!loading && !error && question && (
        <>
          <div className="mb-6">
            <div className="text-sm uppercase tracking-wide text-gray-400">
              English
            </div>
            <div className="text-2xl font-semibold">
              {question.correct.english_word}
            </div>
          </div>

          <div className="grid gap-3 mb-4">
            {question.options.map((opt) => {
              const isSelected = selectedId === opt.id;
              const isTheCorrect = question.correct.id === opt.id;

              let bg = 'bg-gray-900 hover:bg-gray-800';
              if (selectedId) {
                if (isTheCorrect) bg = 'bg-green-700';
                else if (isSelected && !isTheCorrect) bg = 'bg-red-700';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleOptionClick(opt.id)}
                  className={`w-full text-left px-4 py-3 rounded-md border border-gray-700 ${bg} transition`}
                  disabled={!!selectedId}
                >
                  <div className="text-lg">{opt.kumaoni_word}</div>
                  {opt.romanization && (
                    <div className="text-sm text-gray-300 italic">
                      {opt.romanization}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {isCorrect !== null && (
            <div className={`mb-4 text-sm ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '✅ Correct!' : `❌ Wrong. Correct answer: ${question.correct.kumaoni_word}`}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-sm"
            >
              Next question
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-md border border-gray-600 text-sm"
            >
              Reset score
            </button>
          </div>
        </>
      )}
    </div>
  );
}

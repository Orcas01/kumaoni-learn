// app/page.tsx
export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Learn Kumaoni with me 🇮🇳
        </h1>
        <p className="text-gray-300 mb-6">
          Small bite-sized lessons, Kumaoni + English pairs, and simple quizzes.
          Perfect for friends, cousins, or anyone curious about our pahadi language.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/lessons"
            className="px-6 py-3 rounded-md bg-indigo-600 hover:bg-indigo-500 transition"
          >
            Start Learning
          </a>
          <a
            href="/quiz"
            className="px-6 py-3 rounded-md border border-gray-600 hover:border-indigo-400 transition"
          >
            Try a Quick Quiz
          </a>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Built by Krishna · Powered by Next.js + Supabase
        </p>
      </div>
    </main>
  );
}

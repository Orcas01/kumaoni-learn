// components/Header.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const path = usePathname();
  return (
    <header className="bg-gray-900 text-white px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">Kumaoni Learn</Link>
        <nav className="space-x-4">
          <Link href="/lessons" className={`px-3 py-1 rounded ${path?.startsWith('/lessons') ? 'bg-gray-700' : 'hover:bg-gray-800'}`}>Lessons</Link>
          <Link href="/quiz" className={`px-3 py-1 rounded ${path?.startsWith('/quiz') ? 'bg-gray-700' : 'hover:bg-gray-800'}`}>Quiz</Link>
          <Link href="/auth" className={`px-3 py-1 rounded ${path?.startsWith('/auth') ? 'bg-gray-700' : 'hover:bg-gray-800'}`}>Sign in</Link>
        </nav>
      </div>
    </header>
  );
}

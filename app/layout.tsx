// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/components/Header';


export const metadata: Metadata = {
  title: 'Kumaoni Learn',
  description: 'Learn Kumaoni — small lessons, quizzes and practice',
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}



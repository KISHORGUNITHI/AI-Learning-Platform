import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import './globals.css';
import 'katex/dist/katex.min.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Learn AI — From First Principles',
    template: '%s | Learn AI',
  },
  description:
    'Master artificial intelligence from first principles. Clear explanations, beautiful visuals, and a structured learning path.',
  keywords: ['AI', 'machine learning', 'deep learning', 'neural networks', 'learn AI'],
  openGraph: {
    title: 'Learn AI — From First Principles',
    description: 'Master artificial intelligence from first principles.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-1 min-w-0">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

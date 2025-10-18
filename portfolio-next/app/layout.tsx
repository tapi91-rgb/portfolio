import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ChatWidget } from '@/components/chat-widget';
import { Preloader } from '@/components/preloader';

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: 'Muhammad Farid Masood Khan — Portfolio',
  description: 'Computer Science graduate & Data Science intern — AI/ML/NLP/Flutter/full‑stack.',
  applicationName: 'Portfolio',
  generator: 'Next.js 14',
  icons: [{ rel: 'icon', url: '/favicon.svg' }],
  openGraph: {
    title: 'Muhammad Farid Masood Khan — Portfolio',
    description: 'AI/ML/NLP/Flutter/full‑stack.',
    url: 'https://example.com',
    siteName: 'Portfolio',
    type: 'website',
    images: ['/og.svg']
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg text-text antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-surface px-3 py-2 rounded-xl border border-muted">Skip to content</a>
        <Preloader />
        <Navbar />
        <main id="main" className="min-h-[70vh]">
          {children}
        </main>
        <Footer />
        <ChatWidget />
        {/* Person JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Muhammad Farid Masood Khan',
              email: 'mailto:faridmasood.khan@yahoo.com',
              sameAs: [
                'https://github.com/Farid-Masood-Khan',
                'https://www.linkedin.com/in/leishu/'
              ],
              jobTitle: 'Computer Science graduate & Data Science intern',
              address: { '@type': 'PostalAddress', addressLocality: 'Sahiwal, Pakistan' }
            })
          }}
        />
      </body>
    </html>
  );
}
import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'DevShack — Pocket Developer Utility',
  description: 'Minimal, lightning-fast developer utilities toolkit with JSON formatters, YAML converters, JWT decoders, UUID and Hash generators, Regex tester, Cron schedule builders, and diff checker.',
  openGraph: {
    title: 'DevShack — Pocket Developer Utility',
    description: 'Minimal, lightning-fast developer utilities toolkit with JSON formatters, YAML converters, JWT decoders, UUID and Hash generators, Regex tester, Cron schedule builders, and diff checker.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevShack — Pocket Developer Utility',
    description: 'Minimal, lightning-fast developer utilities toolkit with JSON formatters, YAML converters, JWT decoders, UUID and Hash generators, Regex tester, Cron schedule builders, and diff checker.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

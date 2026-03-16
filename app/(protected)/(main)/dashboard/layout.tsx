import type { Metadata } from 'next';
import {
  Geist,
  Geist_Mono,
  Outfit,
  Instrument_Serif,
  Oswald,
} from 'next/font/google';
import '@/styles/globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/features/auth';

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument-serif',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
});

export const metadata: Metadata = {
  title: 'CIT Space',
  description: 'College of Industrial Technology Hub',
};

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        'font-instrument-serif',
        instrumentSerif.variable,
        oswald.variable,
      )}
    >
      <body className="antialiased">
        <AuthProvider>
          {children}

          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

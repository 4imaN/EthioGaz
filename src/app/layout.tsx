import './globals.css';
import { Outfit } from 'next/font/google';
import { cn } from '@/lib/utils';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata = {
  title: 'EthioGaz',
  description: 'Smart Gas Station Queue Management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={cn(outfit.className, "min-h-screen bg-background font-sans antialiased")}>
        {children}
      </body>
    </html>
  );
}

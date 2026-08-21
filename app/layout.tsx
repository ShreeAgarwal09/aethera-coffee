import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/auth-context';
import { WishlistProvider } from '@/contexts/wishlist-context';
import { SmoothScroll } from '@/components/site/smooth-scroll';
import { PremiumCursor } from '@/components/site/premium-cursor';
import { LoadingScreen } from '@/components/site/loading-screen';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: 'Aethera® — The Art of Coffee',
  description:
    'Aethera is a luxury coffee house crafting single-origin and reserve micro-lot coffees. Sourced at altitude, roasted with precision, delivered with intent.',
  openGraph: {
    title: 'Aethera® — The Art of Coffee',
    description: 'Luxury single-origin and reserve micro-lot coffees, sourced at altitude and roasted with precision.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background text-foreground font-sans antialiased">
        <AuthProvider>
          <WishlistProvider>
            <LoadingScreen />
            <PremiumCursor />
            <SmoothScroll>{children}</SmoothScroll>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

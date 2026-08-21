import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { AboutClient } from '@/components/site/about-client';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <AboutClient />
      </main>
      <Footer />
    </>
  );
}

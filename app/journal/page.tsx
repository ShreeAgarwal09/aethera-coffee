import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { JournalClient } from '@/components/site/journal-client';

export default function JournalPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <JournalClient />
      </main>
      <Footer />
    </>
  );
}

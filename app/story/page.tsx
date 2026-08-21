import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { StoryClient } from '@/components/site/story-client';

export default function StoryPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <StoryClient />
      </main>
      <Footer />
    </>
  );
}

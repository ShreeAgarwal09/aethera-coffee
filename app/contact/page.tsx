import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { ContactClient } from '@/components/site/contact-client';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <ContactClient />
      </main>
      <Footer />
    </>
  );
}

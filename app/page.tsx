import { Navbar } from '@/components/site/navbar';
import { Hero } from '@/components/site/hero';
import { Marquee } from '@/components/site/marquee';
import { FeaturedCollections } from '@/components/site/featured-collections';
import { BestSellers } from '@/components/site/best-sellers';
import { CoffeeExperience } from '@/components/site/coffee-experience';
import { WhyChooseUs } from '@/components/site/why-choose-us';
import { Testimonials } from '@/components/site/testimonials';
import { InstagramGallery } from '@/components/site/instagram-gallery';
import { Footer } from '@/components/site/footer';
import { supabase } from '@/lib/supabase/server';
import type { Product } from '@/lib/types';

export const revalidate = 3600;

export default async function Home() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .returns<Product[]>();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <FeaturedCollections />
        <BestSellers products={products ?? []} />
        <CoffeeExperience />
        <WhyChooseUs />
        <Testimonials />
        <InstagramGallery />
      </main>
      <Footer />
    </>
  );
}

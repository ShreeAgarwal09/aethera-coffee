import { notFound } from 'next/navigation';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { ProductDetailClient } from '@/components/site/product-detail-client';
import { supabase } from '@/lib/supabase/server';
import type { Product, Review } from '@/lib/types';

export const revalidate = 3600;

export async function generateStaticParams() {
  const { data } = await supabase.from('products').select('slug').returns<{ slug: string }[]>();
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle<Product>();

  if (!product) notFound();

  // Fetch related products (same category, excluding current)
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', product.category_id ?? '')
    .neq('id', product.id)
    .limit(4)
    .returns<Product[]>();

  // Fetch reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', product.id)
    .order('created_at', { ascending: false })
    .returns<Review[]>();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <ProductDetailClient
          product={product}
          relatedProducts={relatedProducts ?? []}
          reviews={reviews ?? []}
        />
      </main>
      <Footer />
    </>
  );
}

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';
import { IMAGES } from '@/lib/images';

const articles = [
  {
    title: 'The Geometry of Altitude: Why 1,800m Changes Everything',
    excerpt: 'A deep dive into how elevation affects the chemical composition of the coffee cherry, and why we refuse to buy below 1,800 metres.',
    category: 'Sourcing',
    date: 'March 2025',
    readTime: '8 min',
    image: IMAGES.plantation,
  },
  {
    title: 'Roasting Is Not Cooking: The Science of the Maillard Reaction',
    excerpt: 'Our head roaster breaks down the exact temperature curves that transform green beans into the aromatic complexity you taste in every cup.',
    category: 'Roasting',
    date: 'February 2025',
    readTime: '12 min',
    image: IMAGES.roasting,
  },
  {
    title: 'The Geisha Cultivar: A Field Report from Boquete, Panama',
    excerpt: 'We travelled to the highlands of Panama to visit the estate that produces our Midnight Reserve. Here is what we learned.',
    category: 'Field Notes',
    date: 'January 2025',
    readTime: '6 min',
    image: IMAGES.harvest,
  },
  {
    title: 'Brewing at Home: The Pour-Over Method, Perfected',
    excerpt: 'A step-by-step guide to achieving café-quality pour-over coffee at home, from grind size to water temperature.',
    category: 'Brewing',
    date: 'December 2024',
    readTime: '5 min',
    image: IMAGES.pour,
  },
  {
    title: 'The Last 48 Hours: From Roaster to Your Door',
    excerpt: 'Inside our roastery: a behind-the-scenes look at the precise logistics that get your coffee from our roaster to your kitchen in 48 hours.',
    category: 'Behind the Scenes',
    date: 'November 2024',
    readTime: '7 min',
    image: IMAGES.cooling,
  },
  {
    title: 'Decaf That Drinks Like the Real Thing',
    excerpt: 'How Swiss Water processing preserves the full aromatic complexity of the bean, and why our Coastal Decaf fools professional baristas.',
    category: 'Education',
    date: 'October 2024',
    readTime: '4 min',
    image: IMAGES.cupMinimal,
  },
];

export function JournalClient() {
  const [featured, ...rest] = articles;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16 text-center"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-primary">The Journal</span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] text-foreground">
          Stories from the source
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm font-light text-muted-foreground text-pretty">
          Field notes, brewing guides, and deep dives into the craft of coffee.
        </p>
      </motion.div>

      {/* Featured article */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
      >
        <Link href="#" className="group block">
          <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-card">
            <img
              src={featured.image}
              alt={featured.title}
              className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
              onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
                  {featured.category}
                </span>
                <span className="text-xs font-light text-muted-foreground">{featured.date}</span>
                <span className="flex items-center gap-1 text-xs font-light text-muted-foreground">
                  <Clock className="h-3 w-3" /> {featured.readTime}
                </span>
              </div>
              <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.5rem,3vw,3rem)] leading-tight text-foreground text-balance">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-xl text-sm font-light text-muted-foreground text-pretty">{featured.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
                Read Article <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Article grid */}
      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((article, i) => (
          <motion.div
            key={article.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
          >
            <Link href="#" className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-card">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                  onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-background/80 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-primary backdrop-blur-sm">
                  {article.category}
                </span>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-3 text-xs font-light text-muted-foreground">
                  <span>{article.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}</span>
                </div>
                <h3 className="mt-2 font-display text-2xl leading-tight text-foreground group-hover:text-primary text-balance">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm font-light text-muted-foreground line-clamp-2 text-pretty">{article.excerpt}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

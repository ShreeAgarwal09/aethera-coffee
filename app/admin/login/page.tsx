'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase/client';
import { Navbar } from '@/components/site/navbar';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    // Check admin status
    const { data: { session } } = await supabase.auth.getSession();
    const isAdmin = session?.user?.app_metadata?.role === 'admin';
    if (!isAdmin) {
      setError('This account does not have admin access.');
      await supabase.auth.signOut();
      return;
    }
    router.push('/admin');
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Admin Access</span>
          <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">Admin Sign In</h1>
          <p className="mt-3 text-sm font-light text-muted-foreground">
            Authorized personnel only. Sign in with an admin account.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="mt-2 w-full rounded-sm border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                placeholder="admin@aethera.com" />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="mt-2 w-full rounded-sm border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                placeholder="••••••••" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full rounded-sm bg-primary py-3.5 text-sm font-medium tracking-wide text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
}

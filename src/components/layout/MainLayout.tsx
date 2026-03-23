"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authStore, User } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = authStore.subscribe((state) => setUser(state.user));
    const currentUser = authStore.getState().user;
    setUser(currentUser);
    
    if (!currentUser && pathname !== '/') {
      router.push('/');
    }
    
    return unsub;
  }, [pathname, router]);

  if (!user && pathname !== '/') return null;

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'NEU';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full bg-[#0a1128]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href={user?.role === 'admin' ? '/admin' : '/visitor/welcome'} className="flex items-center gap-2">
            <span className="font-bold text-sm text-white tracking-tight uppercase">Library Visitor Log</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 bg-yellow-600 text-white border-none">
                <AvatarFallback className="bg-yellow-600 text-[10px] font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col leading-none">
                <span className="text-[10px] font-bold text-white uppercase">{user?.name}</span>
                <span className="text-[8px] text-yellow-500 font-bold uppercase tracking-tighter mt-0.5">NEU-202X-12914</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 text-[10px] font-bold uppercase border-red-500/50 text-red-400 bg-transparent hover:bg-red-500 hover:text-white transition-all rounded"
              onClick={() => {
                authStore.getState().logout();
                router.push('/');
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12">
        {children}
      </main>

      <footer className="py-8 text-center border-t border-white/5 bg-[#0a1128]/50">
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em]">&copy; {new Date().getFullYear()} NEW ERA UNIVERSITY LIBRARY</p>
      </footer>
    </div>
  );
}

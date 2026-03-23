"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authStore, User } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    const unsub = authStore.subscribe((state) => setUser(state.user));
    const currentUser = authStore.getState().user;
    setUser(currentUser);
    
    if (!currentUser && pathname !== '/') {
      router.push('/');
    }
    
    return () => {
      unsub();
      clearInterval(timer);
    };
  }, [pathname, router]);

  if (!user && pathname !== '/') return null;

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'NEU';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full bg-[#0a1128]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Time and Date Feature */}
          <div className="flex flex-col">
            {mounted && currentTime ? (
              <>
                <span className="text-xl font-mono font-bold text-white tracking-tighter leading-none">
                  {currentTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-[0.2em] mt-1">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </>
            ) : (
              <div className="h-10 w-32 animate-pulse bg-white/5 rounded" />
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-yellow-600 text-white border-2 border-yellow-600/20">
                <AvatarFallback className="bg-yellow-600 text-xs font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-bold text-white uppercase tracking-tight">{user?.name}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">NEU-INSTITUTIONAL-AUTH</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-4 text-[10px] font-bold uppercase border-red-500/40 text-red-400 bg-transparent hover:bg-red-500 hover:text-white transition-all rounded-md"
              onClick={() => {
                authStore.getState().logout();
                router.push('/');
              }}
            >
              Log Out
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

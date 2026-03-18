"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authStore, User } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, History, Users, Settings, Bell } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  const logo = PlaceHolderImages.find(img => img.id === 'neu-logo')?.imageUrl;

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

  return (
    <div className="min-h-screen flex flex-col bg-background cyber-grid">
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href={user?.role === 'admin' ? '/admin' : '/visitor/welcome'} className="flex items-center gap-4 group">
            {logo ? (
              <div className="relative w-10 h-10 p-1 rounded-xl bg-primary/10 border border-primary/20 transition-all group-hover:neon-glow">
                <Image src={logo} alt="NEU Logo" fill className="object-contain p-1.5" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-primary rounded-xl" />
            )}
            <div className="flex flex-col leading-tight">
              <span className="font-headline font-bold text-lg text-white tracking-tighter">NEU LIBRARY</span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">Future Edition</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
            {user?.role === 'admin' && (
              <>
                <NavLink href="/admin" active={pathname === '/admin'} icon={LayoutDashboard}>
                  Pulse
                </NavLink>
                <NavLink href="/admin/logs" active={pathname === '/admin/logs'} icon={History}>
                  Archives
                </NavLink>
                <NavLink href="/admin/users" active={pathname === '/admin/users'} icon={Users}>
                  Nodes
                </NavLink>
              </>
            )}
            {user?.role === 'visitor' && (
              <NavLink href="/visitor/check-in" active={pathname === '/visitor/check-in'} icon={Settings}>
                Configure
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl">
              <Bell className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="hidden sm:flex flex-col items-end leading-none">
                <span className="text-sm font-bold text-white tracking-tight">{user?.name}</span>
                <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{user?.role}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-xl text-slate-400 hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20" 
                onClick={() => {
                  authStore.getState().logout();
                  router.push('/');
                }}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12 relative">
        {/* Ambient background light */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
        {children}
      </main>

      <footer className="border-t border-white/5 bg-card/20 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold text-white tracking-tight">New Era University Library</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest">© {new Date().getFullYear()} • Institutional Data Management</p>
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <span className="hover:text-primary transition-colors cursor-pointer">Security Protocol</span>
            <span className="hover:text-primary transition-colors cursor-pointer">System Status</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Network Node</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ href, children, active, icon: Icon }: { href: string, children: React.ReactNode, active?: boolean, icon: any }) {
  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
        active 
          ? "bg-primary text-white shadow-lg neon-glow" 
          : "text-slate-400 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className="w-4 h-4" />
      {children}
    </Link>
  );
}
"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authStore, User } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, History, UserCheck, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href={user?.role === 'admin' ? '/admin' : '/visitor/welcome'} className="flex items-center gap-3">
            {logo && (
              <div className="relative w-9 h-9">
                <Image 
                  src={logo} 
                  alt="NEU Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
            )}
            <span className="font-headline font-bold text-lg text-slate-900 hidden sm:inline-block">New Era University Library</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-lg">
            {user?.role === 'admin' && (
              <>
                <NavLink href="/admin" active={pathname === '/admin'}>
                  Dashboard
                </NavLink>
                <NavLink href="/admin/logs" active={pathname === '/admin/logs'}>
                  Logs
                </NavLink>
                <NavLink href="/admin/users" active={pathname === '/admin/users'}>
                  Users
                </NavLink>
              </>
            )}
            {user?.role === 'visitor' && (
              <NavLink href="/visitor/check-in" active={pathname === '/visitor/check-in'}>
                Check-in
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end leading-none">
              <span className="text-sm font-semibold text-slate-900">{user?.name}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user?.role}</span>
            </div>
            <Button variant="ghost" size="sm" className="h-9 px-3 text-slate-500 hover:text-red-600 hover:bg-red-50" onClick={() => {
              authStore.getState().logout();
              router.push('/');
            }}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-6 py-10">
        {children}
      </main>
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} New Era University • Institutional Library System</p>
          <div className="flex gap-6">
            <span className="hover:text-primary cursor-pointer">Privacy Policy</span>
            <span className="hover:text-primary cursor-pointer">Terms of Service</span>
            <span className="hover:text-primary cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ href, children, active }: { href: string, children: React.ReactNode, active?: boolean }) {
  return (
    <Link 
      href={href}
      className={cn(
        "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
        active 
          ? "bg-white text-primary shadow-sm" 
          : "text-slate-500 hover:text-slate-900"
      )}
    >
      {children}
    </Link>
  );
}
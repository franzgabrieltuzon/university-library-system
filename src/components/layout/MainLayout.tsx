"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authStore, User } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, History, Users, Settings } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href={user?.role === 'admin' ? '/admin' : '/visitor/welcome'} className="flex items-center gap-3 group">
            <div className="flex flex-col">
              <span className="font-headline font-bold text-primary leading-none group-hover:text-blue-600 transition-colors">NEW ERA UNIVERSITY LIBRARY</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Institutional Portal</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {user?.role === 'admin' && (
              <>
                <NavLink href="/admin" active={pathname === '/admin'} icon={LayoutDashboard}>Dashboard</NavLink>
                <NavLink href="/admin/logs" active={pathname === '/admin/logs'} icon={History}>Visitor Logs</NavLink>
                <NavLink href="/admin/users" active={pathname === '/admin/users'} icon={Users}>Access Control</NavLink>
              </>
            )}
            {user?.role === 'visitor' && (
              <NavLink href="/visitor/check-in" active={pathname === '/visitor/check-in'} icon={Settings}>Check-in</NavLink>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end leading-none border-r pr-4 mr-2">
              <span className="text-sm font-bold text-slate-900">{user?.name}</span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{user?.role}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors" 
              onClick={() => {
                authStore.getState().logout();
                router.push('/');
              }}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8">
        {children}
      </main>

      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm font-bold text-slate-900">New Era University Library</p>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest">&copy; {new Date().getFullYear()} Institutional Data Management</p>
          </div>
          <div className="flex gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <span className="hover:text-primary transition-colors cursor-pointer">Security</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Contact</span>
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
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
        active 
          ? "bg-primary/10 text-primary" 
          : "text-slate-500 hover:text-primary hover:bg-slate-50"
      )}
    >
      <Icon className="w-4 h-4" />
      {children}
    </Link>
  );
}

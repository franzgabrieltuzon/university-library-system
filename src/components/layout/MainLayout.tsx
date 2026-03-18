
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
    // Initial check
    const currentUser = authStore.getState().user;
    setUser(currentUser);
    
    if (!currentUser && pathname !== '/') {
      router.push('/');
    }
    
    return unsub;
  }, [pathname, router]);

  if (!user && pathname !== '/') return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={user?.role === 'admin' ? '/admin' : '/visitor/welcome'} className="flex items-center gap-3">
            {logo && (
              <div className="relative w-10 h-10">
                <Image 
                  src={logo} 
                  alt="NEU Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
            )}
            <span className="font-headline font-bold text-xl text-primary tracking-tight">NEU Library Flow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {user?.role === 'admin' && (
              <>
                <NavLink href="/admin" active={pathname === '/admin'}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </NavLink>
                <NavLink href="/admin/logs" active={pathname === '/admin/logs'}>
                  <History className="w-4 h-4 mr-2" />
                  Visitor Logs
                </NavLink>
                <NavLink href="/admin/users" active={pathname === '/admin/users'}>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Management
                </NavLink>
              </>
            )}
            {user?.role === 'visitor' && (
              <NavLink href="/visitor/check-in" active={pathname === '/visitor/check-in'}>
                <UserCheck className="w-4 h-4 mr-2" />
                Check-in
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold">{user?.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => {
              authStore.getState().logout();
              router.push('/');
            }}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} NEU Library Flow. Designed for Era of Excellence.
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
        "flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors",
        active 
          ? "bg-primary/10 text-primary font-bold" 
          : "text-muted-foreground hover:bg-accent/10 hover:text-accent-foreground"
      )}
    >
      {children}
    </Link>
  );
}

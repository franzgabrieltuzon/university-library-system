"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authStore, User } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  LogOut, 
  Library, 
  Power,
  ChevronRight
} from 'lucide-react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);

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

  const isAdmin = user?.role === 'admin';
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'NEU';

  // Landing page layout is different
  if (pathname === '/') return <>{children}</>;

  return (
    <div className="min-h-screen flex bg-[#030712] text-slate-200">
      {/* Sidebar Navigation - Visible for Admins */}
      {isAdmin && (
        <aside className="w-64 border-r border-white/5 bg-[#0a1128] flex flex-col shrink-0">
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1.5 overflow-hidden">
                <img src="https://neu.edu.ph/main/assets/images/neu_logo_new.png" alt="NEU Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white uppercase tracking-tight leading-none">New Era University</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-tighter">Library Management</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 mt-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-3 mb-2">Navigation</p>
            <NavItem 
              href="/admin" 
              icon={LayoutDashboard} 
              label="Dashboard" 
              active={pathname === '/admin'} 
            />
            <NavItem 
              href="/admin/logs" 
              icon={Users} 
              label="Visitor Logs" 
              active={pathname === '/admin/logs'} 
            />
            <NavItem 
              href="/admin/users" 
              icon={UserCog} 
              label="User Management" 
              active={pathname === '/admin/users'} 
            />
          </nav>

          <div className="p-4 border-t border-white/5 space-y-4">
            <div className="px-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Library Status</p>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", isLibraryOpen ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                    <span className={cn("text-xs font-bold uppercase tracking-widest", isLibraryOpen ? "text-green-400" : "text-red-400")}>
                      {isLibraryOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mb-4">
                  Opened by <br />
                  <span className="text-slate-300">{user?.name}</span>
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                  className={cn(
                    "w-full h-9 text-[10px] font-bold uppercase tracking-widest bg-transparent border-white/10 hover:bg-white/5",
                    isLibraryOpen ? "text-red-400 hover:text-red-400" : "text-green-400 hover:text-green-400"
                  )}
                >
                  <Power className="w-3 h-3 mr-2" />
                  {isLibraryOpen ? "Close Library" : "Open Library"}
                </Button>
              </div>
            </div>

            <div className="bg-[#111c3a] rounded-xl p-3 border border-white/5">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-white/10">
                  <AvatarFallback className="bg-[#D4AF37] text-white text-xs font-bold">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate">{user?.name}</span>
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Admin</span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => {
                  authStore.getState().logout();
                  router.push('/');
                }}
                className="w-full mt-3 h-9 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-400/10 justify-start px-2"
              >
                <LogOut className="w-3 h-3 mr-2 rotate-180" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-white/5 bg-[#030712]/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex flex-col">
            {mounted && currentTime ? (
              <>
                <span className="text-xl font-mono font-bold text-white tracking-tighter leading-none">
                  {currentTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className="text-[9px] text-yellow-500 font-bold uppercase tracking-[0.3em] mt-1">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </>
            ) : (
              <div className="h-10 w-32 animate-pulse bg-white/5 rounded" />
            )}
          </div>

          <div className="flex items-center gap-4">
            {!isAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 px-4 text-[10px] font-bold uppercase border-white/10 text-slate-300 hover:bg-white/5"
                onClick={() => {
                  authStore.getState().logout();
                  router.push('/');
                }}
              >
                <LogOut className="w-3 h-3 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto bg-[#030712]">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active }: any) {
  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
        active 
          ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20" 
          : "text-slate-400 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className={cn("w-4 h-4 transition-colors", active ? "text-[#D4AF37]" : "text-slate-500 group-hover:text-slate-300")} />
      <span className="flex-1">{label}</span>
      {active && <ChevronRight className="w-3 h-3 opacity-50" />}
    </Link>
  );
}

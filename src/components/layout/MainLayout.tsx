
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
  Power,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

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

  const handleSignOut = () => {
    authStore.getState().logout();
    router.push('/');
  };

  if (pathname === '/') {
    return (
      <div className="bg-[#030712] text-slate-200 font-body min-h-screen relative">
        {user && (
           <div className="fixed top-6 right-6 z-[9999]">
            <Button 
              variant="ghost" 
              onClick={handleSignOut}
              className="h-12 px-5 text-slate-400 hover:bg-white/5 hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
            >
              Sign Out
            </Button>
          </div>
        )}
        {children}
      </div>
    );
  }

  if (!user) return null;

  const isAdmin = user?.role === 'admin';
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'NEU';

  return (
    <div className="min-h-screen flex bg-[#030712] text-slate-200 font-body overflow-hidden">
      {/* GLOBAL SIGN OUT BUTTON - FIXED TOP RIGHT */}
      <div className="fixed top-6 right-6 z-[9999] flex items-center gap-6">
        {mounted && currentTime && (
          <div className="flex flex-col items-end mr-4 hidden md:flex">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37] animate-pulse" />
              <span className="text-xl font-mono font-black text-white tracking-tighter tabular-nums">
                {format(currentTime, 'HH:mm:ss')}
              </span>
            </div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">
              {format(currentTime, 'EEEE, MMM dd, yyyy')}
            </span>
          </div>
        )}
      </div>

      {/* Institutional Sidebar (Admin Only) */}
      {isAdmin && (
        <aside className="w-[300px] bg-[#0a1128] border-r border-white/5 flex flex-col shrink-0 z-50">
          <div className="p-8 pb-10">
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-white uppercase tracking-[0.15em] leading-tight">New Era University</span>
              <span className="text-[9px] text-[#D4AF37] uppercase tracking-[0.2em] mt-1 font-black">Management Portal</span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <SidebarNavItem href="/admin" icon={LayoutDashboard} label="Dashboard" active={pathname === '/admin'} />
            <SidebarNavItem href="/admin/logs" icon={Users} label="Visitor Logs" active={pathname === '/admin/logs'} />
            <SidebarNavItem href="/admin/users" icon={UserCog} label="User Management" active={pathname === '/admin/users'} />
          </nav>

          <div className="p-6 space-y-4">
            <div className="space-y-4">
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] px-2">Library Status</p>
              <div className="px-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn("w-2 h-2 rounded-full", isLibraryOpen ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse" : "bg-red-500")} />
                  <span className={cn("text-xs font-black uppercase tracking-widest", isLibraryOpen ? "text-green-500" : "text-red-500")}>
                    {isLibraryOpen ? "OPEN" : "CLOSED"}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                  className="w-full h-10 text-[10px] font-bold uppercase tracking-widest bg-[#1e1e2d] border-none text-red-400 hover:bg-red-500/10 rounded-xl"
                >
                  <Power className="w-3.5 h-3.5 mr-2" />
                  {isLibraryOpen ? "Emergency Close" : "Open Library"}
                </Button>
              </div>
            </div>

            <div className="bg-[#1e1e2d]/50 rounded-2xl p-4 border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-white/10">
                  <AvatarFallback className="bg-[#D4AF37] text-slate-900 text-xs font-black">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold text-white truncate">{user?.name}</span>
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Admin</span>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="w-full h-11 text-slate-400 hover:bg-white/5 hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>
      )}

      <div className="flex-1 flex flex-col min-w-0 bg-[#030712] relative overflow-hidden">
        {!isAdmin && (
          <header className="h-24 flex items-center justify-between px-12 z-40">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                <span className="text-sm font-bold text-[#D4AF37]">{initials}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white uppercase tracking-wider">{user?.name}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Verified Access</span>
              </div>
            </div>
             <Button 
              variant="ghost" 
              onClick={handleSignOut}
              className="h-12 px-5 text-slate-400 hover:bg-white/5 hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
            >
              Sign Out
            </Button>
          </header>
        )}

        <main className={cn("flex-1 overflow-y-auto custom-scrollbar relative z-10", isAdmin ? "p-12" : "p-8")}>
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarNavItem({ href, icon: Icon, label, active }: any) {
  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-4 rounded-xl text-[11px] font-bold transition-all duration-200 group relative",
        active 
          ? "bg-[#D4AF37]/10 text-[#D4AF37]" 
          : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
      )}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#D4AF37] rounded-r-full" />}
      <Icon className={cn("w-4 h-4 transition-colors", active ? "text-[#D4AF37]" : "text-slate-500 group-hover:text-slate-300")} />
      <span className="tracking-widest uppercase">{label}</span>
    </Link>
  );
}

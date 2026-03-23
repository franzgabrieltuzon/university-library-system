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
  Clock,
  Settings,
  Library
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

  if (!user && pathname !== '/') return null;

  const isAdmin = user?.role === 'admin';
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'NEU';

  if (pathname === '/') return <>{children}</>;

  const handleSignOut = () => {
    authStore.getState().logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex bg-[#030712] text-slate-200 font-body overflow-hidden">
      {/* High-Fidelity Institutional Sidebar (Reference Image Style) */}
      {isAdmin && (
        <aside className="w-[300px] bg-[#0a1128] border-r border-white/5 flex flex-col shrink-0 z-50">
          {/* Brand Header */}
          <div className="p-8 pb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1.5 overflow-hidden">
                <img src="https://neu.edu.ph/main/assets/images/neu_logo_new.png" alt="NEU Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-white uppercase tracking-[0.1em] leading-tight">New Era University</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Library Management</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] px-4 mb-4">Navigation</p>
            <SidebarNavItem 
              href="/admin" 
              icon={LayoutDashboard} 
              label="Dashboard" 
              active={pathname === '/admin'} 
            />
            <SidebarNavItem 
              href="/admin/logs" 
              icon={Users} 
              label="Visitor Logs" 
              active={pathname === '/admin/logs'} 
            />
            <SidebarNavItem 
              href="/admin/users" 
              icon={UserCog} 
              label="User Management" 
              active={pathname === '/admin/users'} 
            />
          </nav>

          {/* Library Status (Bottom Section) */}
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] px-2">Library Status</p>
              <div className="px-2 space-y-1">
                <div className="flex items-center gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full", isLibraryOpen ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500")} />
                  <span className={cn("text-[10px] font-black uppercase tracking-widest", isLibraryOpen ? "text-green-500" : "text-red-500")}>
                    {isLibraryOpen ? "OPEN" : "CLOSED"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-500 font-medium">Opened by</span>
                  <span className="text-[9px] text-slate-400 font-bold">{user?.email || 'admin'}</span>
                  <span className="text-[8px] text-slate-600 font-medium">System Ready</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                className="w-full h-9 text-[9px] font-bold uppercase tracking-widest bg-[#1e1e2d] border-none text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all"
              >
                <Power className="w-3.5 h-3.5 mr-2" />
                {isLibraryOpen ? "Close Library" : "Open Library"}
              </Button>
            </div>

            {/* User Profile */}
            <div className="bg-[#1e1e2d]/50 rounded-2xl p-4 border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-white/10">
                  <AvatarFallback className="bg-[#D4AF37] text-slate-900 text-xs font-black">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold text-white truncate">Administrator</span>
                  <span className="text-[9px] text-slate-500 truncate leading-tight">{user?.email}</span>
                  <span className="text-[8px] text-[#D4AF37] font-black uppercase tracking-widest mt-0.5">ADMIN</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="w-full h-9 text-[9px] font-bold uppercase tracking-widest border-red-500/20 text-red-400 bg-transparent hover:bg-red-500/10 hover:border-red-500/40 rounded-lg transition-all"
              >
                <LogOut className="w-3.5 h-3.5 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#030712] relative overflow-hidden">
        {/* Real-time Clock Header & Global Actions */}
        <header className="h-20 flex items-center justify-between px-12 z-40">
          <div className="flex items-center gap-4">
            {/* Show Sign Out button in header for Students/Visitors who have no sidebar */}
            {!isAdmin && user && (
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest border-white/10 text-slate-400 bg-transparent hover:bg-white/5 hover:text-white rounded-xl transition-all"
              >
                <LogOut className="w-3.5 h-3.5 mr-2" />
                Sign Out
              </Button>
            )}
          </div>

          <div className="flex flex-col items-end">
             {mounted && currentTime ? (
              <>
                <div className="flex items-center gap-3">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37] opacity-60" />
                  <span className="text-xl font-mono font-black text-white tracking-tighter tabular-nums">
                    {format(currentTime, 'HH:mm:ss')}
                  </span>
                </div>
                <span className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-[0.3em] mt-1">
                  {format(currentTime, 'EEEE, MMMM dd, yyyy')}
                </span>
              </>
            ) : (
              <div className="h-10 w-40 animate-pulse bg-white/5 rounded-xl" />
            )}
          </div>
        </header>

        <main className="flex-1 p-12 pt-4 overflow-y-auto custom-scrollbar relative z-10">
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
        "flex items-center gap-3 px-4 py-3.5 rounded-xl text-[11px] font-bold transition-all duration-200 group relative",
        active 
          ? "bg-[#D4AF37]/10 text-[#D4AF37]" 
          : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
      )}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#D4AF37] rounded-r-full" />}
      <Icon className={cn("w-4 h-4 transition-colors", active ? "text-[#D4AF37]" : "text-slate-500 group-hover:text-slate-300")} />
      <span className="tracking-wide">{label}</span>
    </Link>
  );
}


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
  ChevronRight,
  ShieldCheck,
  Circle
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
        <aside className="w-72 border-r border-white/5 bg-[#0f172a] flex flex-col shrink-0">
          <div className="p-8 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 overflow-hidden shadow-xl">
                <img src="https://neu.edu.ph/main/assets/images/neu_logo_new.png" alt="NEU Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white uppercase tracking-tight leading-none">New Era University</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-tighter mt-1 font-medium">Library Management</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-6 space-y-2 mt-4">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] px-3 mb-4">Core Portal</p>
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

          {/* Library Status Panel */}
          <div className="p-6 border-t border-white/5 space-y-6">
            <div className="bg-[#1e293b]/50 rounded-2xl p-5 border border-white/5 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Circle className={cn("w-2 h-2 fill-current", isLibraryOpen ? "text-green-500 animate-pulse" : "text-red-500")} />
                  <span className={cn("text-[11px] font-bold uppercase tracking-widest", isLibraryOpen ? "text-green-400" : "text-red-400")}>
                    {isLibraryOpen ? "Library Open" : "Library Closed"}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed mb-4">
                Operational hours active. System is currently tracking all visitor check-ins.
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

            {/* Admin Info Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-2">
                <Avatar className="h-10 w-10 border border-white/10 shadow-lg">
                  <AvatarFallback className="bg-[#D4AF37] text-slate-900 text-xs font-bold">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate">{user?.name}</span>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-2.5 h-2.5 text-[#D4AF37]" />
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Admin Access</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => {
                  authStore.getState().logout();
                  router.push('/');
                }}
                className="w-full h-10 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-400/5 justify-start px-3 rounded-xl transition-all"
              >
                <LogOut className="w-3.5 h-3.5 mr-3 rotate-180" />
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
                  {format(currentTime, 'HH:mm:ss')}
                </span>
                <span className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-[0.3em] mt-1.5">
                  {format(currentTime, 'EEEE, MMMM dd, yyyy')}
                </span>
              </>
            ) : (
              <div className="h-10 w-32 animate-pulse bg-white/5 rounded-lg" />
            )}
          </div>

          <div className="flex items-center gap-4">
            {!isAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-10 px-5 text-[10px] font-bold uppercase tracking-widest border-white/10 text-slate-300 hover:bg-white/5 rounded-xl transition-all"
                onClick={() => {
                  authStore.getState().logout();
                  router.push('/');
                }}
              >
                <LogOut className="w-3.5 h-3.5 mr-2" />
                Sign Out
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
        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group border",
        active 
          ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20 shadow-lg shadow-[#D4AF37]/5" 
          : "text-slate-500 border-transparent hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className={cn("w-4 h-4 transition-colors", active ? "text-[#D4AF37]" : "text-slate-500 group-hover:text-slate-300")} />
      <span className="flex-1 tracking-tight">{label}</span>
      {active && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
    </Link>
  );
}

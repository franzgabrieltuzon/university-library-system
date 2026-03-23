
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
  ChevronRight,
  ShieldCheck,
  Circle,
  Clock,
  Settings
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

  return (
    <div className="min-h-screen flex bg-[#030712] text-slate-200 font-body overflow-hidden">
      {/* High-Fidelity Institutional Sidebar */}
      {isAdmin && (
        <aside className="w-80 bg-[#0f172a] border-r border-white/5 flex flex-col shrink-0 z-50">
          <div className="p-10 border-b border-white/5 bg-[#0a1128]/40">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center p-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform hover:scale-105 duration-300">
                <img src="https://neu.edu.ph/main/assets/images/neu_logo_new.png" alt="NEU Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-white uppercase tracking-[0.2em] leading-tight">New Era University</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-1.5 font-bold">LMS Central Control</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-8 space-y-3 mt-4 overflow-y-auto custom-scrollbar">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] px-4 mb-6">Management Portal</p>
            <NavItem 
              href="/admin" 
              icon={LayoutDashboard} 
              label="Overview Dashboard" 
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
              label="User Access Control" 
              active={pathname === '/admin/users'} 
            />
          </nav>

          {/* Library Status Control Panel */}
          <div className="p-8 space-y-8 bg-[#0a1128]/20">
            <div className="bg-[#1e293b]/50 rounded-3xl p-6 border border-white/5 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={cn("w-2.5 h-2.5 rounded-full", isLibraryOpen ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" : "bg-red-500")} />
                  <span className={cn("text-[11px] font-black uppercase tracking-[0.15em]", isLibraryOpen ? "text-green-400" : "text-red-400")}>
                    {isLibraryOpen ? "Library Open" : "Library Closed"}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Operational hours active. All visitor entry points are being monitored in real-time.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                className={cn(
                  "w-full h-11 text-[10px] font-bold uppercase tracking-widest bg-transparent border-white/10 rounded-xl transition-all",
                  isLibraryOpen ? "text-red-400 hover:bg-red-500/10 hover:border-red-500/20" : "text-green-400 hover:bg-green-500/10 hover:border-green-500/20"
                )}
              >
                <Power className="w-4 h-4 mr-2.5" />
                {isLibraryOpen ? "Suspend Operations" : "Resume Operations"}
              </Button>
            </div>

            {/* Admin Profile Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 px-2">
                <Avatar className="h-12 w-12 border-2 border-[#D4AF37]/30 shadow-2xl ring-4 ring-[#D4AF37]/5">
                  <AvatarFallback className="bg-[#D4AF37] text-slate-900 text-sm font-black">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-black text-white truncate tracking-tight">{user?.name}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">System Administrator</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <Button 
                  variant="ghost" 
                  onClick={() => {
                    authStore.getState().logout();
                    router.push('/');
                  }}
                  className="w-full h-11 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4 mr-2.5" />
                  Sign Out
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full h-11 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-white/5 rounded-xl transition-all"
                >
                  <Settings className="w-4 h-4 mr-2.5" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#030712] relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        <header className="h-24 border-b border-white/5 bg-[#030712]/60 backdrop-blur-xl flex items-center justify-between px-12 sticky top-0 z-40">
          <div className="flex flex-col">
            {mounted && currentTime ? (
              <>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#D4AF37] opacity-60" />
                  <span className="text-2xl font-mono font-black text-white tracking-tighter tabular-nums">
                    {format(currentTime, 'HH:mm:ss')}
                  </span>
                </div>
                <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.4em] mt-2 ml-7">
                  {format(currentTime, 'EEEE, MMMM dd, yyyy')}
                </span>
              </>
            ) : (
              <div className="h-12 w-48 animate-pulse bg-white/5 rounded-2xl" />
            )}
          </div>

          <div className="flex items-center gap-6">
            {!isAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-12 px-8 text-[11px] font-black uppercase tracking-[0.2em] border-white/10 text-slate-300 hover:bg-white/5 rounded-2xl transition-all shadow-xl"
                onClick={() => {
                  authStore.getState().logout();
                  router.push('/');
                }}
              >
                <LogOut className="w-4 h-4 mr-3" />
                Terminate Session
              </Button>
            )}
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-12 overflow-y-auto custom-scrollbar relative z-10">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
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
        "flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group border relative overflow-hidden",
        active 
          ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30 shadow-[0_0_30px_rgba(212,175,55,0.1)]" 
          : "text-slate-500 border-transparent hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className={cn("w-5 h-5 transition-colors duration-300", active ? "text-[#D4AF37]" : "text-slate-500 group-hover:text-slate-300")} />
      <span className="flex-1 tracking-tight">{label}</span>
      {active && (
        <>
          <ChevronRight className="w-4 h-4 opacity-70" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#D4AF37] rounded-r-full shadow-[0_0_10px_rgba(212,175,55,1)]" />
        </>
      )}
    </Link>
  );
}

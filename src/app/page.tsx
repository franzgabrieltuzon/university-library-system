"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { authStore } from '@/lib/auth-store';
import { getBlockedUsers } from '@/lib/mock-db';
import { Loader2, ChevronRight, LogIn } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/app/lib/placeholder-images';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const libraryImage = PlaceHolderImages.find(img => img.id === 'library-hero')?.imageUrl || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1600&h=900&auto=format&fit=crop';
  const neuLogo = PlaceHolderImages.find(img => img.id === 'neu-logo')?.imageUrl;

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleGoogleLogin = () => {
    setLoading(true);
    // Simulate Google Login Redirect
    setTimeout(() => {
      const mockEmail = 'jcesperanza@neu.edu.ph';
      const trimmedEmail = mockEmail.toLowerCase().trim();
      
      const blocked = getBlockedUsers();
      if (blocked.includes(trimmedEmail)) {
        toast({
          variant: 'destructive',
          title: 'Access Restricted',
          description: 'Your institutional account has been temporarily disabled.',
        });
        setLoading(false);
        return;
      }

      const mockUser = {
        id: 'google-uid-123',
        email: trimmedEmail,
        name: 'JC Esperanza',
        program: 'Library Administration',
        college: 'New Era University',
        role: 'admin' as const,
        isEmployee: true
      };

      authStore.getState().setUser(mockUser);
      setLoading(false);
      setShowLoginModal(false);
      
      toast({
        title: "Authenticated Successfully",
        description: `Signed in as ${mockUser.name}`,
      });

      router.push('/admin');
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-body">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={libraryImage} 
          alt="NEU Library Building" 
          fill 
          className="object-cover opacity-60"
          priority
          unoptimized
          data-ai-hint="university library building"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 p-8 flex justify-between items-start w-full">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          {neuLogo && (
            <div className="relative w-12 h-12">
              <Image src={neuLogo} alt="NEU Logo" fill className="object-contain filter brightness-0 invert" unoptimized />
            </div>
          )}
          <div className="flex flex-col">
            <h2 className="text-sm font-bold tracking-[0.2em] text-white uppercase">New Era University</h2>
            <p className="text-[10px] text-slate-300 tracking-widest uppercase">Diliman, Quezon City</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-right text-white min-w-[150px]"
        >
          {mounted && currentTime ? (
            <>
              <div className="text-xl font-mono tracking-tighter">
                {currentTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </>
          ) : (
            <div className="h-10 w-full animate-pulse bg-white/5 rounded" />
          )}
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <span className="text-[11px] font-bold tracking-[0.5em] text-slate-400 uppercase mb-4 block">
            University Library System
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-tight">
            <span className="italic text-[#D4AF37] block mb-2 font-playfair">Welcome to the</span>
            <span className="font-playfair font-bold">NEU Library</span>
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <Button 
              onClick={() => setShowLoginModal(true)}
              variant="outline"
              className="px-10 py-7 text-sm font-bold tracking-[0.2em] text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] bg-transparent rounded-none uppercase transition-all group"
            >
              Enter the Library
              <ChevronRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer Info */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 p-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/60">
        <div className="flex items-center gap-8 text-[10px] tracking-widest uppercase font-medium">
          <div className="flex flex-col gap-1">
            <span className="text-white/40 mb-1">Library Hours</span>
            <div className="flex gap-4">
              <span>Mon - Fri: <b className="text-white">7:30 AM – 7:00 PM</b></span>
              <span>Saturday: <b className="text-white">8:00 AM – 5:00 PM</b></span>
              <span>Sunday: <b className="text-white">Closed</b></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-tighter">Open Now</span>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-[400px] bg-slate-900 border-slate-800 text-white p-0 overflow-hidden">
          <div className="p-8 space-y-6">
            <DialogHeader>
              <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center mb-4 mx-auto border border-[#D4AF37]/20">
                <LogIn className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <DialogTitle className="text-center text-2xl font-serif">Institutional Access</DialogTitle>
              <DialogDescription className="text-center text-slate-400 text-sm">
                Please authenticate using your official NEU Google account to access library services.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <Button 
                onClick={handleGoogleLogin}
                className="w-full h-12 bg-white hover:bg-slate-100 text-black font-bold flex items-center justify-center gap-3 transition-colors"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign in with Google
                  </>
                )}
              </Button>
              <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest leading-relaxed px-4">
                By signing in, you agree to follow the NEU Library policy and institutional guidelines.
              </p>
            </div>
          </div>
          <div className="bg-[#D4AF37] h-1 w-full" />
        </DialogContent>
      </Dialog>
    </div>
  );
}

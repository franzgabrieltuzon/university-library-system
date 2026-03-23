"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { authStore, User } from '@/lib/auth-store';
import { addLog } from '@/lib/mock-db';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Book, 
  Search, 
  Monitor, 
  Users, 
  BookCopy, 
  RotateCcw, 
  PenTool, 
  Pin,
  ArrowRight,
  Library,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VISIT_PURPOSES = [
  { id: 'Reading', label: 'READING', icon: Book },
  { id: 'Studying', label: 'STUDYING', icon: PenTool },
  { id: 'Researching', label: 'RESEARCHING', icon: Search },
  { id: 'Use of Computer', label: 'USE OF COMPUTER', icon: Monitor },
  { id: 'Borrowing Books', label: 'BORROWING BOOKS', icon: BookCopy },
  { id: 'Returning Books', label: 'RETURNING BOOKS', icon: RotateCcw },
  { id: 'Group Study', label: 'GROUP STUDY', icon: Users },
  { id: 'Other', label: 'OTHER', icon: Pin },
];

export default function CheckInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const u = authStore.getState().user;
    if (!u) {
      router.push('/');
    } else {
      setUser(u);
    }
  }, [router]);

  const handleSubmit = () => {
    if (!reason) {
      toast({ variant: 'destructive', title: 'Action Required', description: 'Please select a purpose for your visit.' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (user) {
        addLog({
          name: user.name,
          email: user.email,
          program: user.program,
          college: user.college,
          reason: reason,
          isEmployee: user.isEmployee,
          type: user.isEmployee ? 'Employee' : 'Student'
        });
        setIsLogged(true);
        toast({
          title: 'Visit Logged',
          description: `Purpose: ${reason}`,
        });
      }
      setLoading(false);
    }, 800);
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="bg-[#111c3a] border border-white/5 rounded-2xl p-8 flex items-center justify-between shadow-2xl">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">WELCOME TO</span>
            <h1 className="text-3xl font-headline font-bold text-white">NEU Library!</h1>
            <p className="text-slate-400 text-sm">Welcome back, NEU! What brings you in today?</p>
          </div>
          <div className="hidden sm:block">
             <Library className="w-16 h-16 text-yellow-500/20" strokeWidth={1.5} />
          </div>
        </div>

        {/* Log Card */}
        <Card className="bg-white border-none shadow-2xl overflow-hidden rounded-2xl">
          <CardContent className="p-10 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-headline font-bold text-slate-900">Log Your Visit</h2>
            </div>

            <AnimatePresence>
              {isLogged && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 mb-4"
                >
                  <Sparkles className="w-4 h-4" />
                  Visit logged! Enjoy your time at NEU Library, {user.name.split(' ')[0]}!
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">PURPOSE OF VISIT</span>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {VISIT_PURPOSES.map((purpose) => (
                  <button
                    key={purpose.id}
                    onClick={() => setReason(purpose.id)}
                    disabled={isLogged}
                    className={cn(
                      "flex flex-col items-center justify-center gap-3 p-6 rounded-xl border transition-all h-32 group",
                      reason === purpose.id 
                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20" 
                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    <purpose.icon className={cn(
                      "w-6 h-6 transition-colors",
                      reason === purpose.id ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                    )} />
                    <span className={cn(
                      "text-[9px] font-bold tracking-tighter text-center",
                      reason === purpose.id ? "text-blue-600" : "text-slate-500"
                    )}>
                      {purpose.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={loading || isLogged}
              className="w-full h-14 bg-[#0a1128] hover:bg-[#111c3a] text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {loading ? "PROCESSING..." : isLogged ? "VISIT CONFIRMED" : "Log My Visit"}
              {!loading && !isLogged && <ArrowRight className="w-5 h-5" />}
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

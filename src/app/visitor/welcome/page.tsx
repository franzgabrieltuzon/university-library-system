"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { authStore, User } from '@/lib/auth-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, UserCircle, BookOpen, GraduationCap, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WelcomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const u = authStore.getState().user;
    if (!u) {
      router.push('/');
    } else {
      setUser(u);
    }
  }, [router]);

  if (!user) return null;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 py-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-2">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl font-headline font-bold text-primary">
            Welcome to NEU Library!
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            Your institutional access has been validated successfully.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* User Profile Card */}
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardHeader className="border-b bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <CardTitle className="text-xl">{user.name}</CardTitle>
                  <CardDescription className="text-primary/70 font-medium">{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-slate-100">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Institution / College</p>
                  <span className="font-semibold text-slate-700">{user.college}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-slate-100">
                  <GraduationCap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Academic Program</p>
                  <span className="font-semibold text-slate-700">{user.program}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-lg bg-slate-100">
                  <UserCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Account Status</p>
                  <span className="font-semibold text-primary uppercase tracking-wider text-xs">
                    Verified {user.role}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Button 
              className="w-full h-32 text-xl font-bold flex flex-col items-start p-8 group relative overflow-hidden transition-all hover:shadow-xl active:scale-95"
              onClick={() => router.push('/visitor/check-in')}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6" />
                  Library Check-in
                </span>
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
              </div>
              <span className="text-sm font-normal text-primary-foreground/80">
                Log your primary reason for visiting the library today.
              </span>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BookOpen className="w-24 h-24" />
              </div>
            </Button>

            <Card className="border-primary/20 bg-primary/5 shadow-inner">
              <CardContent className="p-8">
                <h3 className="font-bold text-sm text-primary mb-3 uppercase tracking-widest">Institutional Mission</h3>
                <p className="text-base text-slate-700 italic leading-relaxed">
                  “Provide quality education anchored on Christian values with the prime purpose of bringing honor and glory to God.”
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

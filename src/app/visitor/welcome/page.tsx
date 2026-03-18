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
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-headline font-bold text-primary">
            Welcome to NEU Library!
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Your institutional access has been validated. You are now ready to explore our digital and physical resources.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* User Profile Card */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="border-b bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-700">{user.college}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-700">{user.program}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <UserCircle className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-700 uppercase tracking-wider text-xs">
                  {user.role} Account
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Button 
              className="w-full h-24 text-lg font-bold flex flex-col items-start p-6 group"
              onClick={() => router.push('/visitor/check-in')}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Official Check-in
                </span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </div>
              <span className="text-xs font-normal text-primary-foreground/70">
                Log your visit reason and start your session.
              </span>
            </Button>

            <Card className="border-primary/10 bg-primary/5">
              <CardContent className="p-6">
                <h3 className="font-bold text-sm text-primary mb-2">Institutional Mission</h3>
                <p className="text-sm text-slate-600 italic">
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
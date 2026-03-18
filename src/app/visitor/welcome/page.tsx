
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { authStore, User } from '@/lib/auth-store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';
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
      <div className="max-w-4xl mx-auto py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-accent/20 rounded-full mb-6 text-accent">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">
            Welcome to NEU Library!
          </h1>
          <p className="text-xl text-muted-foreground">
            Validation successful. We're glad to have you here today.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <Card className="shadow-lg border-none overflow-hidden h-full">
            <div className="h-2 bg-primary"></div>
            <CardContent className="pt-8 pb-10 px-8 flex flex-col items-center text-center h-full">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 border-4 border-primary/5">
                <span className="text-3xl font-bold text-primary">{user.name.charAt(0)}</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
              <p className="text-primary font-medium mb-1">{user.program}</p>
              <p className="text-sm text-muted-foreground mb-8">{user.college}</p>
              
              <div className="mt-auto w-full pt-6 border-t border-dashed">
                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Verified Institutional Access</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="bg-primary text-white border-none shadow-xl flex-1 cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => router.push('/visitor/check-in')}>
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 opacity-50" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Check-in Now</h3>
                <p className="text-white/80">Record your visit and purpose to proceed into the library premises.</p>
              </CardContent>
            </Card>

            <Card className="bg-accent text-white border-none shadow-xl flex-1">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-2">Library Guidelines</h3>
                <ul className="text-sm space-y-2 text-white/90">
                  <li>• Maintain silence in study areas.</li>
                  <li>• No food or drinks near computers.</li>
                  <li>• Return books to their designated shelves.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

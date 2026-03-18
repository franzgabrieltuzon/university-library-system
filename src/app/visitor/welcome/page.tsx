"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { authStore, User } from '@/lib/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle2, ArrowRight, BookOpen, Hexagon, Shield, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

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
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-8 border border-primary/20 neon-glow">
            <Globe className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-white mb-6 tracking-tighter">
            ACCESS <span className="text-primary">AUTHORIZED</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Biometric and RFID synchronization complete. Welcome to the New Era Digital Archive.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Identity Matrix */}
          <div className="lg:col-span-4">
            <Card className="glass-card border-none h-full relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <CardContent className="pt-12 pb-10 px-8 flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <Hexagon className="w-32 h-32 text-primary/20 fill-primary/5" strokeWidth={1} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold text-primary tracking-tighter">{user.name.charAt(0)}</span>
                  </div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="absolute inset-0 border border-primary/20 rounded-full border-dashed"
                  />
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{user.name}</h2>
                <p className="text-primary font-bold uppercase tracking-widest text-xs mb-8">{user.program}</p>
                
                <div className="w-full space-y-4 pt-8 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs uppercase tracking-widest font-bold">
                    <span className="text-slate-500">Security Clearance</span>
                    <span className="text-green-500">Level 01</span>
                  </div>
                  <div className="flex items-center justify-between text-xs uppercase tracking-widest font-bold">
                    <span className="text-slate-500">Institutional Node</span>
                    <span className="text-white">{user.college}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Grid */}
          <div className="lg:col-span-8 grid md:grid-cols-2 gap-8">
            <motion.div whileHover={{ y: -5 }}>
              <Card 
                className="glass-card border-primary/20 bg-primary/5 hover:bg-primary/10 cursor-pointer transition-all h-full group"
                onClick={() => router.push('/visitor/check-in')}
              >
                <CardContent className="p-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-8">
                    <div className="bg-primary p-4 rounded-2xl neon-glow">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <ArrowRight className="w-6 h-6 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Active Check-in</h3>
                  <p className="text-slate-400 leading-relaxed mb-auto">Initialize your research session and synchronize visit parameters with the central archive.</p>
                  <Button className="mt-8 bg-white text-black hover:bg-white/90 rounded-xl font-bold uppercase tracking-widest">
                    Begin Uplink
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <div className="space-y-8">
              <Card className="glass-card border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs uppercase tracking-[0.3em] text-primary font-bold flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Protocol Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      "Silence protocols active in all study sectors.",
                      "No external energy units (food/drink) near terminals.",
                      "Return physical assets to assigned coordinates."
                    ].map((text, i) => (
                      <li key={i} className="text-sm text-slate-300 flex gap-3">
                        <span className="text-primary font-bold">0{i+1}</span>
                        {text}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="glass-card border-none bg-accent/5">
                <CardContent className="p-8">
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Core Mission
                  </h4>
                  <p className="text-lg italic text-white font-medium leading-snug">
                    "To provide a world-class institutional environment anchored on excellence, discipline, and service to humanity."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
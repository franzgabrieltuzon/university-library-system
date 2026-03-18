"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { authStore } from '@/lib/auth-store';
import { getBlockedUsers } from '@/lib/mock-db';
import { Mail, Loader2, Scan, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/app/lib/placeholder-images';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [rfidCode, setRfidCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const campusImage = PlaceHolderImages.find(img => img.id === 'neu-campus')?.imageUrl;

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    authenticate(email);
  };

  const handleRfidLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfidCode) return;
    setIsScanning(true);
    setTimeout(() => {
      authenticate('visitor@neu.edu.ph');
      setIsScanning(false);
    }, 1500);
  };

  const authenticate = (userEmail: string) => {
    setLoading(true);
    const trimmedEmail = userEmail.toLowerCase().trim();
    
    setTimeout(() => {
      if (!trimmedEmail.endsWith('@neu.edu.ph')) {
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'Institutional credentials required.',
        });
        setLoading(false);
        return;
      }

      const blocked = getBlockedUsers();
      if (blocked.includes(trimmedEmail)) {
        toast({
          variant: 'destructive',
          title: 'Security Alert',
          description: 'Access restricted. Visit admin desk.',
        });
        setLoading(false);
        return;
      }

      // Role logic: jcesperanza@neu.edu.ph is Admin, others are Visitors
      const role = trimmedEmail === 'jcesperanza@neu.edu.ph' ? 'admin' : 'visitor';

      const mockUser = {
        id: Math.random().toString(),
        email: trimmedEmail,
        name: trimmedEmail === 'jcesperanza@neu.edu.ph' ? 'JC Esperanza' : trimmedEmail.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        program: role === 'admin' ? 'Administrative Services' : 'Academic Program',
        college: 'New Era University',
        role: role,
        isEmployee: role === 'admin'
      };

      authStore.getState().setUser(mockUser);
      setLoading(false);
      
      router.push(role === 'admin' ? '/admin' : '/visitor/welcome');
    }, 1000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-slate-950">
      {/* High-End Campus Backdrop */}
      {campusImage && (
        <div className="fixed inset-0 z-0">
          <Image 
            src={campusImage} 
            alt="NEU Campus" 
            fill 
            className="object-cover opacity-60 scale-105"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/40 to-transparent" />
        </div>
      )}

      <div className="relative z-10 w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Branding & Tagline */}
        <div className="flex flex-col text-white space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-headline font-bold leading-tight tracking-tight">
              New Era University <span className="text-blue-400">Library</span>
            </h1>
            <div className="h-1.5 w-24 bg-blue-500 mt-6 rounded-full" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-4"
          >
            <p className="text-2xl font-light text-slate-200 italic leading-relaxed">
              “Learn with purpose. <br />
              Grow in faith. <br />
              Serve with excellence.”
            </p>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest pt-4">
              Institutional Portal • Excellence in Education
            </p>
          </motion.div>
        </div>

        {/* Right Side: Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5 backdrop-blur-xl p-1 rounded-xl border border-white/10">
              <TabsTrigger value="email" className="text-slate-300 data-[state=active]:bg-white data-[state=active]:text-primary rounded-lg transition-all">Credentials</TabsTrigger>
              <TabsTrigger value="rfid" className="text-slate-300 data-[state=active]:bg-white data-[state=active]:text-primary rounded-lg transition-all">RFID Card</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="email" key="email-tab">
                <Card className="border-white/10 shadow-2xl bg-white/10 backdrop-blur-2xl text-white">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                    <CardDescription className="text-slate-300">Access your digital academic resources.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleEmailLogin}>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-200">Institutional Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                          <Input 
                            id="email"
                            type="email" 
                            placeholder="username@neu.edu.ph" 
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:ring-blue-500 h-11"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20 group" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (
                          <span className="flex items-center">
                            Authorize Access
                            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        )}
                      </Button>
                    </CardContent>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="rfid" key="rfid-tab">
                <Card className="border-white/10 shadow-2xl bg-white/10 backdrop-blur-2xl text-white">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">RFID Validation</CardTitle>
                    <CardDescription className="text-slate-300">Place your ID card on the reader.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center py-10 space-y-8">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <motion.div
                        animate={{ 
                          scale: isScanning ? [1, 1.1, 1] : 1,
                          rotate: isScanning ? 360 : 0
                        }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className={`absolute inset-0 rounded-full border-2 border-dashed ${isScanning ? 'border-blue-400' : 'border-white/20'}`}
                      />
                      <div className="p-8 rounded-full bg-white/5 border border-white/10 shadow-inner">
                        <Scan className={`w-12 h-12 ${isScanning ? 'text-blue-400' : 'text-slate-400'}`} />
                      </div>
                    </div>
                    <form onSubmit={handleRfidLogin} className="w-full space-y-4">
                      <Input 
                        placeholder="Awaiting sensor input..." 
                        className="text-center font-mono bg-white/5 border-white/10 text-white h-11"
                        value={rfidCode}
                        onChange={(e) => setRfidCode(e.target.value)}
                        autoFocus
                      />
                      <Button type="submit" className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-500 shadow-lg" disabled={loading || !rfidCode}>
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Confirm Identity'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>

      {/* Subtle Footer Overlay */}
      <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
        <p className="text-[10px] text-white/30 font-medium uppercase tracking-[0.3em]">
          New Era University • Institutional Library Data Management System
        </p>
      </div>
    </div>
  );
}

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
import { Mail, Loader2, Scan } from 'lucide-react';
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

  const logo = PlaceHolderImages.find(img => img.id === 'neu-logo')?.imageUrl;
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
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Classy Campus Backdrop */}
      {campusImage && (
        <div className="fixed inset-0 z-0">
          <Image 
            src={campusImage} 
            alt="NEU Campus backdrop" 
            fill 
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
        </div>
      )}

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8 text-center text-white drop-shadow-lg">
          {logo && (
            <div className="relative w-24 h-24 mb-4">
              <Image 
                src={logo} 
                alt="NEU Logo" 
                fill 
                className="object-contain" 
                priority 
                unoptimized
              />
            </div>
          )}
          <h1 className="text-3xl font-headline font-bold tracking-tight">
            New Era University Library
          </h1>
          <p className="mt-2 text-sm font-medium opacity-90 italic">
            “Learn with purpose. Grow in faith. Serve with excellence.”
          </p>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10 backdrop-blur-md p-1 rounded-lg border border-white/20">
            <TabsTrigger value="email" className="text-white data-[state=active]:bg-white data-[state=active]:text-primary">Credentials</TabsTrigger>
            <TabsTrigger value="rfid" className="text-white data-[state=active]:bg-white data-[state=active]:text-primary">RFID Card</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="email" key="email-tab">
              <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Sign In</CardTitle>
                  <CardDescription>Enter your institutional email to proceed.</CardDescription>
                </CardHeader>
                <form onSubmit={handleEmailLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="email"
                          type="email" 
                          placeholder="username@neu.edu.ph" 
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-11 font-bold shadow-md" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Log In'}
                    </Button>
                  </CardContent>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="rfid" key="rfid-tab">
              <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">RFID Access</CardTitle>
                  <CardDescription>Scan your ID card for instant validation.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-8 space-y-6">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: isScanning ? [1, 1.2, 1] : 1 }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className={`absolute inset-0 rounded-full border-2 border-dashed ${isScanning ? 'border-primary' : 'border-slate-200'}`}
                    />
                    <div className="p-5 rounded-full bg-slate-50 border shadow-inner">
                      <Scan className={`w-10 h-10 ${isScanning ? 'text-primary' : 'text-slate-400'}`} />
                    </div>
                  </div>
                  <form onSubmit={handleRfidLogin} className="w-full space-y-4">
                    <Input 
                      placeholder="Waiting for scan..." 
                      className="text-center font-mono bg-slate-50"
                      value={rfidCode}
                      onChange={(e) => setRfidCode(e.target.value)}
                      autoFocus
                    />
                    <Button type="submit" className="w-full h-11 font-bold shadow-md" disabled={loading || !rfidCode}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirm Identity'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
        
        <p className="mt-8 text-center text-[10px] text-white/60 font-medium uppercase tracking-widest">
          &copy; {new Date().getFullYear()} New Era University • Institutional Library
        </p>
      </div>
    </div>
  );
}

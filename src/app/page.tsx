"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { authStore, UserRole } from '@/lib/auth-store';
import { getBlockedUsers } from '@/lib/mock-db';
import { ShieldCheck, UserCheck, Mail, ArrowRight, Scan, Radio, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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
    authenticate(email, 'visitor');
  };

  const handleRfidLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfidCode) return;
    setIsScanning(true);
    setTimeout(() => {
      authenticate('rfid.user@neu.edu.ph', 'visitor');
      setIsScanning(false);
    }, 2000);
  };

  const authenticate = (userEmail: string, role: UserRole) => {
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

      const mockUser = {
        id: Math.random().toString(),
        email: trimmedEmail,
        name: trimmedEmail === 'rfid.user@neu.edu.ph' ? 'RFID Access User' : trimmedEmail.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        program: 'Information Technology',
        college: 'College of Computer Studies',
        role: role,
        isEmployee: trimmedEmail.includes('faculty') || trimmedEmail === 'jcesperanza@neu.edu.ph'
      };

      authStore.getState().setUser(mockUser);
      setLoading(false);
      router.push(role === 'admin' ? '/admin' : '/visitor/welcome');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background cyber-grid relative overflow-hidden">
      {/* Background Campus Image with Overlay */}
      {campusImage && (
        <div className="absolute inset-0 z-0">
          <Image 
            src={campusImage} 
            alt="NEU Campus" 
            fill 
            className="object-cover opacity-30 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
      )}

      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Left Side: Branding */}
      <div className="flex-1 hidden md:flex flex-col justify-center items-center p-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="z-10 text-center max-w-lg"
        >
          {logo && (
            <div className="relative w-32 h-32 mx-auto mb-12 p-1 rounded-3xl bg-gradient-to-tr from-primary to-blue-400/20 shadow-2xl">
              <div className="bg-background w-full h-full rounded-[1.4rem] flex items-center justify-center">
                <Image src={logo} alt="NEU Logo" width={100} height={100} className="object-contain" />
              </div>
            </div>
          )}
          
          <h1 className="text-5xl font-headline font-bold mb-6 text-white tracking-tighter">
            New Era University <br/><span className="text-primary">Library</span>
          </h1>
          
          <div className="glass-card p-8 rounded-3xl border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className="text-xl font-medium text-slate-300 leading-relaxed italic relative z-10">
              "Learn with purpose.<br />
              Grow in faith.<br />
              Serve with excellence."
            </p>
          </div>

          <div className="mt-12 flex gap-4 justify-center text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            <span>Knowledge</span>
            <span className="text-primary/40">•</span>
            <span>Innovation</span>
            <span className="text-primary/40">•</span>
            <span>Faith</span>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Sign In */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 z-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <Tabs defaultValue="rfid" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-card/50 border border-white/5 p-1 h-14 rounded-2xl">
              <TabsTrigger value="rfid" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">
                <Radio className="w-4 h-4 mr-2" />
                RFID Scan
              </TabsTrigger>
              <TabsTrigger value="email" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">
                <Mail className="w-4 h-4 mr-2" />
                Credentials
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="rfid" key="rfid">
                <Card className="glass-card border-none overflow-hidden">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">Smart Access</CardTitle>
                    <CardDescription>Scan your institutional RFID card to proceed.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center py-8">
                    <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                      <motion.div
                        animate={{ 
                          scale: isScanning ? [1, 1.2, 1] : 1,
                          rotate: isScanning ? 360 : 0
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`absolute inset-0 rounded-full border-2 border-dashed ${isScanning ? 'border-primary' : 'border-primary/20'}`}
                      />
                      <div className={`relative z-10 p-8 rounded-full bg-primary/10 border border-primary/20 ${isScanning ? 'neon-glow' : ''}`}>
                        {isScanning ? (
                          <Loader2 className="w-16 h-16 text-primary animate-spin" />
                        ) : (
                          <Scan className="w-16 h-16 text-primary" />
                        )}
                      </div>
                    </div>
                    <form onSubmit={handleRfidLogin} className="w-full space-y-4">
                      <Input 
                        placeholder="Waiting for RFID signal..." 
                        className="bg-background/50 border-white/10 text-center h-12 rounded-xl"
                        value={rfidCode}
                        onChange={(e) => setRfidCode(e.target.value)}
                        autoFocus
                      />
                      <Button type="submit" className="w-full h-12 rounded-xl neon-glow font-bold uppercase tracking-widest" disabled={loading || !rfidCode}>
                        {loading ? 'Validating...' : 'Initialize Access'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="email" key="email">
                <Card className="glass-card border-none">
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">Legacy Access</CardTitle>
                    <CardDescription>Enter your @neu.edu.ph credentials.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleEmailLogin}>
                    <CardContent className="space-y-6 pt-4">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <Input 
                            type="email" 
                            placeholder="user@neu.edu.ph" 
                            className="pl-12 h-12 bg-background/50 border-white/10 rounded-xl"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full h-12 rounded-xl neon-glow font-bold uppercase tracking-widest" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                      </Button>
                    </CardContent>
                  </form>
                </Card>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
          
          <p className="mt-8 text-center text-[10px] text-slate-600 uppercase tracking-[0.3em] font-bold">
            NEU • DIGITAL ASSET MANAGEMENT SYSTEM • v2.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}

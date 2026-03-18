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
import { Mail, Radio, Loader2, Scan } from 'lucide-react';
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
    authenticate(email);
  };

  const handleRfidLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfidCode) return;
    setIsScanning(true);
    setTimeout(() => {
      authenticate('rfid.user@neu.edu.ph');
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
        name: trimmedEmail === 'rfid.user@neu.edu.ph' ? 'RFID User' : trimmedEmail.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        program: trimmedEmail === 'jcesperanza@neu.edu.ph' ? 'Administrative Services' : 'Information Technology',
        college: 'University Administration',
        role: role,
        isEmployee: true
      };

      authStore.getState().setUser(mockUser);
      setLoading(false);
      
      router.push(role === 'admin' ? '/admin' : '/visitor/welcome');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background subtle-grid p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Branding Section */}
        <div className="hidden md:flex flex-col items-center text-center space-y-8">
          {logo && (
            <div className="relative w-40 h-40">
              <Image src={logo} alt="NEU Logo" fill className="object-contain" priority />
            </div>
          )}
          <div className="space-y-4">
            <h1 className="text-4xl font-headline font-bold text-primary tracking-tight">
              New Era University Library
            </h1>
            <p className="text-xl font-medium text-slate-600 italic">
              “Learn with purpose. Grow in faith. Serve with excellence.”
            </p>
          </div>
          {campusImage && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <Image src={campusImage} alt="NEU Campus" fill className="object-cover" />
              <div className="absolute inset-0 bg-primary/10" />
            </div>
          )}
        </div>

        {/* Login Form Section */}
        <div className="flex flex-col space-y-8">
          <div className="md:hidden flex flex-col items-center text-center space-y-4 mb-4">
            {logo && <Image src={logo} alt="NEU Logo" width={80} height={80} className="object-contain" />}
            <h1 className="text-2xl font-bold text-primary">NEU Library</h1>
          </div>

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="email">Institutional ID</TabsTrigger>
              <TabsTrigger value="rfid">RFID Card</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="email" key="email">
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">Sign In</CardTitle>
                    <CardDescription>Enter your @neu.edu.ph email to proceed.</CardDescription>
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
                      <Button type="submit" className="w-full h-11 font-bold" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continue'}
                      </Button>
                    </CardContent>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="rfid" key="rfid">
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">RFID Access</CardTitle>
                    <CardDescription>Scan your institutional card for instant check-in.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center py-6 space-y-6">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <motion.div
                        animate={{ scale: isScanning ? [1, 1.1, 1] : 1 }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`absolute inset-0 rounded-full border-2 border-dashed ${isScanning ? 'border-primary animate-spin-slow' : 'border-slate-200'}`}
                      />
                      <div className="p-6 rounded-full bg-slate-50 border shadow-inner">
                        <Scan className={`w-12 h-12 ${isScanning ? 'text-primary' : 'text-slate-400'}`} />
                      </div>
                    </div>
                    <form onSubmit={handleRfidLogin} className="w-full space-y-4">
                      <Input 
                        placeholder="Scan card now..." 
                        className="text-center font-mono"
                        value={rfidCode}
                        onChange={(e) => setRfidCode(e.target.value)}
                        autoFocus
                      />
                      <Button type="submit" className="w-full h-11 font-bold" disabled={loading || !rfidCode}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirm Scan'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
          
          <p className="text-center text-xs text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} New Era University • Library Systems
          </p>
        </div>
      </div>
    </div>
  );
}
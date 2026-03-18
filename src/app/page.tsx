
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { authStore, UserRole } from '@/lib/auth-store';
import { getBlockedUsers } from '@/lib/mock-db';
import { Mail, Loader2, Scan, ChevronRight, UserCircle, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/app/lib/placeholder-images';
import { motion, AnimatePresence } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [rfidCode, setRfidCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('visitor');
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const campusImage = PlaceHolderImages.find(img => img.id === 'neu-campus')?.imageUrl;

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    authenticate(email, selectedRole);
  };

  const handleRfidLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfidCode) return;
    setIsScanning(true);
    setTimeout(() => {
      authenticate('visitor@neu.edu.ph', 'visitor');
      setIsScanning(false);
    }, 1500);
  };

  const authenticate = (userEmail: string, role: UserRole) => {
    setLoading(true);
    const trimmedEmail = userEmail.toLowerCase().trim();
    
    setTimeout(() => {
      if (!trimmedEmail.endsWith('@neu.edu.ph')) {
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'Institutional credentials required (@neu.edu.ph).',
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
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-slate-900">
      {/* Classy Campus Backdrop */}
      {campusImage && (
        <div className="fixed inset-0 z-0">
          <Image 
            src={campusImage} 
            alt="NEU Campus" 
            fill 
            className="object-cover opacity-40 scale-105 blur-[2px]"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-slate-900/90" />
        </div>
      )}

      <div className="relative z-10 w-full max-w-lg">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 text-white"
        >
          <h1 className="text-4xl font-headline font-bold mb-2 tracking-tight">New Era University</h1>
          <p className="text-lg font-light text-slate-300 italic">“Learn with purpose. Grow in faith. Serve with excellence.”</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10 backdrop-blur-md p-1 border border-white/20 rounded-xl">
              <TabsTrigger value="email" className="data-[state=active]:bg-white data-[state=active]:text-primary rounded-lg transition-all font-bold">Email Login</TabsTrigger>
              <TabsTrigger value="rfid" className="data-[state=active]:bg-white data-[state=active]:text-primary rounded-lg transition-all font-bold">RFID Card</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="email" key="email-tab">
                <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-primary">Portal Sign In</CardTitle>
                    <CardDescription>Select your account role to proceed.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleEmailLogin}>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700">Account Role</Label>
                        <RadioGroup 
                          defaultValue="visitor" 
                          onValueChange={(val) => setSelectedRole(val as UserRole)}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div>
                            <RadioGroupItem value="visitor" id="role-student" className="sr-only" />
                            <Label
                              htmlFor="role-student"
                              className={`flex flex-col items-center justify-center rounded-xl border-2 p-4 cursor-pointer transition-all ${selectedRole === 'visitor' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 hover:bg-slate-50'}`}
                            >
                              <UserCircle className="mb-2 h-6 w-6" />
                              <span className="text-xs font-bold uppercase tracking-wider">Student</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="admin" id="role-admin" className="sr-only" />
                            <Label
                              htmlFor="role-admin"
                              className={`flex flex-col items-center justify-center rounded-xl border-2 p-4 cursor-pointer transition-all ${selectedRole === 'admin' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 hover:bg-slate-50'}`}
                            >
                              <ShieldCheck className="mb-2 h-6 w-6" />
                              <span className="text-xs font-bold uppercase tracking-wider">Admin</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Institutional Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input 
                            id="email"
                            type="email" 
                            placeholder="username@neu.edu.ph" 
                            className="pl-10 h-11 border-slate-200 focus:ring-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full h-11 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg group" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (
                          <span className="flex items-center">
                            Continue as {selectedRole === 'admin' ? 'Admin' : 'Student'}
                            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        )}
                      </Button>
                    </CardContent>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="rfid" key="rfid-tab">
                <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-primary">RFID Sign In</CardTitle>
                    <CardDescription>Place your card on the reader.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center py-8 space-y-6">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <motion.div
                        animate={{ 
                          scale: isScanning ? [1, 1.1, 1] : 1,
                          rotate: isScanning ? 360 : 0
                        }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className={`absolute inset-0 rounded-full border-2 border-dashed ${isScanning ? 'border-primary' : 'border-slate-200'}`}
                      />
                      <div className="p-6 rounded-full bg-primary/5 border border-primary/10">
                        <Scan className={`w-10 h-10 ${isScanning ? 'text-primary' : 'text-slate-300'}`} />
                      </div>
                    </div>
                    <form onSubmit={handleRfidLogin} className="w-full space-y-4">
                      <Input 
                        placeholder="Awaiting sensor input..." 
                        className="text-center font-mono border-slate-200"
                        value={rfidCode}
                        onChange={(e) => setRfidCode(e.target.value)}
                        autoFocus
                      />
                      <Button type="submit" className="w-full h-11 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg" disabled={loading || !rfidCode}>
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Validate Identity'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center text-white/40">
        <p className="text-[10px] font-bold uppercase tracking-widest">
          New Era University • Institutional Library Data Management
        </p>
      </div>
    </div>
  );
}

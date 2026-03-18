
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { authStore, UserRole } from '@/lib/auth-store';
import { getBlockedUsers } from '@/lib/mock-db';
import { Library, ShieldCheck, UserCheck, Mail, ArrowRight, Quote } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('visitor');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const trimmedEmail = email.toLowerCase().trim();
      
      if (!trimmedEmail.endsWith('@neu.edu.ph')) {
        toast({
          variant: 'destructive',
          title: 'Invalid Email',
          description: 'Please use your institutional @neu.edu.ph email address.',
        });
        setLoading(false);
        return;
      }

      const blocked = getBlockedUsers();
      if (blocked.includes(trimmedEmail)) {
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'Your account has been blocked from library use. Please contact the librarian.',
        });
        setLoading(false);
        return;
      }

      let finalRole = role;
      if (trimmedEmail === 'jcesperanza@neu.edu.ph') {
      } else if (role === 'admin') {
        toast({
          variant: 'destructive',
          title: 'Unauthorized',
          description: 'You do not have administrator privileges.',
        });
        setLoading(false);
        return;
      }

      const mockUser = {
        id: Math.random().toString(),
        email: trimmedEmail,
        name: trimmedEmail.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        program: trimmedEmail === 'jcesperanza@neu.edu.ph' ? 'Library Administration' : 'Information Technology',
        college: 'College of Computer Studies',
        role: finalRole,
        isEmployee: trimmedEmail.includes('faculty') || trimmedEmail === 'jcesperanza@neu.edu.ph'
      };

      authStore.getState().setUser(mockUser);
      setLoading(false);
      
      if (finalRole === 'admin') {
        router.push('/admin');
      } else {
        router.push('/visitor/welcome');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F5F7FA]">
      {/* Left Side: Illustration & Branding */}
      <div className="flex-1 hidden md:flex flex-col justify-between items-center bg-primary text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="https://neu.edu.ph/main/assets/images/NEU_Main2.jpg" 
            alt="NEU Campus" 
            fill 
            className="object-cover"
            data-ai-hint="university building"
          />
        </div>
        
        <div className="z-10 text-center max-w-md mt-12">
          <div className="bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-lg border border-white/20">
            <Library className="w-12 h-12 text-white" />
          </div>
          <h1 className="font-headline font-bold text-5xl mb-6 leading-tight">NEU Library Flow</h1>
          <p className="text-xl text-white/80 font-body mb-10">
            A seamless visitor management system for New Era University's modern library environment.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <UserCheck className="w-6 h-6 mb-2 text-accent" />
              <h3 className="font-bold">Fast Check-in</h3>
              <p className="text-sm text-white/60">Quick registration using institutional credentials.</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <ShieldCheck className="w-6 h-6 mb-2 text-accent" />
              <h3 className="font-bold">Admin Insights</h3>
              <p className="text-sm text-white/60">Data-driven analytics for library improvement.</p>
            </div>
          </div>
        </div>

        {/* Philosophy, Mission, Vision subtle section */}
        <div className="z-10 w-full max-w-2xl bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 mt-12">
          <div className="grid grid-cols-3 gap-6 text-xs text-white/70">
            <div className="space-y-2">
              <h4 className="font-bold text-accent uppercase tracking-tighter">Philosophy</h4>
              <p className="italic">"Godliness is the foundation of knowledge."</p>
            </div>
            <div className="space-y-2 border-l border-white/10 pl-6">
              <h4 className="font-bold text-accent uppercase tracking-tighter">Mission</h4>
              <p>Provide quality education anchored on Christian values with the prime purpose of bringing honor and glory to God.</p>
            </div>
            <div className="space-y-2 border-l border-white/10 pl-6">
              <h4 className="font-bold text-accent uppercase tracking-tighter">Vision</h4>
              <p>A world-class Institution of learning with a unique Christian culture of excellence, discipline, and service to humanity.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
        <Card className="w-full max-w-md shadow-2xl border-none">
          <CardHeader className="space-y-1 text-center">
            <div className="md:hidden flex justify-center mb-4">
               <Library className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-headline font-bold text-primary">Login to Library</CardTitle>
            <CardDescription className="text-base">
              Enter your @neu.edu.ph email to access.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold">Institutional Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@neu.edu.ph" 
                    className="pl-10 h-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">RFID simulation: Type your email to simulate scanning.</p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">I am a:</Label>
                <RadioGroup 
                  value={role} 
                  onValueChange={(v) => setRole(v as UserRole)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="visitor" id="visitor" className="peer sr-only" />
                    <Label
                      htmlFor="visitor"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all cursor-pointer"
                    >
                      <UserCheck className="mb-2 h-6 w-6 text-primary" />
                      <span className="font-bold">Visitor</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="admin" id="admin" className="peer sr-only" />
                    <Label
                      htmlFor="admin"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all cursor-pointer"
                    >
                      <ShieldCheck className="mb-2 h-6 w-6 text-primary" />
                      <span className="font-bold">Admin</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In with Google'}
                {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <p className="mt-8 text-sm text-muted-foreground">
          Need help? Contact <span className="text-primary font-semibold">it.support@neu.edu.ph</span>
        </p>
      </div>
    </div>
  );
}

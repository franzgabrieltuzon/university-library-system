
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
import { ShieldCheck, UserCheck, Mail, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('visitor');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const logo = PlaceHolderImages.find(img => img.id === 'neu-logo')?.imageUrl || '';
  const campusImage = PlaceHolderImages.find(img => img.id === 'neu-campus')?.imageUrl || '';

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

      const mockUser = {
        id: Math.random().toString(),
        email: trimmedEmail,
        name: trimmedEmail.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        program: trimmedEmail === 'jcesperanza@neu.edu.ph' ? 'Library Administration' : 'Information Technology',
        college: 'College of Computer Studies',
        role: role,
        isEmployee: trimmedEmail.includes('faculty') || trimmedEmail === 'jcesperanza@neu.edu.ph'
      };

      authStore.getState().setUser(mockUser);
      setLoading(false);
      
      if (role === 'admin') {
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
            src={campusImage} 
            alt="NEU Campus" 
            fill 
            className="object-cover"
            priority
            data-ai-hint="university building"
          />
        </div>
        
        <div className="z-10 text-center max-w-md mt-12">
          <div className="bg-white/10 w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-lg border border-white/20 p-4">
            <Image 
              src={logo} 
              alt="NEU Logo" 
              width={100} 
              height={100} 
              className="object-contain"
            />
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

        {/* Tagline Section */}
        <div className="z-10 w-full max-w-lg bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 mt-12 transform hover:scale-[1.02] transition-transform duration-300">
          <p className="text-2xl md:text-3xl font-headline font-bold text-accent text-center leading-snug">
            Learn with purpose.<br />
            Grow in faith.<br />
            Serve with excellence.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
        <Card className="w-full max-w-md shadow-2xl border-none">
          <CardHeader className="space-y-1 text-center">
            <div className="md:hidden flex justify-center mb-4">
              <Image 
                src={logo} 
                alt="NEU Logo" 
                width={60} 
                height={60} 
                className="object-contain"
              />
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

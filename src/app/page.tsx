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

  const logo = PlaceHolderImages.find(img => img.id === 'neu-logo')?.imageUrl;
  const campusImage = PlaceHolderImages.find(img => img.id === 'neu-campus')?.imageUrl;

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
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Left Side: Branding */}
      <div className="flex-1 hidden md:flex flex-col justify-center items-center bg-primary text-white p-12 relative overflow-hidden">
        {campusImage && (
          <div className="absolute inset-0 opacity-20">
            <Image 
              src={campusImage} 
              alt="NEU Campus" 
              fill 
              className="object-cover grayscale brightness-50"
              priority
              data-ai-hint="university building"
            />
          </div>
        )}
        
        <div className="z-10 text-center max-w-md">
          {logo && (
            <div className="bg-white w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl p-3">
              <Image 
                src={logo} 
                alt="NEU Logo" 
                width={80} 
                height={80} 
                className="object-contain"
              />
            </div>
          )}
          <h1 className="font-headline font-bold text-4xl mb-4 leading-tight">
            New Era University Library
          </h1>
          <p className="text-lg text-white/90 font-body mb-12">
            Providing a world-class environment for academic excellence and spiritual growth.
          </p>
          
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl">
            <p className="text-xl md:text-2xl font-headline font-bold text-white leading-relaxed">
              "Learn with purpose.<br />
              Grow in faith.<br />
              Serve with excellence."
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
        <Card className="w-full max-w-md shadow-xl border-none bg-white">
          <CardHeader className="space-y-1 text-center pb-8">
            <CardTitle className="text-2xl font-headline font-bold text-slate-900">Sign In</CardTitle>
            <CardDescription className="text-slate-500">
              Access the library management system with your credentials.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">Institutional Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="yourname@neu.edu.ph" 
                    className="pl-10 h-11 border-slate-200 focus:border-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700">Select Access Type</Label>
                <RadioGroup 
                  value={role} 
                  onValueChange={(v) => setRole(v as UserRole)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="visitor" id="visitor" className="peer sr-only" />
                    <Label
                      htmlFor="visitor"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-blue-50/50 transition-all cursor-pointer"
                    >
                      <UserCheck className="mb-2 h-5 w-5 text-primary" />
                      <span className="font-semibold text-sm">Visitor</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="admin" id="admin" className="peer sr-only" />
                    <Label
                      htmlFor="admin"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-blue-50/50 transition-all cursor-pointer"
                    >
                      <ShieldCheck className="mb-2 h-5 w-5 text-primary" />
                      <span className="font-semibold text-sm">Admin</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button type="submit" className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In'}
                {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <p className="mt-8 text-xs text-slate-400">
          © {new Date().getFullYear()} New Era University • All rights reserved.
        </p>
      </div>
    </div>
  );
}
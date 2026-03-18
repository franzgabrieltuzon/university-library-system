
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { authStore, User } from '@/lib/auth-store';
import { addLog, REASONS } from '@/lib/mock-db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Loader2, BookOpen, Search, Monitor, Users, HelpCircle } from 'lucide-react';

export default function CheckInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u = authStore.getState().user;
    if (!u) {
      router.push('/');
    } else {
      setUser(u);
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast({ variant: 'destructive', title: 'Required Field', description: 'Please select a reason for your visit.' });
      return;
    }

    setLoading(true);
    const finalReason = reason === 'Others' ? customReason : reason;

    setTimeout(() => {
      if (user) {
        addLog({
          name: user.name,
          email: user.email,
          program: user.program,
          college: user.college,
          reason: finalReason,
          isEmployee: user.isEmployee,
          type: user.isEmployee ? 'Employee' : 'Student'
        });

        toast({
          title: 'Success!',
          description: 'Your visit has been logged. Welcome to the library!',
        });
        
        router.push('/visitor/welcome');
      }
      setLoading(false);
    }, 1500);
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-headline font-bold text-primary mb-2">Library Check-in</h1>
          <p className="text-muted-foreground">Please provide the reason for using the library today.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="shadow-xl border-none">
            <CardHeader className="bg-primary/5 rounded-t-lg">
              <CardTitle className="text-lg">Visitor Information</CardTitle>
              <CardDescription>Verify your details before proceeding.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Name</Label>
                  <p className="font-semibold">{user.name}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Role</Label>
                  <p className="font-semibold">{user.isEmployee ? 'Faculty/Staff' : 'Student'}</p>
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Institutional Program / Dept</Label>
                  <p className="font-semibold">{user.program}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <Label className="text-sm font-bold">What is your primary purpose today?</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'Studying', icon: BookOpen },
                    { id: 'Researching', icon: Search },
                    { id: 'Computer Use', icon: Monitor },
                    { id: 'Meeting', icon: Users },
                    { id: 'Others', icon: HelpCircle }
                  ].map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => setReason(item.id)}
                      className={`
                        flex items-center p-3 rounded-lg border-2 transition-all cursor-pointer
                        ${reason === item.id ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/20'}
                      `}
                    >
                      <item.icon className={`w-5 h-5 mr-3 ${reason === item.id ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`font-medium ${reason === item.id ? 'text-primary' : ''}`}>{item.id}</span>
                    </div>
                  ))}
                </div>
              </div>

              {reason === 'Others' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="custom-reason" className="text-sm font-semibold">Please specify your reason</Label>
                  <Textarea 
                    id="custom-reason" 
                    placeholder="E.g. Borrowing a book, requesting a transcript..." 
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="min-h-[100px]"
                    required
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-primary/5 rounded-b-lg py-6 mt-4">
              <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Confirm Check-in
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
}


"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { authStore, User } from '@/lib/auth-store';
import { getBlockedUsers, toggleBlockUser } from '@/lib/mock-db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShieldAlert, ShieldCheck, UserMinus, UserPlus, Search, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function UserManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [blockedEmails, setBlockedEmails] = useState<string[]>([]);
  const [emailToBlock, setEmailToBlock] = useState('');

  useEffect(() => {
    const u = authStore.getState().user;
    if (!u || u.role !== 'admin') {
      router.push('/');
    } else {
      setUser(u);
      setBlockedEmails(getBlockedUsers());
    }
  }, [router]);

  const handleToggleBlock = (email: string) => {
    const updated = toggleBlockUser(email);
    setBlockedEmails(updated);
    toast({
      title: updated.includes(email) ? 'User Blocked' : 'User Unblocked',
      description: `${email} access has been ${updated.includes(email) ? 'revoked' : 'restored'}.`,
    });
  };

  const handleManualBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailToBlock.endsWith('@neu.edu.ph')) {
      toast({ variant: 'destructive', title: 'Invalid Email', description: 'Institutional email required.' });
      return;
    }
    handleToggleBlock(emailToBlock);
    setEmailToBlock('');
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Library Access Control</h1>
          <p className="text-muted-foreground">Manage user permissions and security blocks.</p>
        </div>

        <Alert variant="destructive" className="bg-destructive/5 text-destructive border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Administrative Control</AlertTitle>
          <AlertDescription>
            Blocking a user will immediately prevent them from checking into the library. Use this feature with discretion.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-5 gap-8">
          <Card className="md:col-span-2 shadow-sm h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Block New User</CardTitle>
              <CardDescription>Enter the institutional email to revoke access.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualBlock} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    placeholder="user@neu.edu.ph" 
                    value={emailToBlock}
                    onChange={(e) => setEmailToBlock(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" variant="destructive" className="w-full">
                  <ShieldAlert className="w-4 h-4 mr-2" />
                  Apply Access Block
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-3 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Restricted Access List</CardTitle>
                <CardDescription>Currently blocked accounts.</CardDescription>
              </div>
              <ShieldAlert className="w-6 h-6 text-destructive opacity-30" />
            </CardHeader>
            <CardContent>
              {blockedEmails.length > 0 ? (
                <div className="space-y-3">
                  {blockedEmails.map((email) => (
                    <div key={email} className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                          <UserMinus className="w-4 h-4 text-destructive" />
                        </div>
                        <span className="font-medium text-sm">{email}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-primary hover:text-primary hover:bg-primary/5"
                        onClick={() => handleToggleBlock(email)}
                      >
                        <ShieldCheck className="w-4 h-4 mr-1" />
                        Unblock
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-2 border border-dashed rounded-lg">
                  <ShieldCheck className="w-10 h-10 text-muted-foreground opacity-20" />
                  <p className="text-sm text-muted-foreground">No users are currently blocked.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

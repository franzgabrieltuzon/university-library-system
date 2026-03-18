
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { authStore, User } from '@/lib/auth-store';
import { getLogs, VisitorLog, COLLEGES, REASONS } from '@/lib/mock-db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, BookOpen, Clock, TrendingUp, Filter, Calendar as CalendarIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AIInsights from '@/components/admin/AIInsights';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [timeRange, setTimeRange] = useState('day'); // day, week, month, all
  const [filterCollege, setFilterCollege] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const u = authStore.getState().user;
    if (!u || u.role !== 'admin') {
      router.push('/');
    } else {
      setUser(u);
      setLogs(getLogs());
    }
  }, [router]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      
      let inTimeRange = true;
      if (timeRange === 'day') {
        inTimeRange = logDate.toDateString() === now.toDateString();
      } else if (timeRange === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        inTimeRange = logDate >= weekAgo;
      } else if (timeRange === 'month') {
        inTimeRange = logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
      }

      const inCollege = filterCollege === 'all' || log.college === filterCollege;
      const inType = filterType === 'all' || (filterType === 'Employee' ? log.isEmployee : !log.isEmployee);

      return inTimeRange && inCollege && inType;
    });
  }, [logs, timeRange, filterCollege, filterType]);

  const stats = useMemo(() => {
    const total = filteredLogs.length;
    const students = filteredLogs.filter(l => !l.isEmployee).length;
    const staff = filteredLogs.filter(l => l.isEmployee).length;
    
    // Group by reason
    const reasonCounts: Record<string, number> = {};
    filteredLogs.forEach(l => {
      reasonCounts[l.reason] = (reasonCounts[l.reason] || 0) + 1;
    });

    const chartData = Object.entries(reasonCounts).map(([name, value]) => ({ name, value }));
    
    return { total, students, staff, chartData };
  }, [filteredLogs]);

  const COLORS = ['#2752B3', '#39C0E3', '#1e40af', '#0ea5e9', '#0369a1'];

  if (!user) return null;

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground">Real-time statistics and library usage insights.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border shadow-sm">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium mr-2">Filters:</span>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCollege} onValueChange={setFilterCollege}>
                <SelectTrigger className="w-[150px] h-8 text-xs">
                  <SelectValue placeholder="College" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Colleges</SelectItem>
                  {COLLEGES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue placeholder="User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="Student">Students</SelectItem>
                  <SelectItem value="Employee">Employee/Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Visitors" 
            value={stats.total} 
            icon={Users} 
            description={`Total for ${timeRange}`} 
            color="bg-primary" 
          />
          <StatCard 
            title="Students" 
            value={stats.students} 
            icon={UserPlus} 
            description="Active learners" 
            color="bg-accent" 
          />
          <StatCard 
            title="Faculty/Staff" 
            value={stats.staff} 
            icon={ShieldCheck} 
            description="Academic members" 
            color="bg-blue-800" 
          />
          <StatCard 
            title="Avg. Visit Time" 
            value="1.5h" 
            icon={Clock} 
            description="Estimated duration" 
            color="bg-cyan-600" 
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <Card className="lg:col-span-2 shadow-sm border-none overflow-hidden">
            <CardHeader className="bg-white border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-headline font-bold">Usage by Purpose</CardTitle>
                  <CardDescription>Frequency of visitor reasons in current filtered period.</CardDescription>
                </div>
                <TrendingUp className="w-6 h-6 text-accent opacity-50" />
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                      {stats.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights Card */}
          <div className="lg:col-span-1">
            <AIInsights reasons={filteredLogs.map(l => l.reason)} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function StatCard({ title, value, icon: Icon, description, color }: any) {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-bold mt-1 group-hover:text-primary transition-colors">{value}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className={cn("p-4 rounded-2xl text-white shadow-inner", color)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
      <div className={cn("h-1 w-full opacity-30", color)}></div>
    </Card>
  );
}

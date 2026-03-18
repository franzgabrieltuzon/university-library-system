"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { authStore, User } from '@/lib/auth-store';
import { getLogs, VisitorLog, COLLEGES } from '@/lib/mock-db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, Clock, TrendingUp, Filter, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AIInsights from '@/components/admin/AIInsights';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [timeRange, setTimeRange] = useState('day');
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
    
    const reasonCounts: Record<string, number> = {};
    filteredLogs.forEach(l => {
      reasonCounts[l.reason] = (reasonCounts[l.reason] || 0) + 1;
    });

    const chartData = Object.entries(reasonCounts).map(([name, value]) => ({ name, value }));
    
    return { total, students, staff, chartData };
  }, [filteredLogs]);

  // Professional Blue palette
  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

  if (!user) return null;

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-headline font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 text-sm">Overview of library occupancy and usage metrics.</p>
          </div>
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[110px] h-9 border-none bg-transparent">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="all">Overall</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Visitors" value={stats.total} icon={Users} color="text-blue-600" bgColor="bg-blue-50" />
          <StatCard title="Students" value={stats.students} icon={UserPlus} color="text-indigo-600" bgColor="bg-indigo-50" />
          <StatCard title="Faculty & Staff" value={stats.staff} icon={ShieldCheck} color="text-cyan-600" bgColor="bg-cyan-50" />
          <StatCard title="Avg. Visit" value="1.5h" icon={Clock} color="text-slate-600" bgColor="bg-slate-50" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <Card className="lg:col-span-2 shadow-sm border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">Usage Analytics</CardTitle>
                  <CardDescription>Breakdown of visit reasons.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
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

function StatCard({ title, value, icon: Icon, color, bgColor }: any) {
  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn("p-3 rounded-xl", bgColor)}>
            <Icon className={cn("w-5 h-5", color)} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
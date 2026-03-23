"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { authStore, User } from '@/lib/auth-store';
import { getLogs, VisitorLog, COLLEGES } from '@/lib/mock-db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, Clock, TrendingUp, Filter, ShieldCheck, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import AIInsights from '@/components/admin/AIInsights';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [timeRange, setTimeRange] = useState('day');

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

      return inTimeRange;
    });
  }, [logs, timeRange]);

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

  // Premium Blue & Gold palette
  const COLORS = ['#D4AF37', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em]">Overview</span>
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 p-1 bg-[#0a1128] border border-white/5 rounded-xl">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] h-10 border-none bg-transparent text-xs font-bold uppercase tracking-widest text-slate-300">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent className="bg-[#0a1128] border-white/10 text-slate-300">
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
        <StatCard title="Active Visitors" value={stats.total} icon={Activity} color="text-green-400" bgColor="bg-green-400/10" />
        <StatCard title="Total Students" value={stats.students} icon={Users} color="text-blue-400" bgColor="bg-blue-400/10" />
        <StatCard title="Faculty & Staff" value={stats.staff} icon={ShieldCheck} color="text-[#D4AF37]" bgColor="bg-[#D4AF37]/10" />
        <StatCard title="Avg. Usage" value="1.8h" icon={Clock} color="text-purple-400" bgColor="bg-purple-400/10" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="lg:col-span-2 bg-[#0a1128] border-white/5 shadow-2xl rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white tracking-tight">Library Utilization</CardTitle>
                <CardDescription className="text-slate-500 text-xs">Analysis of visit purposes for the selected period.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <Tooltip 
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ backgroundColor: '#0a1128', borderRadius: '12px', border: '1px solid #ffffff10', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
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
  );
}

function StatCard({ title, value, icon: Icon, color, bgColor }: any) {
  return (
    <Card className="bg-[#0a1128] border-white/5 shadow-xl overflow-hidden rounded-2xl group hover:border-[#D4AF37]/30 transition-all duration-300">
      <CardContent className="p-8">
        <div className="flex items-center gap-6">
          <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300", bgColor)}>
            <Icon className={cn("w-6 h-6", color)} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white tracking-tighter">{value}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

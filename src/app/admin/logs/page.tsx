
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { authStore, User } from '@/lib/auth-store';
import { getLogs, VisitorLog, COLLEGES, REASONS, calculateDuration } from '@/lib/mock-db';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileDown, Circle, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, isToday, isWithinInterval, subDays, subMonths, subYears, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

export default function VisitorLogsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReason, setFilterReason] = useState('all');
  const [filterCollege, setFilterCollege] = useState('all');
  const [timeTab, setTimeTab] = useState('All');

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
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
        log.name.toLowerCase().includes(search) || 
        log.email.toLowerCase().includes(search) || 
        log.college.toLowerCase().includes(search) ||
        log.reason.toLowerCase().includes(search);
      
      const matchesReason = filterReason === 'all' || log.reason === filterReason;
      const matchesCollege = filterCollege === 'all' || log.college === filterCollege;
      
      let matchesTab = true;
      const now = new Date();
      const logDate = parseISO(log.timestamp);
      
      if (timeTab === 'Today') {
        matchesTab = isToday(logDate);
      } else if (timeTab === 'Week') {
        matchesTab = isWithinInterval(logDate, { start: subDays(now, 7), end: now });
      } else if (timeTab === 'Month') {
        matchesTab = isWithinInterval(logDate, { start: subMonths(now, 1), end: now });
      } else if (timeTab === 'Year') {
        matchesTab = isWithinInterval(logDate, { start: subYears(now, 1), end: now });
      }

      return matchesSearch && matchesReason && matchesCollege && matchesTab;
    });
  }, [logs, searchTerm, filterReason, filterCollege, timeTab]);

  const handleExport = () => {
    const headers = ['Name', 'Email', 'College', 'Purpose', 'Date', 'Time In', 'Time Out', 'Duration'];
    const rows = filteredLogs.map(l => [
      l.name, l.email, l.college, l.reason, 
      format(parseISO(l.timestamp), 'yyyy-MM-dd'),
      format(parseISO(l.timestamp), 'HH:mm'),
      l.timeout ? format(parseISO(l.timeout), 'HH:mm') : 'Inside',
      calculateDuration(l.timestamp, l.timeout)
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NEU_Library_Logs_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em]">Institutional Records</span>
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Visitor Logs</h1>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/5">
          <ActivityIndicator />
          System Monitoring: Active
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-8 space-y-8 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 transition-colors group-focus-within:text-[#D4AF37]" />
            <Input 
              placeholder="Search by name, email, student number, or college..." 
              className="w-full h-14 bg-[#1e293b] border-white/5 pl-12 text-slate-200 rounded-2xl focus-visible:ring-1 focus-visible:ring-[#D4AF37]/50 placeholder:text-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="lg:col-span-4 flex items-center justify-between bg-[#1e293b] p-1.5 rounded-2xl border border-white/5">
            {['Today', 'Week', 'Month', 'Year', 'All'].map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeTab(tab)}
                className={cn(
                  "flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300",
                  timeTab === tab 
                    ? "bg-[#D4AF37] text-slate-900 shadow-xl" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="lg:col-span-3 flex items-center gap-3">
            <Button 
              onClick={handleExport}
              className="w-full h-14 bg-[#D4AF37] hover:bg-[#b8952c] text-slate-900 font-bold text-[11px] uppercase tracking-widest rounded-2xl shadow-lg transition-transform active:scale-95"
            >
              <FileDown className="w-5 h-5 mr-3" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="flex items-center gap-3 text-slate-500 mr-2">
            <Filter className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Filters:</span>
          </div>
          
          <Select value={filterReason} onValueChange={setFilterReason}>
            <SelectTrigger className="w-[200px] h-11 bg-[#1e293b] border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-300">
              <SelectValue placeholder="All Purposes" />
            </SelectTrigger>
            <SelectContent className="bg-[#1e293b] border-white/10 text-slate-200 rounded-xl">
              <SelectItem value="all">All Purposes</SelectItem>
              {REASONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filterCollege} onValueChange={setFilterCollege}>
            <SelectTrigger className="w-[240px] h-11 bg-[#1e293b] border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-300">
              <SelectValue placeholder="All Colleges" />
            </SelectTrigger>
            <SelectContent className="bg-[#1e293b] border-white/10 text-slate-200 rounded-xl">
              <SelectItem value="all">All Colleges</SelectItem>
              {COLLEGES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Logs Table */}
      <Card className="bg-[#0f172a] border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/[0.03]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-500 h-16 pl-8">Student</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-500 h-16">College</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-500 h-16">Purpose</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-500 h-16 text-center">Date</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-500 h-16 text-center">Time In</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-500 h-16 text-center">Time Out</TableHead>
                <TableHead className="text-[11px] font-bold uppercase tracking-widest text-slate-500 h-16 pr-8 text-right">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.01] transition-colors group">
                    <TableCell className="pl-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm tracking-tight">{log.name}</span>
                        <span className="text-[10px] text-slate-500 font-medium lowercase tracking-tight mt-1">{log.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[11px] font-medium text-slate-400">
                        {log.college}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "rounded-lg border-none px-3 py-1.5 font-bold text-[9px] uppercase tracking-wider",
                        log.reason === 'Studying' ? "bg-blue-500/10 text-blue-400" :
                        log.reason === 'Researching' || log.reason === 'Research' ? "bg-purple-500/10 text-purple-400" :
                        log.reason === 'Group Study' || log.reason === 'Group Work' ? "bg-yellow-500/10 text-yellow-400" :
                        log.reason === 'Printing' ? "bg-pink-500/10 text-pink-400" :
                        log.reason === 'Borrowing Books' ? "bg-green-500/10 text-green-400" :
                        "bg-slate-500/10 text-slate-400"
                      )}>
                        {log.reason}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-xs font-mono text-slate-500">{format(parseISO(log.timestamp), 'yyyy-MM-dd')}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-green-400 bg-green-400/5 px-3 py-1.5 rounded-lg border border-green-400/10">
                        <Circle className="w-1.5 h-1.5 fill-current" />
                        {format(parseISO(log.timestamp), 'HH:mm')}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {log.timeout ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-400 bg-red-400/5 px-3 py-1.5 rounded-lg border border-red-400/10">
                          <Circle className="w-1.5 h-1.5 fill-current" />
                          {format(parseISO(log.timeout), 'HH:mm')}
                        </span>
                      ) : (
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic animate-pulse bg-slate-500/5 px-3 py-1.5 rounded-lg">Inside</span>
                      )}
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <span className="text-xs font-bold text-slate-400">
                        {calculateDuration(log.timestamp, log.timeout)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-30">
                      <Search className="w-10 h-10" />
                      <p className="text-xs font-bold uppercase tracking-[0.2em]">No matching records found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] px-4">
        <span>Showing {filteredLogs.length} of {logs.length} entries</span>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>Real-time Database Connection</span>
        </div>
      </div>
    </div>
  );
}

function ActivityIndicator() {
  return (
    <div className="flex gap-1 items-center">
      <div className="w-1 h-3 bg-[#D4AF37]/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-1 h-4 bg-[#D4AF37]/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-1 h-3 bg-[#D4AF37]/40 rounded-full animate-bounce" />
    </div>
  );
}

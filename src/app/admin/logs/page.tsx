
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
import { Search, FileDown, Circle } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">Visitor Logs</h1>
        <p className="text-slate-400 text-sm">Monitor and manage institutional library access records.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-6 space-y-6 shadow-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input 
            placeholder="Search by name, email, student number, or college..." 
            className="w-full h-12 bg-[#1e293b] border-white/5 pl-12 text-slate-200 focus-visible:ring-1 focus-visible:ring-[#D4AF37]/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-[#1e293b] p-1 rounded-xl border border-white/5">
            {['Today', 'Week', 'Month', 'Year', 'All'].map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeTab(tab)}
                className={cn(
                  "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all",
                  timeTab === tab 
                    ? "bg-[#D4AF37] text-slate-900 shadow-lg" 
                    : "text-slate-400 hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={filterReason} onValueChange={setFilterReason}>
              <SelectTrigger className="w-[180px] h-10 bg-[#1e293b] border-white/5 text-xs font-bold uppercase tracking-widest text-slate-300">
                <SelectValue placeholder="All Purposes" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-white/10 text-slate-200">
                <SelectItem value="all">All Purposes</SelectItem>
                {REASONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filterCollege} onValueChange={setFilterCollege}>
              <SelectTrigger className="w-[180px] h-10 bg-[#1e293b] border-white/5 text-xs font-bold uppercase tracking-widest text-slate-300">
                <SelectValue placeholder="All Colleges" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-white/10 text-slate-200">
                <SelectItem value="all">All Colleges</SelectItem>
                {COLLEGES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            <Button 
              onClick={handleExport}
              className="bg-[#D4AF37] hover:bg-[#b8952c] text-slate-900 font-bold text-xs uppercase tracking-widest px-6 h-10"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <Card className="bg-[#0f172a] border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 h-14 pl-6">Student</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 h-14">College</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 h-14">Purpose</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 h-14">Date</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 h-14">Time In</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 h-14">Time Out</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 h-14 pr-6">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.02] transition-colors h-20">
                    <TableCell className="pl-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm">{log.name}</span>
                        <span className="text-[10px] text-slate-500 font-medium lowercase tracking-tight mt-0.5">{log.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[11px] font-medium text-slate-400">
                        {log.college}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "rounded-md border-none px-3 py-1 font-bold text-[9px] uppercase tracking-wider",
                        log.reason === 'Studying' ? "bg-blue-500/10 text-blue-400" :
                        log.reason === 'Researching' ? "bg-purple-500/10 text-purple-400" :
                        log.reason === 'Group Study' ? "bg-yellow-500/10 text-yellow-400" :
                        log.reason === 'Printing' ? "bg-pink-500/10 text-pink-400" :
                        log.reason === 'Borrowing Books' ? "bg-green-500/10 text-green-400" :
                        "bg-slate-500/10 text-slate-400"
                      )}>
                        {log.reason}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-mono text-slate-400">{format(parseISO(log.timestamp), 'yyyy-MM-dd')}</span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
                        <Circle className="w-1 h-1 fill-current" />
                        {format(parseISO(log.timestamp), 'HH:mm')}
                      </span>
                    </TableCell>
                    <TableCell>
                      {log.timeout ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded border border-red-400/20">
                          <Circle className="w-1 h-1 fill-current" />
                          {format(parseISO(log.timeout), 'HH:mm')}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic animate-pulse">Inside</span>
                      )}
                    </TableCell>
                    <TableCell className="pr-6">
                      <span className="text-xs font-bold text-slate-400">
                        {calculateDuration(log.timestamp, log.timeout)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center text-slate-500 italic">
                    No matching records found in the library logs.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">
        <span>Showing {filteredLogs.length} of {logs.length} records</span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Real-time monitoring active</span>
        </div>
      </div>
    </div>
  );
}

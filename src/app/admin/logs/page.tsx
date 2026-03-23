
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { authStore, User } from '@/lib/auth-store';
import { getLogs, VisitorLog, COLLEGES, REASONS, calculateDuration } from '@/lib/mock-db';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileDown } from 'lucide-react';
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
      <div className="space-y-1">
        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">RECORDS</span>
        <h1 className="text-5xl font-headline font-bold text-white tracking-tighter">Visitor Logs</h1>
      </div>

      <div className="bg-[#0f172a]/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 transition-colors group-focus-within:text-blue-400" />
          <Input 
            placeholder="Search by name, email, student number, or college..." 
            className="w-full h-14 bg-[#1e293b]/50 border-none pl-14 text-slate-200 rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-500/40 placeholder:text-slate-500 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-1 bg-[#1e293b]/50 p-1.5 rounded-2xl">
            {['Today', 'Week', 'Month', 'Year', 'All'].map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeTab(tab)}
                className={cn(
                  "px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300",
                  timeTab === tab 
                    ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]" 
                    : "text-slate-500 hover:text-white hover:bg-white/5"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Select value={filterReason} onValueChange={setFilterReason}>
              <SelectTrigger className="w-[180px] h-12 bg-[#1e293b]/50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300">
                <SelectValue placeholder="All Purposes" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-white/10 text-slate-200 rounded-2xl">
                <SelectItem value="all">All Purposes</SelectItem>
                {REASONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filterCollege} onValueChange={setFilterCollege}>
              <SelectTrigger className="w-[220px] h-12 bg-[#1e293b]/50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300">
                <SelectValue placeholder="All Colleges" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-white/10 text-slate-200 rounded-2xl">
                <SelectItem value="all">All Colleges</SelectItem>
                {COLLEGES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            <div className="h-10 w-px bg-white/5 mx-2" />

            <Button 
              onClick={handleExport}
              className="h-12 px-6 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all"
            >
              <FileDown className="w-4 h-4 mr-3" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-[#0f172a]/20 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 bg-white/[0.02] hover:bg-white/[0.02]">
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 h-16 pl-8">Student</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 h-16">College</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 h-16 text-center">Purpose</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 h-16 text-center">Date</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 h-16 text-center">Time In</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 h-16 text-center">Time Out</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 h-16 pr-8 text-right">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.03] transition-colors">
                  <TableCell className="pl-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-200 text-sm tracking-tight">{log.name}</span>
                      <span className="text-[10px] text-slate-500 font-bold tracking-wider mt-1 uppercase">{log.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {log.college.split(' ').map(w => w[0]).join('')}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className={cn(
                      "inline-flex px-4 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-[0.15em]",
                      log.reason === 'Studying' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                      log.reason === 'Researching' || log.reason === 'Research' ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                      log.reason === 'Group Study' || log.reason === 'Group Work' ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                      log.reason === 'Printing' ? "bg-pink-500/10 text-pink-400 border border-pink-500/20" :
                      log.reason === 'Borrowing Books' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                    )}>
                      {log.reason}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-[11px] font-mono font-bold text-slate-500">{format(parseISO(log.timestamp), 'yyyy-MM-dd')}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-xs font-mono font-black text-green-500/80">
                      {format(parseISO(log.timestamp), 'HH:mm')}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {log.timeout ? (
                      <span className="text-xs font-mono font-black text-red-500/80">
                        {format(parseISO(log.timeout), 'HH:mm')}
                      </span>
                    ) : (
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest animate-pulse">INSIDE</span>
                    )}
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                    <span className="text-[11px] font-black text-slate-400">
                      {calculateDuration(log.timestamp, log.timeout)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-96 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4 opacity-20">
                    <Search className="w-12 h-12" />
                    <p className="text-sm font-black uppercase tracking-[0.3em]">No records matching your criteria</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            Displaying {filteredLogs.length} of {logs.length} records
           </span>
        </div>
      </div>
    </div>
  );
}

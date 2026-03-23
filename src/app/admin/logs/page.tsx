"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { authStore, User } from '@/lib/auth-store';
import { getLogs, VisitorLog, COLLEGES, REASONS, calculateDuration } from '@/lib/mock-db';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileDown, Circle } from 'lucide-react';
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
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="space-y-1 px-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">RECORDS</span>
        <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Visitor Logs</h1>
      </div>

      {/* High-Fidelity Filter Bar */}
      <div className="bg-[#0f172a]/80 backdrop-blur-md border border-white/5 rounded-[20px] p-6 space-y-4 shadow-2xl">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-colors group-focus-within:text-[#D4AF37]" />
          <Input 
            placeholder="Search by name, email, student number, or college..." 
            className="w-full h-12 bg-[#1e293b] border-none pl-12 text-slate-200 rounded-xl focus-visible:ring-1 focus-visible:ring-[#D4AF37]/30 placeholder:text-slate-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-[#1e293b] p-1 rounded-xl">
            {['Today', 'Week', 'Month', 'Year', 'All'].map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeTab(tab)}
                className={cn(
                  "px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all duration-200",
                  timeTab === tab 
                    ? "bg-[#D4AF37] text-slate-900 shadow-lg" 
                    : "text-slate-500 hover:text-white hover:bg-white/5"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Select value={filterReason} onValueChange={setFilterReason}>
              <SelectTrigger className="w-[160px] h-10 bg-[#1e293b] border-none rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-300">
                <SelectValue placeholder="All Purposes" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-white/10 text-slate-200 rounded-xl">
                <SelectItem value="all">All Purposes</SelectItem>
                {REASONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filterCollege} onValueChange={setFilterCollege}>
              <SelectTrigger className="w-[200px] h-10 bg-[#1e293b] border-none rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-300">
                <SelectValue placeholder="All Colleges" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-white/10 text-slate-200 rounded-xl">
                <SelectItem value="all">All Colleges</SelectItem>
                {COLLEGES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            <div className="h-8 w-px bg-white/5 mx-2" />

            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {filteredLogs.length} of {logs.length} records
            </span>

            <Button 
              onClick={handleExport}
              className="h-10 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/20 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Log Table - High Fidelity Design */}
      <div className="bg-transparent overflow-hidden rounded-[20px]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 h-14 pl-6">Student</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 h-14">College</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 h-14 text-center">Purpose</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 h-14 text-center">Date</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 h-14 text-center">Time In</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 h-14 text-center">Time Out</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 h-14 pr-6 text-right">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.02] transition-colors border-none">
                  <TableCell className="pl-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-200 text-sm tracking-tight">{log.name}</span>
                      <span className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5">{log.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                      {log.college === 'College of Computer Studies' ? 'CICS' : 
                       log.college === 'College of Engineering and Architecture' ? 'CEA' : log.college}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className={cn(
                      "inline-flex px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider",
                      log.reason === 'Studying' ? "bg-blue-500/10 text-blue-400" :
                      log.reason === 'Researching' || log.reason === 'Research' ? "bg-purple-500/10 text-purple-400" :
                      log.reason === 'Group Study' || log.reason === 'Group Work' ? "bg-yellow-500/10 text-yellow-400" :
                      log.reason === 'Printing' ? "bg-pink-500/10 text-pink-400" :
                      log.reason === 'Borrowing Books' ? "bg-emerald-500/10 text-emerald-400" :
                      "bg-slate-500/10 text-slate-400"
                    )}>
                      {log.reason}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-[11px] font-mono font-medium text-slate-500">{format(parseISO(log.timestamp), 'yyyy-MM-dd')}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-xs font-mono font-bold text-green-500">
                      {format(parseISO(log.timestamp), 'HH:mm')}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {log.timeout ? (
                      <span className="text-xs font-mono font-bold text-red-500">
                        {format(parseISO(log.timeout), 'HH:mm')}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-600 uppercase italic">Inside</span>
                    )}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <span className="text-[11px] font-bold text-slate-500">
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
      </div>
    </div>
  );
}

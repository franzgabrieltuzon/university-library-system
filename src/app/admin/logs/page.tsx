"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { authStore, User } from '@/lib/auth-store';
import { getLogs, VisitorLog, COLLEGES, REASONS } from '@/lib/mock-db';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
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
        log.program.toLowerCase().includes(search) ||
        log.reason.toLowerCase().includes(search);
      
      const matchesReason = filterReason === 'all' || log.reason === filterReason;
      const matchesCollege = filterCollege === 'all' || log.college === filterCollege;
      
      let matchesTab = true;
      const now = new Date();
      const logDate = new Date(log.timestamp);
      
      if (timeTab === 'Today') {
        matchesTab = logDate.toDateString() === now.toDateString();
      } else if (timeTab === 'Week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesTab = logDate >= weekAgo;
      } else if (timeTab === 'Month') {
        matchesTab = logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
      }

      return matchesSearch && matchesReason && matchesCollege && matchesTab;
    });
  }, [logs, searchTerm, filterReason, filterCollege, timeTab]);

  const handleExport = () => {
    const headers = ['Name', 'Email', 'College', 'Program', 'Purpose', 'Date', 'Time In'];
    const rows = filteredLogs.map(l => [
      l.name, l.email, l.college, l.program, l.reason, 
      format(new Date(l.timestamp), 'yyyy-MM-dd'),
      format(new Date(l.timestamp), 'HH:mm')
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
        <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em]">Records</span>
        <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Visitor Logs</h1>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0a1128] border border-white/5 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input 
            placeholder="Search by name, email, student number, or college..." 
            className="w-full h-14 bg-[#111c3a] border-white/5 pl-12 text-slate-200 focus-visible:ring-1 focus-visible:ring-[#D4AF37]/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-[#111c3a] p-1 rounded-xl border border-white/5">
            {['Today', 'Week', 'Month', 'Year', 'All'].map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeTab(tab)}
                className={cn(
                  "px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all",
                  timeTab === tab 
                    ? "bg-[#D4AF37] text-[#0a1128] shadow-lg" 
                    : "text-slate-400 hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={filterReason} onValueChange={setFilterReason}>
              <SelectTrigger className="w-[180px] h-10 bg-[#111c3a] border-white/5 text-xs font-bold uppercase tracking-widest">
                <SelectValue placeholder="All Purposes" />
              </SelectTrigger>
              <SelectContent className="bg-[#111c3a] border-white/10 text-slate-200">
                <SelectItem value="all">All Purposes</SelectItem>
                {REASONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filterCollege} onValueChange={setFilterCollege}>
              <SelectTrigger className="w-[180px] h-10 bg-[#111c3a] border-white/5 text-xs font-bold uppercase tracking-widest">
                <SelectValue placeholder="All Colleges" />
              </SelectTrigger>
              <SelectContent className="bg-[#111c3a] border-white/10 text-slate-200">
                <SelectItem value="all">All Colleges</SelectItem>
                {COLLEGES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            <div className="h-6 w-px bg-white/10 mx-2 hidden md:block" />

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {filteredLogs.length} of {logs.length} records
              </span>
              <Button 
                onClick={handleExport}
                className="bg-[#D4AF37] hover:bg-[#b8952c] text-[#0a1128] font-bold text-[10px] uppercase tracking-widest px-6"
              >
                <FileDown className="w-3.5 h-3.5 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <Card className="bg-[#0a1128] border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 h-14">Student</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 h-14">College</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 h-14">Purpose</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 h-14">Date</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 h-14">Time In</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 h-14">Time Out</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500 h-14">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.02] transition-colors h-20">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm">{log.name}</span>
                        <span className="text-[10px] text-slate-500 font-medium lowercase tracking-tight mt-0.5">{log.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {log.program.includes('BS') ? 'CICS' : log.program}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "rounded-md border-none px-3 py-1 font-bold text-[10px] uppercase tracking-tighter",
                        log.reason === 'Studying' ? "bg-blue-500/10 text-blue-400" :
                        log.reason === 'Researching' ? "bg-purple-500/10 text-purple-400" :
                        log.reason === 'Group Study' ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-slate-500/10 text-slate-400"
                      )}>
                        {log.reason}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-mono text-slate-400">{format(new Date(log.timestamp), 'yyyy-MM-dd')}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                        {format(new Date(log.timestamp), 'HH:mm')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium text-slate-500 italic">Inside</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium text-slate-600">—</span>
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
    </div>
  );
}

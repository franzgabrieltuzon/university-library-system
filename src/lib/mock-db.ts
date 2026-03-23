
"use client";

import { differenceInMinutes, format, parseISO } from 'date-fns';

export interface VisitorLog {
  id: string;
  name: string;
  email: string;
  program: string;
  college: string;
  reason: string;
  timestamp: string; // Time In
  timeout?: string;  // Time Out
  isEmployee: boolean;
  type: string;
}

const STORAGE_KEY_LOGS = 'neu_library_logs';
const STORAGE_KEY_BLOCKED = 'neu_library_blocked';

const COLLEGES = [
  "College of Arts and Sciences",
  "College of Engineering and Architecture",
  "College of Education",
  "College of Business Administration",
  "College of Computer Studies",
  "College of Communication",
  "College of Nursing",
  "College of Law",
  "College of Music"
];

const REASONS = [
  "Studying",
  "Researching",
  "Group Study",
  "Use of Computer",
  "Borrowing Books",
  "Returning Books",
  "Printing",
  "Other"
];

const generateMockLogs = (): VisitorLog[] => {
  const now = new Date();
  const logs: VisitorLog[] = [
    { 
      id: '1', 
      name: 'Julianne Reyes', 
      email: 'jreyes@neu.edu.ph', 
      program: 'BSCS', 
      college: 'College of Computer Studies', 
      reason: 'Studying', 
      timestamp: new Date(now.getTime() - 1000 * 60 * 163).toISOString(), // 2h 43m ago
      timeout: now.toISOString(),
      isEmployee: false, 
      type: 'Student' 
    },
    { 
      id: '2', 
      name: 'Mark Anthony', 
      email: 'manthony@neu.edu.ph', 
      program: 'BSEd', 
      college: 'College of Education', 
      reason: 'Researching', 
      timestamp: new Date(now.getTime() - 1000 * 60 * 45).toISOString(),
      isEmployee: false, 
      type: 'Student' 
    },
    { 
      id: '3', 
      name: 'Sarah Gomez', 
      email: 'sgomez@neu.edu.ph', 
      program: 'BSBA', 
      college: 'College of Business Administration', 
      reason: 'Printing', 
      timestamp: new Date(now.getTime() - 1000 * 60 * 10).toISOString(),
      timeout: new Date(now.getTime() - 1000 * 60 * 2).toISOString(),
      isEmployee: false, 
      type: 'Student' 
    },
    { 
      id: '4', 
      name: 'Prof. Ricardo L.', 
      email: 'rlopez@neu.edu.ph', 
      program: 'Faculty', 
      college: 'College of Arts and Sciences', 
      reason: 'Borrowing Books', 
      timestamp: new Date(now.getTime() - 86400000).toISOString(), // Yesterday
      timeout: new Date(now.getTime() - 86400000 + 3600000).toISOString(),
      isEmployee: true, 
      type: 'Faculty' 
    },
    { 
      id: '5', 
      name: 'Daniel Sy', 
      email: 'dsy@neu.edu.ph', 
      program: 'BSIT', 
      college: 'College of Computer Studies', 
      reason: 'Group Study', 
      timestamp: new Date(now.getTime() - 1000 * 60 * 120).toISOString(),
      isEmployee: false, 
      type: 'Student' 
    }
  ];
  return logs;
};

export const getLogs = (): VisitorLog[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY_LOGS);
  if (!stored) {
    const initial = generateMockLogs();
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

export const addLog = (log: Omit<VisitorLog, 'id' | 'timestamp'>) => {
  const logs = getLogs();
  const newLog: VisitorLog = {
    ...log,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString()
  };
  const updated = [newLog, ...logs];
  localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updated));
  return newLog;
};

export const getBlockedUsers = (): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY_BLOCKED);
  return stored ? JSON.parse(stored) : [];
};

export const toggleBlockUser = (email: string) => {
  const blocked = getBlockedUsers();
  const updated = blocked.includes(email) 
    ? blocked.filter(e => e !== email)
    : [...blocked, email];
  localStorage.setItem(STORAGE_KEY_BLOCKED, JSON.stringify(updated));
  return updated;
};

export const calculateDuration = (start: string, end?: string) => {
  if (!end) return "—";
  const minutes = differenceInMinutes(parseISO(end), parseISO(start));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

export { COLLEGES, REASONS };

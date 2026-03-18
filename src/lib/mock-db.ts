
"use client";

export interface VisitorLog {
  id: string;
  name: string;
  email: string;
  program: string;
  college: string;
  reason: string;
  timestamp: string;
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
  "College of Nursing"
];

const REASONS = [
  "Studying",
  "Researching",
  "Computer Use",
  "Meeting",
  "Reading",
  "Leisure",
  "Others"
];

const INITIAL_LOGS: VisitorLog[] = [
  { id: '1', name: 'John Doe', email: 'jdoe@neu.edu.ph', program: 'BSCS', college: COLLEGES[4], reason: 'Researching', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), isEmployee: false, type: 'Student' },
  { id: '2', name: 'Jane Smith', email: 'jsmith@neu.edu.ph', program: 'BSEd', college: COLLEGES[2], reason: 'Studying', timestamp: new Date(Date.now() - 86400000).toISOString(), isEmployee: false, type: 'Student' },
  { id: '3', name: 'Prof. Garcia', email: 'pgarcia@neu.edu.ph', program: 'Faculty', college: COLLEGES[0], reason: 'Reading', timestamp: new Date().toISOString(), isEmployee: true, type: 'Faculty' },
  { id: '4', name: 'JC Esperanza', email: 'jcesperanza@neu.edu.ph', program: 'Admin', college: COLLEGES[4], reason: 'Meeting', timestamp: new Date().toISOString(), isEmployee: true, type: 'Staff' }
];

export const getLogs = (): VisitorLog[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY_LOGS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(INITIAL_LOGS));
    return INITIAL_LOGS;
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

export { COLLEGES, REASONS };

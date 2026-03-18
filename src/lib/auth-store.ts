
"use client";

import { create } from 'zustand';

export type UserRole = 'visitor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  program: string;
  college: string;
  role: UserRole;
  isEmployee: boolean;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// We simulate Zustand using a simple pattern since we can't install it.
// Actually, I'll just use a standard React context or a singleton pattern for this small app.
// Let's use a standard singleton with listeners.

type Listener = (state: AuthState) => void;
let state: AuthState = {
  user: null,
  setUser: (u) => {
    state.user = u;
    notify();
  },
  logout: () => {
    state.user = null;
    notify();
  }
};

const listeners = new Set<Listener>();
const notify = () => listeners.forEach(l => l(state));

export const authStore = {
  getState: () => state,
  subscribe: (l: Listener) => {
    listeners.add(l);
    return () => listeners.delete(l);
  }
};

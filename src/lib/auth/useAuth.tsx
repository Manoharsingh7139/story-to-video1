import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { ensureDemoUser } from "./demoUser";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: number;
}

interface StoredUser extends AuthUser {
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (patch: Partial<Pick<AuthUser, "name" | "email">>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USERS_KEY = "cs.users";
const SESSION_KEY = "cs.user";

const readUsers = (): StoredUser[] => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
};
const writeUsers = (u: StoredUser[]) => localStorage.setItem(USERS_KEY, JSON.stringify(u));

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ensureDemoUser();
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 350));
    const users = readUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found || found.password !== password) {
      throw new Error("Invalid email or password");
    }
    const u: AuthUser = { id: found.id, email: found.email, name: found.name, createdAt: found.createdAt };
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 400));
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with that email already exists");
    }
    const stored: StoredUser = {
      id: `u-${Date.now()}`,
      email, name, password,
      createdAt: Date.now(),
    };
    writeUsers([...users, stored]);
    const u: AuthUser = { id: stored.id, email: stored.email, name: stored.name, createdAt: stored.createdAt };
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback((patch: Partial<Pick<AuthUser, "name" | "email">>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      const users = readUsers();
      writeUsers(users.map((u) => (u.id === prev.id ? { ...u, ...patch } : u)));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

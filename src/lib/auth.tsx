import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type UserRole = "faculty" | "admin";

export interface AppUser {
  name: string;
  email: string;
  role: UserRole;
  title: string;
  initials: string;
}

interface AuthContextValue {
  user: AppUser | null;
  ready: boolean;
  login: (role: UserRole) => AppUser;
  logout: () => void;
}

const STORAGE_KEY = "sentinelface.user";

const PRESETS: Record<UserRole, AppUser> = {
  faculty: {
    name: "Dr. Ramesh Kumar",
    email: "ramesh.kumar@university.edu",
    role: "faculty",
    title: "Faculty",
    initials: "RK",
  },
  admin: {
    name: "Anita Sharma",
    email: "anita.sharma@university.edu",
    role: "admin",
    title: "Administrator",
    initials: "AS",
  },
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as AppUser);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      login: (role) => {
        const next = PRESETS[role];
        setUser(next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      },
      logout: () => {
        setUser(null);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
      },
    }),
    [user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { PRESETS as AUTH_PRESETS };

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DEPARTMENTS,
  SUBJECTS,
  STUDENTS as STUDENTS_MOCK,
  PROXY_ALERTS,
  type StudentRecord,
  type ProxyAlert,
} from "./mock-data";

interface DashboardStateValue {
  department: string;
  subject: string;
  students: StudentRecord[];
  proxyAlerts: ProxyAlert[];
  setDepartment: (department: string) => void;
  setSubject: (subject: string) => void;
  addStudent: (student: Omit<StudentRecord, "id"> & { id?: string; [key: string]: unknown }) => void;
  addProxyAlert: (alert: Omit<ProxyAlert, "id" | "status">) => void;
  resolveProxyAlert: (id: string) => void;
}

const STORAGE_KEY = "sentinelface.dashboard-state";
const ALERTS_STORAGE_KEY = "sentinelface.proxy-alerts";
const DashboardStateContext = createContext<DashboardStateValue | null>(null);

export function DashboardStateProvider({ children }: { children: ReactNode }) {
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0]);
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [students, setStudents] = useState<StudentRecord[]>(STUDENTS_MOCK);
  const [proxyAlerts, setProxyAlerts] = useState<ProxyAlert[]>(PROXY_ALERTS);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StudentRecord[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStudents(parsed);
        }
      }
    } catch {
      // ignore storage failures
    }
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ALERTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ProxyAlert[];
        if (Array.isArray(parsed)) {
          setProxyAlerts(parsed);
        }
      }
    } catch {
      // ignore storage failures
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch {
      // ignore storage failures
    }
  }, [students]);

  useEffect(() => {
    try {
      window.localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(proxyAlerts));
    } catch {
      // ignore storage failures
    }
  }, [proxyAlerts]);

  const addStudent = (student: Omit<StudentRecord, "id"> & { id?: string }) => {
    const next: StudentRecord = {
      id: student.id ?? `s-${Date.now()}`,
      ...student,
    };
    setStudents((current) => [...current, next]);
  };

  const addProxyAlert = (alert: Omit<ProxyAlert, "id" | "status">) => {
    const next: ProxyAlert = {
      id: `ALRT-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      status: "active",
      ...alert,
    };
    setProxyAlerts((current) => [next, ...current]);
  };

  const resolveProxyAlert = (id: string) => {
    setProxyAlerts((current) =>
      current.map((alert) => (alert.id === id ? { ...alert, status: "resolved" } : alert)),
    );
  };

  const value = useMemo(
    () => ({
      department,
      subject,
      students,
      proxyAlerts,
      setDepartment,
      setSubject,
      addStudent,
      addProxyAlert,
      resolveProxyAlert,
    }),
    [department, subject, students, proxyAlerts],
  );

  return <DashboardStateContext.Provider value={value}>{children}</DashboardStateContext.Provider>;
}

export function useDashboardState() {
  const ctx = useContext(DashboardStateContext);
  if (!ctx) {
    throw new Error("useDashboardState must be used within DashboardStateProvider");
  }
  return ctx;
}

type SmartAttendanceErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type SmartAttendanceEvents = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: SmartAttendanceErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __smartAttendanceEvents?: SmartAttendanceEvents;
  }
}

export function reportSmartAttendanceError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.__smartAttendanceEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  );
}

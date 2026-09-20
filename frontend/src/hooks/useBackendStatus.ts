// useBackendStatus.ts
// Layer: hook (logic and state). Checks the backend every few seconds
// and tells the page whether it is connecting, online or offline.
// It also gives you a refresh function, used after uploads.

import { useCallback, useEffect, useState } from "react";

import { getHealth } from "../api/client";
import type { HealthReport } from "../types/api";

export type BackendStatus =
  | { state: "connecting" }
  | { state: "online"; report: HealthReport }
  | { state: "offline" };

export function useBackendStatus(pollMs = 15000) {
  const [status, setStatus] = useState<BackendStatus>({ state: "connecting" });

  const refresh = useCallback(async () => {
    try {
      const report = await getHealth();
      setStatus({ state: "online", report });
    } catch {
      setStatus({ state: "offline" });
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = setInterval(() => void refresh(), pollMs);

    // Cleanup: stop checking when the page is closed
    return () => clearInterval(timer);
  }, [refresh, pollMs]);

  return { status, refresh };
}
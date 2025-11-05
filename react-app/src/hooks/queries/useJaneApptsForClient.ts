import { useEffect, useState } from "react";

export type JaneAppointment = {
  id?: string;
  date?: string;
  clinician?: string;
  service?: string;
  visitType?: string;
  insurance?: string;
  clientId?: string;
};

export default function useJaneApptsForClient(
  startDate?: string | null,
  endDate?: string | null,
  clientId?: string | null,
) {
  const [data, setData] = useState<JaneAppointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!clientId) {
      setData([]);
      setError(null);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        const params = new URLSearchParams();
        if (clientId) params.set("clientId", clientId);
        if (startDate) params.set("startDate", startDate);
        if (endDate) params.set("endDate", endDate);

        const res = await fetch(`/jane/appointments?${params.toString()}`, {
          signal: controller.signal,
          headers: { "Accept": "application/json" },
        });

        if (controller.signal.aborted) return;

        if (!res.ok) {
          const errText = await res.text().catch(() => res.statusText);
          const err = { status: res.status, message: errText };
          if (!cancelled) setError(err);
          return;
        }

        const json = await res.json();
        if (!cancelled) setData(Array.isArray(json) ? json : []);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [startDate, endDate, clientId]);

  return { data, isLoading, error };
}
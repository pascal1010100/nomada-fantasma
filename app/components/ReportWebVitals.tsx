"use client";

import { useReportWebVitals } from "next/web-vitals";

type VitalPayload = {
  id: string;
  name: string;
  value: number;
  label: string;
  rating?: "good" | "needs-improvement" | "poor";
  delta?: number;
  navigationType?: string;
  url?: string;
};

export default function ReportWebVitals() {
  useReportWebVitals((metric) => {
    // Send to internal endpoint (no PII)
    const payload: VitalPayload = {
      id: metric.id,
      name: metric.name,
      value: metric.value,
      label: metric.label,
      rating: metric.rating,
      delta: metric.delta,
      navigationType: metric.navigationType,
      url: typeof window !== "undefined" ? window.location.pathname : undefined,
    };

    // Fire-and-forget
    fetch("/api/vitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  });

  return null;
}

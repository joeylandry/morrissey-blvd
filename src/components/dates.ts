import { useEffect, useState } from "react";

// Today as YYYY-MM-DD in the viewer's timezone. Null during SSR so the
// server and client never disagree about which shows have passed.
export function useToday() {
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    setToday(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  }, []);
  return today;
}

const at = (iso: string) => new Date(`${iso}T12:00:00`);

export const shortDate = (iso: string) => `${at(iso).getMonth() + 1}/${at(iso).getDate()}`;

export const dateParts = (iso: string) => ({
  month: at(iso).toLocaleString("en-US", { month: "short" }),
  day: at(iso).getDate(),
  weekday: at(iso).toLocaleString("en-US", { weekday: "short" }),
});

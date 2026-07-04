import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import * as api from "../services/api";

const EntryContext = createContext(null);

export function EntryProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch entries on mount ──
  useEffect(() => {
    let cancelled = false;
    async function fetchEntries() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getEntries();
        if (!cancelled) setEntries(data);
      } catch (err) {
        console.error("Failed to fetch entries:", err);
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchEntries();
    return () => { cancelled = true; };
  }, []);

  // ── CRUD operations via API ──
  const addEntry = useCallback(async (data) => {
    try {
      const entry = await api.createEntry(data);
      setEntries((prev) => [entry, ...prev]);
      return entry;
    } catch (err) {
      console.error("Failed to create entry:", err);
      throw err;
    }
  }, []);

  const deleteEntry = useCallback(async (id) => {
    try {
      await api.deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to delete entry:", err);
      throw err;
    }
  }, []);

  const updateEntry = useCallback(async (id, data) => {
    try {
      const updated = await api.updateEntry(id, data);
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? updated : e))
      );
      return updated;
    } catch (err) {
      console.error("Failed to update entry:", err);
      throw err;
    }
  }, []);

  const getEntryById = useCallback(
    (id) => entries.find((e) => e.id === Number(id)),
    [entries]
  );

  const refetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getEntries();
      setEntries(data);
    } catch (err) {
      console.error("Failed to refetch entries:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // all unique tags from entries (for autocomplete)
  const allTags = useMemo(() => {
    const tagSet = new Set();
    entries.forEach((e) => e.tags?.forEach((tag) => tagSet.add(tag)));
    return [...tagSet].sort();
  }, [entries]);

  // ── Computed values ──
  const contributions = useMemo(() => {
    const map = {};
    entries.forEach((e) => {
      map[e.date] = (map[e.date] || 0) + 1;
    });
    return map;
  }, [entries]);

  const today = new Date().toISOString().split("T")[0];

  const entriesToday = useMemo(
    () => contributions[today] || 0,
    [contributions, today]
  );

  const totalEntries = entries.length;

  const thisMonthEntries = useMemo(() => {
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return entries.filter((e) => e.date.startsWith(ym)).length;
  }, [entries]);

  // streak calculations
  const { currentStreak, longestStreak } = useMemo(() => {
    if (entries.length === 0) return { currentStreak: 0, longestStreak: 0 };

    const dates = [...new Set(entries.map((e) => e.date))].sort().reverse();

    let current = 0;
    let longest = 0;
    let streak = 1;

    for (let i = 0; i < dates.length; i++) {
      const d = new Date(dates[i] + "T00:00:00");
      const ref = new Date(today + "T00:00:00");
      ref.setDate(ref.getDate() - i);

      if (i === 0) {
        const diff = Math.round((ref - d) / (1000 * 60 * 60 * 24));
        if (Math.abs(diff) <= 1) current = 1;
      } else {
        const prev = new Date(dates[i - 1] + "T00:00:00");
        const dayDiff = Math.round((prev - d) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) {
          streak++;
          if (current > 0 && i <= current + 1) current = streak;
        } else {
          streak = 1;
        }
      }
      longest = Math.max(longest, streak);
    }

    return { currentStreak: Math.max(current, 1), longestStreak: Math.max(longest, 1) };
  }, [entries, today]);

  const weeklyDays = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const days = new Set();
    entries.forEach((e) => {
      const d = new Date(e.date + "T00:00:00");
      if (d >= startOfWeek && d <= now) days.add(e.date);
    });
    return days.size;
  }, [entries]);

  const topTags = useMemo(() => {
    const counts = {};
    entries.forEach((e) => {
      e.tags?.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag]) => tag);
  }, [entries]);

  const value = useMemo(
    () => ({
      entries,
      loading,
      error,
      addEntry,
      deleteEntry,
      updateEntry,
      getEntryById,
      refetchEntries,
      allTags,
      contributions,
      entriesToday,
      totalEntries,
      thisMonthEntries,
      currentStreak,
      longestStreak,
      weeklyDays,
      topTags,
    }),
    [
      entries,
      loading,
      error,
      addEntry,
      deleteEntry,
      updateEntry,
      getEntryById,
      refetchEntries,
      allTags,
      contributions,
      entriesToday,
      totalEntries,
      thisMonthEntries,
      currentStreak,
      longestStreak,
      weeklyDays,
      topTags,
    ]
  );

  return (
    <EntryContext.Provider value={value}>{children}</EntryContext.Provider>
  );
}

export function useEntries() {
  const ctx = useContext(EntryContext);
  if (!ctx) throw new Error("useEntries must be used within EntryProvider");
  return ctx;
}

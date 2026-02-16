"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "tool-bag-selection";

export function useSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSelectedIds(new Set(JSON.parse(stored)));
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...selectedIds]));
    }
  }, [selectedIds, hydrated]);

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelectedIds(new Set()), []);

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const setFromIds = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  return {
    selectedIds,
    toggle,
    remove,
    clear,
    isSelected,
    setFromIds,
    count: selectedIds.size,
    hydrated,
  };
}

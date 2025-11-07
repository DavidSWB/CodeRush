import { useCallback } from 'react';

// Simple wrapper around localStorage to centralize keys and (de)serialization.
export default function useLocalPersistence(prefix = 'coderush') {
  const keyFor = useCallback((k) => `${prefix}-${k}`, [prefix]);

  const get = useCallback((k, defaultValue = null) => {
    try {
      const raw = localStorage.getItem(keyFor(k));
      if (raw === null || raw === undefined) return defaultValue;
      return JSON.parse(raw);
    } catch (e) {
      // fallback to raw value
      const raw = localStorage.getItem(keyFor(k));
      return raw === null ? defaultValue : raw;
    }
  }, [keyFor]);

  const set = useCallback((k, v) => {
    try {
      if (v === undefined || v === null) {
        localStorage.removeItem(keyFor(k));
        return;
      }
      // store primitives and objects as JSON
      localStorage.setItem(keyFor(k), typeof v === 'string' ? v : JSON.stringify(v));
    } catch (e) {
      // ignore storage errors
    }
  }, [keyFor]);

  const persistState = useCallback((obj = {}) => {
    Object.entries(obj).forEach(([k, v]) => set(k, v));
  }, [set]);

  return { get, set, persistState };
}

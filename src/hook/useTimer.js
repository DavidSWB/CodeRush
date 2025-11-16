import { useEffect, useRef, useState } from 'react';

export default function useTimer({ initialLimit = 15, min = 5, max = 180, onTimeout } = {}) {
  const [timeLimit, setTimeLimitRaw] = useState(initialLimit);
  const [timeRemaining, setTimeRemaining] = useState(initialLimit);
  const [isPaused, setIsPaused] = useState(false);
  const [started, setStarted] = useState(false);

  const timerRef = useRef(null);
  const exerciseStartRef = useRef(null);
  const pauseStartRef = useRef(null);
  const pausedAccumRef = useRef(0);
  // callbackRef removed; callbacks will be executed synchronously when setting limit

  useEffect(() => {
    // keep timeRemaining in sync when timeLimit changes between exercises
    setTimeRemaining(timeLimit);
    console.log('[TTE UPDATE] timeLimit changed:', { newTimeLimit: timeLimit, timeRemaining: timeLimit });
  }, [timeLimit]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startInterval = () => {
    // Limpiar intervalo existente si hay uno
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Crear nuevo intervalo
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        console.log('[TIMER TICK]', { timeRemaining: prev });
        if (prev <= 1) {
          console.log('[TIMER TICK] TIMEOUT - timeRemaining:', { prev });
          clearInterval(timerRef.current);
          timerRef.current = null;
          setStarted(false);
          if (typeof onTimeout === 'function') onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // new wrapper setter which accepts an optional callback to be executed after state change
  const setTimeLimit = (newLimit, callback = null) => {
    // Update the underlying state
    setTimeLimitRaw(newLimit);
    // Immediately sync timeRemaining to avoid leftover seconds from previous exercise
    try {
      setTimeRemaining(newLimit);
    } catch (e) { /* ignore */ }
    // Execute callback synchronously so callers can perform post-update actions
    if (typeof callback === 'function') {
      try { callback(); } catch (e) { /* ignore */ }
    }
  };

  const stopInterval = () => {
    if (timerRef.current) {
      console.log('[TIMER TICK] stopInterval called', { timeRemaining });
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const notifyTypingStarted = () => {
    // Iniciar temporizador si no está pausado y no ha comenzado
    if (!isPaused && !started) {
      exerciseStartRef.current = Date.now();
      pausedAccumRef.current = 0;
      setStarted(true);
      startInterval(); // Iniciar intervalo
    }
  };

  const pause = () => {
    if (!isPaused) {
      setIsPaused(true);
      pauseStartRef.current = Date.now();
      stopInterval();
    }
  };

  const resume = () => {
    if (isPaused) {
      setIsPaused(false);
      if (pauseStartRef.current) {
        pausedAccumRef.current += (Date.now() - pauseStartRef.current);
        pauseStartRef.current = null;
      }
      if (exerciseStartRef.current !== null && timeRemaining > 0) startInterval();
    }
  };

  const addSeconds = (n = 1) => {
    if (!started) return false;
    if (isPaused) return false;
    if (timeRemaining <= 0) return false;
    setTimeRemaining(prev => Math.max(0, prev + n));
    return true;
  };

  const stopAndComputeUsed = () => {
    stopInterval();
    const finish = Date.now();
    const start = exerciseStartRef.current || finish;
    const msUsed = Math.max(0, finish - start - (pausedAccumRef.current || 0));
    const timeUsedSeconds = Math.max(1, Math.round(msUsed / 1000));
    // reset started, but keep exerciseStartRef for possible later use
    setStarted(false);
    return { msUsed, timeUsedSeconds };
  };

  const resetForNewExercise = () => {
    stopInterval();
    exerciseStartRef.current = null;
    pauseStartRef.current = null;
    pausedAccumRef.current = 0;
    setIsPaused(false);
    setStarted(false);
    setTimeRemaining(timeLimit);
  };

  return {
    timeLimit,
    setTimeLimit,
    timeRemaining,
    isPaused,
    started,
    notifyTypingStarted,
    pause,
    resume,
    addSeconds,
    stopAndComputeUsed,
    resetForNewExercise
  };
}

import { useEffect, useState, useRef } from 'react';
import { ejerciciosBasicos } from '../niveles/basicos';
import { ejerciciosIntermedios } from '../niveles/medios';
import { ejerciciosAvanzados } from '../niveles/avanzado';
import { initBackground, removeBackground } from '../background.js';
import { getRandomQuestion } from '../data/quizData';
import useLocalPersistence from './useLocalPersistence';

const getRandomExercise = (exercises) => exercises[Math.floor(Math.random() * exercises.length)];

export default function useExerciseManager({ onCorrectQuiz, onAdjustTimeLimit, onResetTimeLimit } = {}) {
  const persist = useLocalPersistence();
  const isFirstGenerationRef = useRef(true); // Track if this is the first exercise generation

  const [activeLevels, setActiveLevels] = useState(() => persist.get('active-levels', ['basic']));
  const [currentExerciseLevel, setCurrentExerciseLevel] = useState('basic');
  const [exercise, setExercise] = useState({ code: '', description: '' });

  const [unlockedLevels, setUnlockedLevels] = useState(() => persist.get('unlocked', ['basic']));
  const [completedBasic, setCompletedBasic] = useState(() => persist.get('completed-basic', 0) || 0);
  const [completedIntermediate, setCompletedIntermediate] = useState(() => persist.get('completed-intermediate', 0) || 0);
  const [completedAdvanced, setCompletedAdvanced] = useState(() => persist.get('completed-advanced', 0) || 0);

  const [lastTimes, setLastTimes] = useState(() => persist.get('last-times', []) || []);
  const [lastConsumptions, setLastConsumptions] = useState(() => persist.get('last-consumptions', []) || []);

  const [bestStreak, setBestStreak] = useState(() => persist.get('best-streak', 0) || 0);
  const [streakRecords, setStreakRecords] = useState(() => persist.get('streak-records', []) || []);
  // scoring and streak
  const [score, setScore] = useState(() => persist.get('score', 0) || 0);
  const [streak, setStreakRaw] = useState(0);

  // wrap setStreak so that when streak resets to 0 we also reset score
  const setStreak = (val) => {
    setStreakRaw(val);
    if (val === 0) {
      setScore(0);
      persist.set('score', 0);
    }
  };

  // QUIZ
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);

  // Track the next time limit to apply at exercise generation
  const [nextTimeLimit, setNextTimeLimit] = useState(15);

  // quiz questions are sourced from data/quizData and a random question is chosen per completion

  useEffect(() => {
    persist.persistState({
      'active-levels': activeLevels,
      'completed-basic': completedBasic,
      'completed-intermediate': completedIntermediate,
      'completed-advanced': completedAdvanced,
      'last-times': lastTimes,
      'last-consumptions': lastConsumptions,
      'best-streak': bestStreak,
      'streak-records': streakRecords,
      'unlocked': unlockedLevels,
      'score': score
    });
  }, [activeLevels, completedBasic, completedIntermediate, completedAdvanced, lastTimes, lastConsumptions, bestStreak, streakRecords, unlockedLevels, score, persist]);

  const generateNewExercise = () => {
    const randomLevel = activeLevels[Math.floor(Math.random() * activeLevels.length)];
    let exercises;
    switch (randomLevel) {
      case 'basic': exercises = ejerciciosBasicos; break;
      case 'intermediate': exercises = ejerciciosIntermedios; break;
      case 'advanced': exercises = ejerciciosAvanzados; break;
      default: exercises = ejerciciosBasicos;
    }
    const newExerciseObject = getRandomExercise(exercises);
    setCurrentExerciseLevel(randomLevel);
    setExercise(newExerciseObject);
    
    // ONLY apply time limit on first generation (app startup)
    // After that, the time is applied in useExerciseFlow when exercise completes
    if (isFirstGenerationRef.current) {
      isFirstGenerationRef.current = false;
      if (typeof onAdjustTimeLimit === 'function') {
        try {
          onAdjustTimeLimit(nextTimeLimit);
        } catch (e) {
          // ignore
        }
      }
    }
    // showQuiz will be controlled by the parent when appropriate
  };

  const unlockLevel = (newLevel) => {
    if (!unlockedLevels.includes(newLevel)) {
      const newUnlocked = [...unlockedLevels, newLevel];
      setUnlockedLevels(newUnlocked);
      persist.set('unlocked', newUnlocked);
    }
  };

  const toggleLevel = (levelToToggle) => {
    if (!unlockedLevels.includes(levelToToggle)) {
      const needed = levelToToggle === 'intermediate' ? 10 - completedBasic : levelToToggle === 'advanced' ? 10 - completedIntermediate : 0;
      alert(`Te faltan ${needed} ejercicios para desbloquear este nivel`);
      return;
    }
    setActiveLevels(prev => prev.includes(levelToToggle) ? prev.filter(l => l !== levelToToggle) : [...prev, levelToToggle]);
    setCurrentExerciseLevel(levelToToggle);
  };

  const resetProgress = () => {
    // reset persisted app keys and local state
    persist.persistState({
      'active-levels': ['basic'],
      'unlocked': ['basic'],
      'completed-basic': 0,
      'completed-intermediate': 0,
      'completed-advanced': 0,
      'last-times': [],
      'last-consumptions': [],
      'best-streak': 0,
      'streak-records': [],
      'score': 0
    });
    setActiveLevels(['basic']);
    setCurrentExerciseLevel('basic');
    setUnlockedLevels(['basic']);
    setCompletedBasic(0);
    setCompletedIntermediate(0);
    setCompletedAdvanced(0);
    setLastTimes([]);
    setLastConsumptions([]);
    setBestStreak(0);
    setStreakRecords([]);
    setNextTimeLimit(15); // reset next time limit to default
    // Reset time limit to default (15s)
    if (typeof onResetTimeLimit === 'function') {
      try {
        onResetTimeLimit();
      } catch (e) {
        // ignore
      }
    }
    // ensure score state is reset too
    setScore(0);
    generateNewExercise();
  };

  const handleQuizAnswer = (optIndex, onCorrectCb) => {
    // optIndex is expected to be the index of the selected option
    setSelectedOption(optIndex);
    const correctIdx = currentQuiz ? currentQuiz.correct : null;
    const isCorrect = (typeof correctIdx === 'number') ? optIndex === correctIdx : false;
    setQuizAnswered(true);
    setQuizResult(isCorrect);
    if (isCorrect) {
      // award points for correct quiz
      setScore(prev => {
        const next = prev + 10;
        persist.set('score', next);
        return next;
      });
      if (typeof onCorrectCb === 'function') onCorrectCb();
    }
  };

  const reportCompletion = ({ timeUsedSeconds, timeLimit, currentExerciseLevel }) => {
    // compute points and update score/streak/progress like original App logic
    const remaining = Math.max(0, timeLimit - timeUsedSeconds);
    const percentRemaining = (remaining / timeLimit) * 100;

    let basePoints = 5;
    if (percentRemaining > 70) basePoints = 12;
    else if (percentRemaining > 40) basePoints = 10;
    else if (percentRemaining > 10) basePoints = 8;
    else if (remaining <= 0) basePoints = 0;

    const totalPoints = basePoints + streak;
    setScore(prev => {
      const next = prev + totalPoints;
      persist.set('score', next);
      return next;
    });

    const newStreak = streak + 1;
    setStreak(newStreak);

    // Guardar récord de racha
    if (newStreak > bestStreak) {
      setBestStreak(newStreak);
      const now = new Date().toISOString();
      const newRecords = [{ streak: newStreak, date: now }, ...streakRecords].slice(0, 10);
      setStreakRecords(newRecords);
      initBackground();
    }

    // Actualizar progreso por nivel
    let newBasic = completedBasic;
    let newIntermediate = completedIntermediate;
    let newAdvanced = completedAdvanced;
    if (currentExerciseLevel === 'basic') {
      newBasic += 1;
      if (newBasic >= 10 && !unlockedLevels.includes('intermediate')) unlockLevel('intermediate');
    } else if (currentExerciseLevel === 'intermediate') {
      newIntermediate += 1;
      if (newIntermediate >= 10 && !unlockedLevels.includes('advanced')) unlockLevel('advanced');
    } else if (currentExerciseLevel === 'advanced') {
      newAdvanced += 1;
    }
    setCompletedBasic(newBasic);
    setCompletedIntermediate(newIntermediate);
    setCompletedAdvanced(newAdvanced);

    // update lastTimes/lastConsumptions
    const consumptionPercent = Math.round((timeUsedSeconds / timeLimit) * 100);
    const newLastTimes = [...lastTimes, timeUsedSeconds].slice(-20);
    const newConsumptions = [...lastConsumptions, consumptionPercent].slice(-20);
  setLastTimes(newLastTimes);
  setLastConsumptions(newConsumptions);
  persist.set('last-times', newLastTimes);
  persist.set('last-consumptions', newConsumptions);

    // Ajuste del TTE (Tiempo Total del Ejercicio)
    // The time limit is ALWAYS reset to its initial value, then adjusted based on performance
    const INITIAL_TTE = 15; // default starting time
    const MIN_TTE = 5;  // never go below 5s
    const MAX_TTE = 30; // never go above 30s
    const TTE_CHANGE = 3; // change amount when adjusting
    
    // STEP 1: Always reset to initial time limit
    let newTTE = INITIAL_TTE;
    
    // STEP 2: Adjust based on how fast/slow the user completed the exercise
    // If completed very fast (<5s) AND initial timeLimit is >= 8s, reduce by 3s
    if (timeUsedSeconds < 5 && INITIAL_TTE >= 8) {
      newTTE = Math.max(MIN_TTE, INITIAL_TTE - TTE_CHANGE);
    } 
    // If completed very slow (>15s), increase by 3s
    else if (timeUsedSeconds > 15) {
      newTTE = Math.min(MAX_TTE, INITIAL_TTE + TTE_CHANGE);
    }
    // Otherwise keep the initial time limit unchanged
    
    // Store the new time limit to apply when next exercise is generated
    setNextTimeLimit(newTTE);

  // pick a random quiz question and show quiz
  try {
    const q = getRandomQuestion();
    setCurrentQuiz(q || null);
  } catch (e) {
    setCurrentQuiz(null);
  }
  setShowQuiz(true);

    return { totalPoints, newStreak, proposedLimit: newTTE };
  };

  const closeQuiz = () => {
    setShowQuiz(false);
    setQuizAnswered(false);
    setQuizResult(null);
    setSelectedOption(null);
    setTimeout(() => generateNewExercise(), 300);
  };

  return {
    exercise,
    currentExerciseLevel,
    activeLevels,
    unlockedLevels,
    completedBasic,
    completedIntermediate,
    completedAdvanced,
    score,
    streak,
    bestStreak,
    streakRecords,
    lastTimes,
    lastConsumptions,
    currentQuiz,
    showQuiz,
    setShowQuiz,
    quizAnswered,
    quizResult,
    selectedOption,
    nextTimeLimit,
    setNextTimeLimit,
    generateNewExercise,
    unlockLevel,
    toggleLevel,
    resetProgress,
    handleQuizAnswer,
    reportCompletion,
    closeQuiz,
    setBestStreak,
    setStreakRecords,
    setStreak,
    setCompletedBasic,
    setCompletedIntermediate,
    setCompletedAdvanced,
    setLastTimes,
    setLastConsumptions
  };
}

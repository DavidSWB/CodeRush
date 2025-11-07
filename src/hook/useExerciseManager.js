import { useEffect, useState } from 'react';
import { ejerciciosBasicos } from '../niveles/basicos';
import { ejerciciosIntermedios } from '../niveles/medios';
import { ejerciciosAvanzados } from '../niveles/avanzado';
import { initBackground, removeBackground } from '../background.js';

const getRandomExercise = (exercises) => exercises[Math.floor(Math.random() * exercises.length)];

export default function useExerciseManager({ onCorrectQuiz, onAdjustTimeLimit, onResetTimeLimit } = {}) {
  const [activeLevels, setActiveLevels] = useState(() => JSON.parse(localStorage.getItem('coderush-active-levels') || '["basic"]'));
  const [currentExerciseLevel, setCurrentExerciseLevel] = useState('basic');
  const [exercise, setExercise] = useState({ code: '', description: '' });

  const [unlockedLevels, setUnlockedLevels] = useState(() => JSON.parse(localStorage.getItem('coderush-unlocked') || '["basic"]'));
  const [completedBasic, setCompletedBasic] = useState(() => parseInt(localStorage.getItem('coderush-completed-basic')) || 0);
  const [completedIntermediate, setCompletedIntermediate] = useState(() => parseInt(localStorage.getItem('coderush-completed-intermediate')) || 0);
  const [completedAdvanced, setCompletedAdvanced] = useState(() => parseInt(localStorage.getItem('coderush-completed-advanced')) || 0);

  const [lastTimes, setLastTimes] = useState(() => JSON.parse(localStorage.getItem('coderush-last-times') || '[]'));
  const [lastConsumptions, setLastConsumptions] = useState(() => JSON.parse(localStorage.getItem('coderush-last-consumptions') || '[]'));

  const [bestStreak, setBestStreak] = useState(() => parseInt(localStorage.getItem('coderush-best-streak')) || 0);
  const [streakRecords, setStreakRecords] = useState(() => JSON.parse(localStorage.getItem('coderush-streak-records') || '[]'));
  // scoring and streak
  const [score, setScore] = useState(() => parseInt(localStorage.getItem('coderush-score')) || 0);
  const [streak, setStreak] = useState(0);

  // QUIZ
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const quizData = {
    basic: {
      question: '¿Qué tipo de dato se usa para almacenar texto en Java?',
      options: ['String', 'int', 'boolean'],
      correct: 'String',
      info: 'En Java, String representa una secuencia de caracteres y se usa para almacenar texto.'
    },
    intermediate: {
      question: '¿Qué palabra clave local permite inferir el tipo en Java (desde Java 10)?',
      options: ['final', 'var', 'static'],
      correct: 'var',
      info: 'Desde Java 10 se puede usar "var" para inferir el tipo de variables locales.'
    },
    advanced: {
      question: '¿Qué es una clase en Java?',
      options: ['Una plantilla para crear objetos', 'Una función especial', 'Un paquete'],
      correct: 'Una plantilla para crear objetos',
      info: 'Las clases definen atributos y métodos que determinan el comportamiento de los objetos.'
    }
  };

  useEffect(() => {
    localStorage.setItem('coderush-active-levels', JSON.stringify(activeLevels));
    localStorage.setItem('coderush-completed-basic', completedBasic);
    localStorage.setItem('coderush-completed-intermediate', completedIntermediate);
    localStorage.setItem('coderush-completed-advanced', completedAdvanced);
    localStorage.setItem('coderush-last-times', JSON.stringify(lastTimes));
    localStorage.setItem('coderush-last-consumptions', JSON.stringify(lastConsumptions));
    localStorage.setItem('coderush-best-streak', bestStreak);
    localStorage.setItem('coderush-streak-records', JSON.stringify(streakRecords));
    localStorage.setItem('coderush-unlocked', JSON.stringify(unlockedLevels));
  }, [activeLevels, completedBasic, completedIntermediate, completedAdvanced, lastTimes, lastConsumptions, bestStreak, streakRecords, unlockedLevels]);

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
    // showQuiz will be controlled by the parent when appropriate
  };

  const unlockLevel = (newLevel) => {
    if (!unlockedLevels.includes(newLevel)) {
      const newUnlocked = [...unlockedLevels, newLevel];
      setUnlockedLevels(newUnlocked);
      localStorage.setItem('coderush-unlocked', JSON.stringify(newUnlocked));
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
    // clear all localStorage to match previous behavior
    localStorage.clear();
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
    // Reset time limit to default (15s)
    if (typeof onResetTimeLimit === 'function') {
      try {
        onResetTimeLimit();
      } catch (e) {
        // ignore
      }
    }
    generateNewExercise();
  };

  const handleQuizAnswer = (opt, onCorrectCb) => {
    setSelectedOption(opt);
    const isCorrect = opt === quizData[currentExerciseLevel].correct;
    setQuizAnswered(true);
    setQuizResult(isCorrect);
    if (isCorrect) {
      // award points for correct quiz
      setScore(prev => {
        const next = prev + 10;
        localStorage.setItem('coderush-score', next);
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
      localStorage.setItem('coderush-score', next);
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
    localStorage.setItem('coderush-last-times', JSON.stringify(newLastTimes));
    localStorage.setItem('coderush-last-consumptions', JSON.stringify(newConsumptions));

    // Ajuste del TTE (Tiempo Total del Ejercicio)
    const MIN_TTE = 7;  // segundos
    const MAX_TTE = 30; // segundos
    const TTE_CHANGE = 3; // segundos a sumar/restar
    
    let newTTE = timeLimit; // empezamos con el TTE actual
    
    // Cálculo basado en el tiempo usado (no el restante)
    if (timeUsedSeconds < 7) {
      // Completó rápido: restar 3s al TTE (mínimo 7s)
      newTTE = Math.max(MIN_TTE, timeLimit - TTE_CHANGE);
    } 
    else if (timeUsedSeconds > 12 || timeUsedSeconds >= timeLimit) {
      // Tardó mucho o se acabó el tiempo: sumar 3s al TTE (máximo 30s)
      newTTE = Math.min(MAX_TTE, timeLimit + TTE_CHANGE);
    }
    // else: mantiene el mismo TTE si usó entre 7-12 segundos
    
    let proposedLimit = newTTE;

    // persist changes and show quiz
    setLastTimes(newLastTimes);
    setLastConsumptions(newConsumptions);
    setShowQuiz(true);

    // call callback to adjust time limit in the timer hook (App passes setTimeLimit)
    if (typeof onAdjustTimeLimit === 'function') {
      try {
        onAdjustTimeLimit(proposedLimit);
      } catch (e) {
        // ignore
      }
    }

    return { totalPoints, newStreak, proposedLimit };
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
    quizData,
    showQuiz,
    setShowQuiz,
    quizAnswered,
    quizResult,
    selectedOption,
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

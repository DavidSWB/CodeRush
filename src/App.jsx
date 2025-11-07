import { useState, useEffect, useRef } from 'react';

import { ejerciciosBasicos } from './niveles/basicos';
import { ejerciciosIntermedios } from './niveles/medios';
import { ejerciciosAvanzados } from './niveles/avanzado';
import { initBackground, removeBackground } from './background.js';

import './App.css';
import useTimer from './hook/useTimer';
import TypingPanel from './components/TypingPanel';
import useExerciseManager from './hook/useExerciseManager';
import Header from './components/Header';
import SamplePanel from './components/SamplePanel';
import StatsPanel from './components/StatsPanel';
import QuizModal from './components/QuizModal';
import TipsBar from './components/TipsBar';
import ToastCopied from './components/ToastCopied';
import AddSecondButton from './components/AddSecondButton';

// Array de consejos de programación
const CODING_TIPS = [
  "Usa 'ctrl + backspace' para borrar palabras completas",
  "Mantén un ritmo constante al escribir para mejorar tu precisión",
  "Practica la posición correcta de los dedos en el teclado",
  "Los paréntesis y llaves siempre van en pares",
  "Revisa la indentación del código mientras escribes",
  "Toma pequeños descansos entre ejercicios",
  "La práctica constante es la clave del éxito",
  "Mantén la calma cuando cometas errores",
  "Observa los patrones en el código para mejorar tu velocidad",
  "Concéntrate en la precisión antes que en la velocidad"
];

// Constantes del TTE (Tiempo Total del Ejercicio)
const INITIAL_TTE = 15; // TTE inicial y después de reinicio
const MIN_TTE = 7;      // TTE mínimo absoluto
const MAX_TTE = 30;     // TTE máximo absoluto

function App() {
  // timer hook (tiempo dinámico)
  const onTimeoutRef = useRef(() => {});
  const {
    timeLimit,
    setTimeLimit,
    timeRemaining,
    isPaused: timerIsPaused,
    started: timerStarted,
    notifyTypingStarted,
    pause: timerPause,
    resume: timerResume,
    addSeconds,
    stopAndComputeUsed,
    resetForNewExercise
  } = useTimer({ initialLimit: INITIAL_TTE, min: MIN_TTE, max: MAX_TTE, onTimeout: () => onTimeoutRef.current() });

  // exercise manager hook (levels, exercise selection, quiz state) — pass setTimeLimit so manager can propose adjustments
  const exerciseManager = useExerciseManager({
    onAdjustTimeLimit: setTimeLimit,
    onResetTimeLimit: () => setTimeLimit(INITIAL_TIME_LIMIT)
  });
  const {
    exercise,
    currentExerciseLevel,
    activeLevels,
    unlockedLevels,
    completedBasic,
    completedIntermediate,
    completedAdvanced,
    bestStreak,
    streakRecords,
    quizData,
    showQuiz,
    quizAnswered,
    quizResult,
    selectedOption,
    lastTimes,
    lastConsumptions,
    score,
    streak,
  setStreak: managerSetStreak,
    generateNewExercise: managerGenerateNewExercise,
    toggleLevel: managerToggleLevel,
    resetProgress: managerResetProgress,
    unlockLevel: managerUnlockLevel,
    handleQuizAnswer: managerHandleQuizAnswer,
    setShowQuiz: managerSetShowQuiz,
    closeQuiz: managerCloseQuiz,
    setCompletedBasic: managerSetCompletedBasic,
    setCompletedIntermediate: managerSetCompletedIntermediate,
    setCompletedAdvanced: managerSetCompletedAdvanced,
    setLastTimes: managerSetLastTimes,
    setLastConsumptions: managerSetLastConsumptions,
    reportCompletion: managerReportCompletion
  } = exerciseManager;
  // managerSetStreak is provided by exerciseManager destructuring
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [incorrectChar, setIncorrectChar] = useState('');
  const inputRef = useRef(null);
  const [currentColor, setCurrentColor] = useState({ color: '#00ff88', r: 0, g: 255, b: 136 });
  const [tipIndex, setTipIndex] = useState(0); // Estado para el índice del consejo actual
  const currentTip = CODING_TIPS[tipIndex];
  

  const tipIntervalRef = useRef(null);

  // Pausa (HU-6 + HU-5 interplay)
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  // +1s floating button
  const [showAddSecond, setShowAddSecond] = useState(false);
  const addBtnRef = useRef(null);
  const addBtnMoveRef = useRef(null);
  const [addBtnStyle, setAddBtnStyle] = useState({ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' });
  const neonColors = ['#00ff88', '#00ffff', '#ff00ff', '#ffaa00', '#ff0080'];
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 255, 136];
  };
  // timeLimit is persisted by the app
  useEffect(() => {
    localStorage.setItem('coderush-time-limit', timeLimit);
  }, [timeLimit]);

  useEffect(() => { generateNewExercise(); }, [activeLevels]);

  // Focus input and reset local input state when the exercise changes (covers manager-triggered changes)
  useEffect(() => {
    setUserInput('');
    setIsCorrect(false);
    setHasError(false);
    setIncorrectChar('');
    inputRef.current?.focus();
  }, [exercise]);

  // Efecto para cambiar consejos cada 12 segundos
  useEffect(() => {
    tipIntervalRef.current = setInterval(() => {
      setTipIndex(prev => (prev + 1) % CODING_TIPS.length);
    }, 12000);
    return () => clearInterval(tipIntervalRef.current);
  }, []);

  useEffect(() => {
    localStorage.setItem('coderush-active-levels', JSON.stringify(activeLevels));
    localStorage.setItem('coderush-score', score);
    localStorage.setItem('coderush-completed-basic', completedBasic);
    localStorage.setItem('coderush-completed-intermediate', completedIntermediate);
    localStorage.setItem('coderush-completed-advanced', completedAdvanced);
    localStorage.setItem('coderush-time-limit', timeLimit);
    localStorage.setItem('coderush-last-times', JSON.stringify(lastTimes));
    localStorage.setItem('coderush-last-consumptions', JSON.stringify(lastConsumptions));
    localStorage.setItem('coderush-best-streak', bestStreak);
    localStorage.setItem('coderush-streak-records', JSON.stringify(streakRecords));
    localStorage.setItem('coderush-unlocked', JSON.stringify(unlockedLevels));
  }, [activeLevels, score, completedBasic, completedIntermediate, completedAdvanced, timeLimit, lastTimes, lastConsumptions, bestStreak, streakRecords, unlockedLevels]);

  const unlockLevel = (newLevel) => {
    if (!unlockedLevels.includes(newLevel)) {
      const newUnlocked = [...unlockedLevels, newLevel];
      setUnlockedLevels(newUnlocked);
      localStorage.setItem('coderush-unlocked', JSON.stringify(newUnlocked));
      // ELIMINADO: Mostrar quiz al desbloquear nivel
    }
  };

  // use managerToggleLevel to change active levels

  // use managerResetProgress to reset levels/progress

  const generateNewExercise = () => {
    // delegate selection to manager and reset local UI state
    managerGenerateNewExercise();
    setUserInput('');
    setIsCorrect(false);
    setHasError(false);
    setIncorrectChar('');

    const randomColor = neonColors[Math.floor(Math.random() * neonColors.length)];
    const [r, g, b] = hexToRgb(randomColor);
    setCurrentColor({ color: randomColor, r, g, b });

    // reset timer state for the new exercise
    resetForNewExercise();
  };

  const handleTimeout = () => {
    managerSetStreak(0);
    // Al acabarse el tiempo, suma 3s al TTE (máximo 30s)
    const newTTE = Math.min(MAX_TTE, timeLimit + 3);
    setTimeLimit(newTTE);
    setTimeout(() => generateNewExercise(), 800);
    removeBackground();
  };

  // wire timeout into the timer hook
  onTimeoutRef.current = handleTimeout;
  // Handler to add two seconds (guaranteed). Disabled if timer not started or paused.
  const handleAddSecond = () => {
    if (!timerStarted) return; // can't use if timer hasn't started
    if (timerIsPaused) return; // can't use while paused
    if (timeRemaining <= 0) return;

    addSeconds(2);

    // Change colors like when changing exercise but DO NOT change the exercise
    const randomColor = neonColors[Math.floor(Math.random() * neonColors.length)];
    const [r, g, b] = hexToRgb(randomColor);
    setCurrentColor({ color: randomColor, r, g, b });
  };

  // Show/hide the add-second button according to timeRemaining rules
  useEffect(() => {
    // Aparece cuando el usuario tiene menos de 7s, y se mantiene hasta tener >=7s
    if (timeRemaining > 0 && timeRemaining < 7) {
      setShowAddSecond(true);
    } else {
      setShowAddSecond(false);
    }
  }, [timeRemaining]);

  // Move the button randomly across the viewport while visible
  useEffect(() => {
    function randomPos() {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      const size = 120; // approximate button size (adjusted)
      const left = Math.floor(Math.random() * Math.max(10, vw - size));
      const top = Math.floor(Math.random() * Math.max(10, vh - size));
      setAddBtnStyle({ top: `${top}px`, left: `${left}px`, transform: 'translate(0,0)' });
    }

    if (showAddSecond) {
      // immediate random position
      randomPos();
      addBtnMoveRef.current = setInterval(() => randomPos(), 900);
    } else {
      if (addBtnMoveRef.current) {
        clearInterval(addBtnMoveRef.current);
        addBtnMoveRef.current = null;
      }
    }

    return () => {
      if (addBtnMoveRef.current) {
        clearInterval(addBtnMoveRef.current);
        addBtnMoveRef.current = null;
      }
    };
  }, [showAddSecond]);

  const togglePause = () => {
    if (!timerIsPaused) timerPause();
    else timerResume();
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(exercise.code);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 1400);
    } catch (err) {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = exercise.code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 1400);
    }
  };

  const handleInputChange = (e) => {
    const newRawInput = e.target.value;
    let newCleanedInput = newRawInput.replace(/\n\s+/g, '\n');

    // Start timer on first input (if not paused)
    if (!timerStarted && !timerIsPaused) {
      notifyTypingStarted();
    }

    if (hasError && newCleanedInput.length > userInput.length) return;

    if (newCleanedInput.length < userInput.length) {
      setUserInput(newCleanedInput);
      setHasError(false);
      setIncorrectChar('');
      managerSetStreak(0);
      return;
    }

    const expectedChar = exercise.code[newCleanedInput.length - 1];
    const inputChar = newCleanedInput[newCleanedInput.length - 1];

    if (inputChar !== expectedChar && newCleanedInput.length <= exercise.code.length) {
      setHasError(true);
      setIncorrectChar(inputChar);
      setUserInput(newCleanedInput);
      managerSetStreak(0);
      return;
    }

    setUserInput(newCleanedInput);
    setHasError(false);
    setIncorrectChar('');

    if (newCleanedInput === exercise.code) {
      setIsCorrect(true);
      // detener timer si está corriendo y obtener tiempo usado
      const { msUsed, timeUsedSeconds } = stopAndComputeUsed();

          // delegate scoring/progress/quiz display to manager
          // manager will update last-times/consumptions and, via the onAdjustTimeLimit callback, adjust the timer limit if needed
          const { totalPoints, newStreak } = managerReportCompletion({ timeUsedSeconds, timeLimit, currentExerciseLevel });
    }
  };

  // adjustTimeLimitOnCompletion moved into useExerciseManager.reportCompletion

  // renderHighlightedText moved into TypingPanel component

  // Quiz handlers are delegated to useExerciseManager (managerHandleQuizAnswer, managerCloseQuiz)

  // ----------- UI principal -----------
  return (
    <div className="app" style={{ '--neon-color': currentColor.color, '--neon-r': currentColor.r, '--neon-g': currentColor.g, '--neon-b': currentColor.b }}>
      <Header
        title="CodeRusher: Sintaxis Java"
        activeLevels={activeLevels}
        unlockedLevels={unlockedLevels}
        toggleLevel={managerToggleLevel}
        resetProgress={managerResetProgress}
      />
      <StatsPanel
        currentExerciseLevel={currentExerciseLevel}
        score={score}
        streak={streak}
        completedBasic={completedBasic}
        completedIntermediate={completedIntermediate}
        completedAdvanced={completedAdvanced}
      />

      <div className="game-board">
        <SamplePanel description={exercise.description} bestStreak={bestStreak} streakRecords={streakRecords} />

        <div className="panel typing-panel">
          <div className="typing-header">
            <h2 className="typing-title">Código</h2>
            <div className="time-display">
              <div className="time-value">{timeRemaining}s</div>
              <div className="time-label">Tiempo restante</div>
              {/* Botón de pausa al lado derecho del tiempo */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
                <button
                  className={`pause-button`}
                  onClick={() => { if (!timerIsPaused) timerPause(); else timerResume(); }}
                  aria-pressed={timerIsPaused}
                  title={timerIsPaused ? 'Reanudar' : 'Pausar'}
                  style={{
                    borderColor: `var(--neon-color)`,
                    boxShadow: `0 0 8px ${currentColor.color}`,
                    color: timerIsPaused ? '#000' : '#fff',
                    background: timerIsPaused ? currentColor.color : 'transparent'
                  }}
                >
                  {timerIsPaused ? '▶' : '||'}
                </button>

                {/* Botón copiar visible solo cuando está pausado */}
                {timerIsPaused && (
                  <button
                    className="copy-button"
                    onClick={handleCopyCode}
                    title="Copiar código al portapapeles"
                    style={{
                      borderColor: `var(--neon-color)`,
                      boxShadow: `0 0 8px ${currentColor.color}`,
                      background: 'transparent',
                      color: '#fff'
                    }}
                  >
                    Copiar
                  </button>
                )}
              </div>
            </div>
          </div>

          <TypingPanel
            code={exercise.code}
            userInput={userInput}
            onChange={handleInputChange}
            hasError={hasError}
            isCorrect={isCorrect}
            disabled={isCorrect || timerIsPaused}
            inputRef={inputRef}
          />

          {hasError && <div className="hint">¡Error! Borra para corregir.</div>}
          {isCorrect && <div className="success">¡Correcto! +{10 + streak} puntos</div>}
        </div>
      </div>

      <QuizModal
        showQuiz={showQuiz}
        quizAnswered={quizAnswered}
        quizResult={quizResult}
        quizDataForLevel={quizData[currentExerciseLevel] || { question: '', options: [], info: '', correct: '' }}
        currentExerciseLevel={currentExerciseLevel}
        selectedOption={selectedOption}
  onAnswer={(opt) => managerHandleQuizAnswer(opt)}
        onClose={() => managerCloseQuiz()}
      />

      <AddSecondButton
        visible={showAddSecond}
        timeRemaining={timeRemaining}
        onClick={handleAddSecond}
        timerStarted={timerStarted}
        timerIsPaused={timerIsPaused}
        style={{
          position: 'fixed',
          zIndex: 9999,
          width: 120,
          height: 120,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 26,
          fontWeight: 800,
          cursor: (timerStarted && !timerIsPaused) ? 'pointer' : 'not-allowed',
          border: `4px solid ${currentColor.color}`,
          boxShadow: `0 10px 30px ${currentColor.color}`,
          background: currentColor.color,
          color: '#000',
          transition: 'transform 300ms ease, left 600ms ease, top 600ms ease, opacity 300ms',
          opacity: 0.98,
          ...addBtnStyle
        }}
      />

      <TipsBar tip={currentTip} />
      <ToastCopied visible={showCopiedToast} />
    </div>
  );
}

export default App;

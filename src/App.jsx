import { useEffect, useRef } from 'react';
import './App.css';

import useTimer from './hook/useTimer';
import useExerciseManager from './hook/useExerciseManager';
import useExerciseFlow from './hook/useExerciseFlow';
import useColorCycle from './hook/useColorCycle';
import useCopyCode from './hook/useCopyCode';
import useTipsRotator from './hook/useTipsRotator';
import useAddSecondButton from './hook/useAddSecondButton';

import Header from './components/Header';
import SamplePanel from './components/SamplePanel';
import StatsPanel from './components/StatsPanel';
import TypingPanel from './components/TypingPanel';
import QuizModal from './components/QuizModal';
import TipsBar from './components/TipsBar';
import ToastCopied from './components/ToastCopied';
import AddSecondButton from './components/AddSecondButton';
import TimerControls from './components/TimerControls';


// Constantes del TTE (Tiempo Total del Ejercicio)
const INITIAL_TTE = 15; // default TTE
const MIN_TTE = 7;
const MAX_TTE = 30;

function App() {
  const onTimeoutRef = useRef(() => {});

  // color cycle
  const { currentColor, changeColor } = useColorCycle();

  // timer and manager
  const timer = useTimer({ initialLimit: INITIAL_TTE, min: MIN_TTE, max: MAX_TTE, onTimeout: () => onTimeoutRef.current && onTimeoutRef.current() });
  const manager = useExerciseManager({ onAdjustTimeLimit: timer.setTimeLimit, onResetTimeLimit: () => timer.setTimeLimit(INITIAL_TTE) });

  // exercise flow (input handling, completion, add-second)
  const { typingProps, feedback, addSecondProps, generateNewExercise, handleTimeout, handleAddSecond } = useExerciseFlow({ timer, manager, onColorChange: changeColor, onTimeoutRef });

  // clipboard
  const { handleCopyCode, showCopiedToast } = useCopyCode();

  // tips and add-second position
  const { tip: currentTip } = useTipsRotator();
  const { visible: addVisible, style: addStyle } = useAddSecondButton({ timeRemaining: timer.timeRemaining });

  // initial exercise
  useEffect(() => { generateNewExercise(); }, []);

  // defensive: when quiz opens, blur active element to avoid input overlays capturing events
  useEffect(() => {
    if (manager.showQuiz) {
      try {
        (document.activeElement instanceof HTMLElement) && document.activeElement.blur();
      } catch (e) { /* ignore */ }
    }
  }, [manager.showQuiz]);

  return (
    <div className="app" style={{ '--neon-color': currentColor.color, '--neon-r': currentColor.r, '--neon-g': currentColor.g, '--neon-b': currentColor.b }}>
      <Header
        title="CodeRusher: Sintaxis Java"
        activeLevels={manager.activeLevels}
        unlockedLevels={manager.unlockedLevels}
        toggleLevel={manager.toggleLevel}
        resetProgress={manager.resetProgress}
      />

      <StatsPanel
        currentExerciseLevel={manager.currentExerciseLevel}
        score={manager.score}
        streak={manager.streak}
        completedBasic={manager.completedBasic}
        completedIntermediate={manager.completedIntermediate}
        completedAdvanced={manager.completedAdvanced}
      />

      <div className="game-board">
        <SamplePanel description={manager.exercise.description} bestStreak={manager.bestStreak} streakRecords={manager.streakRecords} />

        <div className="panel typing-panel">
          <div className="typing-header">
            <h2 className="typing-title">Código</h2>
            <TimerControls timer={{ timeRemaining: timer.timeRemaining, isPaused: timer.isPaused, pause: timer.pause, resume: timer.resume }} currentColor={currentColor} onCopy={() => handleCopyCode(manager.exercise.code)} />
          </div>

          <TypingPanel {...typingProps} />

          {feedback.hasError && <div className="hint">¡Error! Borra para corregir.</div>}
          {feedback.isCorrect && <div className="success">¡Correcto! +{10 + manager.streak} puntos</div>}
        </div>
      </div>

      <QuizModal
        showQuiz={manager.showQuiz}
        quizAnswered={manager.quizAnswered}
        quizResult={manager.quizResult}
        quizDataForLevel={(manager.currentQuiz && {
          question: manager.currentQuiz.question || '',
          options: manager.currentQuiz.options || [],
          info: manager.currentQuiz.info || '',
          correctIndex: typeof manager.currentQuiz.correct === 'number' ? manager.currentQuiz.correct : null
        }) || { question: '', options: [], info: '', correctIndex: null }}
        currentExerciseLevel={manager.currentExerciseLevel}
        selectedOption={manager.selectedOption}
        onAnswer={(opt) => manager.handleQuizAnswer(opt)}
        onClose={() => manager.closeQuiz()}
      />

      <AddSecondButton
        visible={addVisible}
        timeRemaining={addSecondProps.timeRemaining}
        onClick={addSecondProps.onAddSecond}
        timerStarted={addSecondProps.timerStarted}
        timerIsPaused={addSecondProps.timerIsPaused}
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
          cursor: (addSecondProps.timerStarted && !addSecondProps.timerIsPaused) ? 'pointer' : 'not-allowed',
          border: `4px solid ${currentColor.color}`,
          boxShadow: `0 10px 30px ${currentColor.color}`,
          background: currentColor.color,
          color: '#000',
          transition: 'transform 300ms ease, left 600ms ease, top 600ms ease, opacity 300ms',
          opacity: 0.98,
          ...addStyle
        }}
      />

      <TipsBar tip={currentTip} />
      <ToastCopied visible={showCopiedToast} />
    </div>
  );
}

export default App;

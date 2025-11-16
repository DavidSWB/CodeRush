import { useCallback, useRef, useState, useEffect } from 'react';

export default function useExerciseFlow({ timer, manager, onColorChange, onTimeoutRef, onAdjustTimeLimit } = {}) {
	const inputRef = useRef(null);
	const [userInput, setUserInput] = useState('');
	const [isCorrect, setIsCorrect] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [incorrectChar, setIncorrectChar] = useState('');

	const generateNewExercise = useCallback(() => {
		if (manager && typeof manager.generateNewExercise === 'function') manager.generateNewExercise();
		setUserInput('');
		setIsCorrect(false);
		setHasError(false);
		setIncorrectChar('');
		if (typeof onColorChange === 'function') onColorChange();
		// resetForNewExercise must be called AFTER manager.generateNewExercise() 
		// because generateNewExercise calls onAdjustTimeLimit which updates timeLimit asynchronously
		// We use a small setTimeout to ensure timeLimit has been updated before resetting
		setTimeout(() => {
			if (timer && typeof timer.resetForNewExercise === 'function') timer.resetForNewExercise();
		}, 0);
	}, [manager, onColorChange, timer]);

	const handleTimeout = useCallback(() => {
		if (manager && typeof manager.setStreak === 'function') manager.setStreak(0);
		// When timeout occurs, increase the time limit for the next exercise
		const currentTimeLimit = (timer && timer.timeLimit) || 15;
		const newTTE = Math.min(30, currentTimeLimit + 3); // MAX_TTE = 30
		// persist the nextTimeLimit in manager if available
		if (manager && typeof manager.setNextTimeLimit === 'function') {
			try { manager.setNextTimeLimit(newTTE); } catch (e) { /* ignore */ }
		}
		// apply the new time limit immediately so the very next exercise starts with it
		if (typeof onAdjustTimeLimit === 'function') {
			try { onAdjustTimeLimit(newTTE); } catch (e) { /* ignore */ }
		}
		// reset timer state after applying new limit
		setTimeout(() => {
			if (timer && typeof timer.resetForNewExercise === 'function') timer.resetForNewExercise();
			generateNewExercise();
		}, 200);
	}, [generateNewExercise, manager, timer]);

	// wire timeout into caller-provided ref
	useEffect(() => {
		if (onTimeoutRef && typeof onTimeoutRef === 'object') onTimeoutRef.current = handleTimeout;
		return () => {
			if (onTimeoutRef && typeof onTimeoutRef === 'object') onTimeoutRef.current = null;
		};
	}, [handleTimeout, onTimeoutRef]);

		// Reset local typing state when the manager provides a new exercise
		useEffect(() => {
			const code = (manager && manager.exercise && manager.exercise.code) ? manager.exercise.code : null;
			// whenever the exercise changes, clear the local input and errors and focus
			setUserInput('');
			setIsCorrect(false);
			setHasError(false);
			setIncorrectChar('');
			try { inputRef.current?.focus(); } catch (e) { /* ignore */ }
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [manager && manager.exercise && manager.exercise.code]);

	const handleAddSecond = useCallback(() => {
		if (!timer) return false;
		if (!timer.started) return false;
		if (timer.isPaused) return false;
		if (timer.timeRemaining <= 0) return false;
		if (typeof timer.addSeconds === 'function') timer.addSeconds(5);
		if (typeof onColorChange === 'function') onColorChange();
		// auto-focus the input so user can continue typing immediately
		try { inputRef.current?.focus(); } catch (e) { /* ignore */ }
		return true;
	}, [onColorChange, timer]);

	const handleInputChange = useCallback((e) => {
		const newRawInput = e.target.value;
		let newCleanedInput = newRawInput.replace(/\n\s+/g, '\n');

		// Start timer on first input (if not paused)
		if (timer && typeof timer.notifyTypingStarted === 'function' && !timer.started && !timer.isPaused) {
			timer.notifyTypingStarted();
		}

		if (hasError && newCleanedInput.length > userInput.length) return;

		if (newCleanedInput.length < userInput.length) {
			setUserInput(newCleanedInput);
			setHasError(false);
			setIncorrectChar('');
			if (manager && typeof manager.setStreak === 'function') manager.setStreak(0);
			return;
		}

		const code = (manager && manager.exercise && manager.exercise.code) ? manager.exercise.code : '';
		const expectedChar = code[newCleanedInput.length - 1];
		const inputChar = newCleanedInput[newCleanedInput.length - 1];

		if (inputChar !== expectedChar && newCleanedInput.length <= code.length) {
			setHasError(true);
			setIncorrectChar(inputChar);
			setUserInput(newCleanedInput);
			if (manager && typeof manager.setStreak === 'function') manager.setStreak(0);
			return;
		}

		setUserInput(newCleanedInput);
		setHasError(false);
		setIncorrectChar('');

		if (newCleanedInput === code && code.length > 0) {
			setIsCorrect(true);
			// stop timer and compute used
			const result = (timer && typeof timer.stopAndComputeUsed === 'function') ? timer.stopAndComputeUsed() : { timeUsedSeconds: 0 };
			const timeUsedSeconds = result.timeUsedSeconds || 0;
			if (manager && typeof manager.reportCompletion === 'function') {
				try {
					const completionResult = manager.reportCompletion({ timeUsedSeconds, timeLimit: (timer && timer.timeLimit) || 0, currentExerciseLevel: manager.currentExerciseLevel });
					// Apply the adjusted time limit IMMEDIATELY before showing quiz
					if (completionResult && completionResult.proposedLimit && typeof onAdjustTimeLimit === 'function') {
						try {
							onAdjustTimeLimit(completionResult.proposedLimit);
							// ensure timer state is reset to the new limit before next exercise
							setTimeout(() => {
								if (timer && typeof timer.resetForNewExercise === 'function') timer.resetForNewExercise();
							}, 0);
						} catch (e) {
							// ignore
						}
					}
					// ensure quiz is shown (manager.reportCompletion normally does this)
					if (typeof manager.setShowQuiz === 'function') manager.setShowQuiz(true);
				} catch (e) {
					// unexpected error during completion flow must not leave app stuck
					// fallback: generate a new exercise after a short delay
					// eslint-disable-next-line no-console
					console.error('reportCompletion failed:', e);
					setTimeout(() => {
						try { generateNewExercise(); } catch (err) { /* swallow */ }
					}, 400);
				}
			}
		}
	}, [hasError, manager, timer, userInput]);

	const typingProps = {
		code: (manager && manager.exercise && manager.exercise.code) ? manager.exercise.code : '',
		userInput,
		onChange: handleInputChange,
		hasError,
		isCorrect,
		disabled: isCorrect || (timer && timer.isPaused),
		inputRef
	};

	const feedback = { hasError, isCorrect, incorrectChar };

	const addSecondProps = {
		onAddSecond: handleAddSecond,
		timerStarted: timer ? !!timer.started : false,
		timerIsPaused: timer ? !!timer.isPaused : false,
		timeRemaining: timer ? timer.timeRemaining : 0
	};

	return { typingProps, feedback, addSecondProps, generateNewExercise, handleTimeout, handleAddSecond };
}


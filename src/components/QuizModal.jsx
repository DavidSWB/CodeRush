import React from 'react';

const QuizModal = ({ showQuiz = false, quizAnswered = false, quizResult = null, quizDataForLevel = {}, currentExerciseLevel = 'basic', selectedOption = null, onAnswer = () => {}, onClose = () => {} }) => {
  if (!showQuiz) return null;

  return (
    <div className="quiz-modal">
      {!quizAnswered ? (
        <div className="quiz-card">
          <h2>Mini Quiz</h2>
          <p className="quiz-question">{quizDataForLevel.question}</p>
          <div className="options">
            {quizDataForLevel.options.map((opt) => (
              <button key={opt} className="option" onClick={() => onAnswer(opt)}>{opt}</button>
            ))}
          </div>
          <div className="quiz-footer">
            <button className="close-quiet" onClick={onClose}>Cerrar (omitir)</button>
          </div>
        </div>
      ) : (
        <div className="quiz-result">
          {quizResult ? (
            <>
              <h2>¡Correcto! 🎉</h2>
              <p>{quizDataForLevel.info}</p>
              <p className="bonus">+10 puntos</p>
            </>
          ) : (
            <>
              <h2>Respuesta incorrecta 😅</h2>
              <p>{quizDataForLevel.info}</p>
              <div className="options result-options">
                {quizDataForLevel.options.map((opt) => {
                  const isCorrectOpt = opt === quizDataForLevel.correct;
                  const isSelected = opt === selectedOption;
                  const className = isCorrectOpt ? 'option correct' : (isSelected ? 'option wrong' : 'option disabled');
                  return <button key={opt} className={className} disabled>{opt}</button>;
                })}
              </div>
            </>
          )}
          <button className="start-level" onClick={onClose}>Continuar</button>
        </div>
      )}
    </div>
  );
};

export default QuizModal;

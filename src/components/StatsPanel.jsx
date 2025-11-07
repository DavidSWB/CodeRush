import React from 'react';

const StatsPanel = ({ currentExerciseLevel = 'basic', score = 0, streak = 0, completedBasic = 0, completedIntermediate = 0, completedAdvanced = 0 }) => {
  const levelNames = {
    basic: 'Básico',
    intermediate: 'Intermedio',
    advanced: 'Avanzado'
  };
  return (
    <div className="stats panel-stats">
      <span>Nivel: {levelNames[currentExerciseLevel]}</span>
      <span>Puntuación: {score}</span>
      <span>Racha: {streak}</span>
      <span>Básico: {completedBasic} | Intermedio: {completedIntermediate} | Avanzado: {completedAdvanced}</span>
    </div>
  );
};

export default StatsPanel;

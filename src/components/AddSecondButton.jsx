import React from 'react';

const AddSecondButton = ({ visible = false, timeRemaining = 0, onClick = () => {}, timerStarted = false, timerIsPaused = false, style = {}, className = '' }) => {
  if (!visible) return null;
  return (
    <button
      className={`add-second-button ${timeRemaining <= 4 ? 'animate-in' : ''} ${className}`}
      onClick={onClick}
      title={timerStarted ? (timerIsPaused ? 'No disponible mientras está en pausa' : '+2s') : 'Escribe para activar'}
      style={style}
    >
      + 2s
    </button>
  );
};

export default AddSecondButton;

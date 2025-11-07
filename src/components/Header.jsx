import React from 'react';

const Header = ({ title = 'CodeRusher: Sintaxis Java', activeLevels = [], unlockedLevels = [], toggleLevel = () => {}, resetProgress = () => {} }) => {
  return (
    <header>
      <h1>{title}</h1>
      <div className="level-buttons">
        <button className={activeLevels.includes('basic') ? 'active' : unlockedLevels.includes('basic') ? '' : 'locked'} onClick={() => toggleLevel('basic')}>Básico</button>
        <button className={activeLevels.includes('intermediate') ? 'active' : unlockedLevels.includes('intermediate') ? '' : 'locked'} onClick={() => toggleLevel('intermediate')}>Intermedio</button>
        <button className={activeLevels.includes('advanced') ? 'active' : unlockedLevels.includes('advanced') ? '' : 'locked'} onClick={() => toggleLevel('advanced')}>Avanzado</button>
        <button className="reset-button" onClick={resetProgress} title="Reiniciar progreso"> ↻ </button>
      </div>
    </header>
  );
};

export default Header;

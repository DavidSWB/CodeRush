import React from 'react';

const TipsBar = ({ tip = '' }) => {
  return (
    <div className="tips-bar">
      <p>💡 {tip}</p>
    </div>
  );
};

export default TipsBar;

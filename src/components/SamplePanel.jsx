import React from 'react';

const SamplePanel = ({ description = '', bestStreak = 0, streakRecords = [] }) => {
  return (
    <div className="panel sample-panel">
      <h2>Uso</h2>
      <div className="code-display">
        <p className="description-text">{description}</p>
        <div style={{ padding: '10px', fontSize: '0.9em', color: '#ccc' }}>
          <strong>Récord (racha):</strong> {bestStreak} &nbsp;|&nbsp; <strong>Últimas rachas:</strong>
          <div style={{ marginTop: 6 }}>
            {streakRecords.length === 0 ? <em>No hay récords aún</em> : streakRecords.map((r, i) => (
              <div key={i} style={{ fontSize: '0.85em' }}>{r.streak} — {new Date(r.date).toLocaleString()}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SamplePanel;

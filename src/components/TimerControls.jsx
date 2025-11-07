import React from 'react';

const TimerControls = ({ timer = {}, currentColor = {}, onCopy = () => {} }) => {
	const { timeRemaining = 0, isPaused = false, pause = () => {}, resume = () => {} } = timer;
	const color = (currentColor && currentColor.color) ? currentColor.color : '#00ff88';

	return (
		<div className="time-display">
			<div className="time-value">{timeRemaining}s</div>
			<div className="time-label">Tiempo restante</div>

			<div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
				<button
					className={`pause-button`}
					onClick={() => { if (!isPaused) pause(); else resume(); }}
					aria-pressed={isPaused}
					title={isPaused ? 'Reanudar' : 'Pausar'}
					style={{
						borderColor: `var(--neon-color)`,
						boxShadow: `0 0 8px ${color}`,
						color: isPaused ? '#000' : '#fff',
						background: isPaused ? color : 'transparent'
					}}
				>
					{isPaused ? '▶' : '||'}
				</button>

				{isPaused && (
					<button
						className="copy-button"
						onClick={onCopy}
						title="Copiar código al portapapeles"
						style={{
							borderColor: `var(--neon-color)`,
							boxShadow: `0 0 8px ${color}`,
							background: 'transparent',
							color: '#fff'
						}}
					>
						Copiar
					</button>
				)}
			</div>
		</div>
	);
};

export default TimerControls;

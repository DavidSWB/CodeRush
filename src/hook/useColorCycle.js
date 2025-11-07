import { useCallback, useState } from 'react';

const NEON_COLORS = ['#00ff88', '#00ffff', '#ff00ff', '#ffaa00', '#ff0080'];

function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (!result) return { r: 0, g: 255, b: 136 };
	return { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) };
}

export default function useColorCycle(initial = NEON_COLORS[0]) {
	const [currentColor, setCurrentColor] = useState(() => {
		const { r, g, b } = hexToRgb(initial);
		return { color: initial, r, g, b };
	});

	const changeColor = useCallback((preferred) => {
		// pick a random color, avoid repeating the same if possible
		const options = NEON_COLORS.filter(c => c !== currentColor.color);
		const pick = preferred || (options.length ? options[Math.floor(Math.random() * options.length)] : NEON_COLORS[0]);
		const { r, g, b } = hexToRgb(pick);
		setCurrentColor({ color: pick, r, g, b });
		return { color: pick, r, g, b };
	}, [currentColor.color]);

	return { currentColor, changeColor };
}

import { useEffect, useRef, useState } from 'react';

function randomPosition(size = 120) {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  const left = Math.floor(Math.random() * Math.max(10, vw - size));
  const top = Math.floor(Math.random() * Math.max(10, vh - size));
  return { left: `${left}px`, top: `${top}px`, transform: 'translate(0,0)' };
}

export default function useAddSecondButton({ timeRemaining, threshold = 7, moveInterval = 900, size = 120 }) {
  const [visible, setVisible] = useState(false);
  const [style, setStyle] = useState({ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' });
  const moverRef = useRef(null);

  useEffect(() => {
    if (timeRemaining > 0 && timeRemaining < threshold) setVisible(true);
    else setVisible(false);
  }, [timeRemaining, threshold]);

  useEffect(() => {
    if (visible) {
      setStyle(randomPosition(size));
      moverRef.current = setInterval(() => {
        setStyle(randomPosition(size));
      }, moveInterval);
    } else {
      if (moverRef.current) {
        clearInterval(moverRef.current);
        moverRef.current = null;
      }
    }

    return () => {
      if (moverRef.current) {
        clearInterval(moverRef.current);
        moverRef.current = null;
      }
    };
  }, [visible, moveInterval, size]);

  return { visible, style };
}

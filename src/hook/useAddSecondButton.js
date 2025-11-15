import { useEffect, useRef, useState } from 'react';

function randomPosition(size = 120) {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  const left = Math.floor(Math.random() * Math.max(10, vw - size));
  const top = Math.floor(Math.random() * Math.max(10, vh - size));
  return { left: `${left}px`, top: `${top}px`, transform: 'translate(0,0)' };
}

export default function useAddSecondButton({ timeRemaining, threshold = 7, moveInterval = 900, size = 180, onClick } = {}) {
  const [visible, setVisible] = useState(false);
  const [style, setStyle] = useState({ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' });
  const moverRef = useRef(null);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (timeRemaining > 0 && timeRemaining < threshold) setVisible(true);
    else setVisible(false);
  }, [timeRemaining, threshold]);

  // when visible but not yet clicked, just set an initial random position (no movement)
  useEffect(() => {
    if (visible) {
      setStyle(randomPosition(size));
    } else {
      // clear mover/clicked state when hidden
      if (moverRef.current) {
        clearInterval(moverRef.current);
        moverRef.current = null;
      }
      setClicked(false);
    }

    return () => {
      if (moverRef.current) {
        clearInterval(moverRef.current);
        moverRef.current = null;
      }
    };
  }, [visible, size]);

  const wrappedOnClick = (e) => {
    // call provided onClick first so behavior remains intact
    try {
      if (typeof onClick === 'function') onClick(e);
    } catch (err) { /* ignore */ }

    // after the first click, start moving randomly at intervals
    if (!clicked) {
      setClicked(true);
      moverRef.current = setInterval(() => {
        setStyle(randomPosition(size));
      }, moveInterval);
    }
  };

  return { visible, style, onClick: wrappedOnClick };
}

import { useEffect, useState } from 'react';

const DEFAULT_TIPS = [
  "Usa 'ctrl + backspace' para borrar palabras completas",
  'Mantén un ritmo constante al escribir para mejorar tu precisión',
  'Practica la posición correcta de los dedos en el teclado',
  'Los paréntesis y llaves siempre van en pares',
  'Revisa la indentación del código mientras escribes',
  'Toma pequeños descansos entre ejercicios',
  'La práctica constante es la clave del éxito',
  'Mantén la calma cuando cometas errores',
  'Observa los patrones en el código para mejorar tu velocidad',
  'Concéntrate en la precisión antes que en la velocidad'
];

export default function useTipsRotator(tips = DEFAULT_TIPS, intervalMs = 12000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((s) => (s + 1) % tips.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [tips, intervalMs]);

  return { tip: tips[index], index };
}

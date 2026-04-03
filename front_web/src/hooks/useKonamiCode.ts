import { useEffect, useState } from 'react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export const useKonamiCode = (callback: () => void) => {
  const [input, setInput] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      
      setInput((prev) => {
        const newInput = [...prev, key];
        const isMatch = newInput.every((k, index) => k === KONAMI_CODE[index]);

        if (isMatch) {
          if (newInput.length === KONAMI_CODE.length) {
            callback();
            return [];
          }
          return newInput;
        } else {
          // If it doesn't match, check if the current key is the start of the code
          return key === KONAMI_CODE[0] ? [KONAMI_CODE[0]] : [];
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, callback]);
};

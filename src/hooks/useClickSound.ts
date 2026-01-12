import { useCallback, useRef } from 'react';

/**
 * Custom hook for playing click sound effects with debouncing
 * to prevent overlapping audio on rapid clicks
 */
export const useClickSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedRef = useRef<number>(0);
  const DEBOUNCE_MS = 100; // Minimum time between sound plays

  const playSound = useCallback(() => {
    const now = Date.now();
    
    // Debounce: prevent overlapping sounds on rapid clicks
    if (now - lastPlayedRef.current < DEBOUNCE_MS) {
      return;
    }
    
    lastPlayedRef.current = now;

    // Create audio instance if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/button-click.mp3');
      audioRef.current.volume = 0.3; // Subtle volume (30%)
    }

    // Stop any currently playing sound and restart
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // Silently handle autoplay restrictions
      console.debug('Audio playback prevented by browser policy');
    });
  }, []);

  return playSound;
};

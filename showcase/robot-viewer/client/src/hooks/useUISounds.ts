import { useEffect, useRef, useCallback } from 'react';
import { useRobotStore } from './useRobotModel';

type UISoundId = 'select-part' | 'hover-part' | 'attach-part' | 'detach-part' | 'whoosh' | 'success' | 'error';

interface UISoundMap {
  [key: string]: HTMLAudioElement;
}

export function useUISounds() {
  const soundsRef = useRef<UISoundMap>({});
  const soundEnabled = useRobotStore((s) => s.soundEnabled);
  const soundVolume = useRobotStore((s) => s.soundVolume);

  // Preload all UI sounds
  useEffect(() => {
    const soundIds: UISoundId[] = [
      'select-part',
      'hover-part',
      'attach-part',
      'detach-part',
      'whoosh',
      'success',
      'error',
    ];

    soundIds.forEach((id) => {
      const audio = new Audio(`/sounds/ui/${id}.mp3`);
      audio.preload = 'auto';
      audio.volume = soundVolume * 0.5; // UI sounds at 50% of global volume
      soundsRef.current[id] = audio;
    });

    // Cleanup
    return () => {
      Object.values(soundsRef.current).forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
      soundsRef.current = {};
    };
  }, []);

  // Update volume when global volume changes
  useEffect(() => {
    Object.values(soundsRef.current).forEach((audio) => {
      audio.volume = soundVolume * 0.5;
    });
  }, [soundVolume]);

  const playSound = useCallback(
    (soundId: UISoundId, volumeMultiplier: number = 1.0) => {
      if (!soundEnabled) return;

      const audio = soundsRef.current[soundId];
      if (!audio) return;

      // Reset and play
      audio.currentTime = 0;
      audio.volume = soundVolume * 0.5 * volumeMultiplier;
      audio.play().catch((err) => {
        // Silently ignore autoplay errors
        if (err.name !== 'NotAllowedError') {
          console.warn(`Failed to play UI sound ${soundId}:`, err);
        }
      });
    },
    [soundEnabled, soundVolume]
  );

  return { playSound };
}

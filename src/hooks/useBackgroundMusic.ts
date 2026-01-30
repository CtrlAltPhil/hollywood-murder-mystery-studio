import { useEffect, useRef } from 'react';

export function useBackgroundMusic(phase: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio object once
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3; // Background volume
    }

    const audio = audioRef.current;
    
    // Define tracks for different phases
    // NOTE: You need to create a 'music' folder in 'public' and add these MP3 files
    let track = '';
    
    switch (phase) {
      case 'title':
        track = '/music/title.mp3';
        break;
      case 'intro':
      case 'party':
        track = '/music/party.mp3';
        break;
      case 'blackout':
      case 'murder-reveal':
        // Silence or suspense during the murder
        track = ''; 
        break;
      case 'gameplay':
        track = '/music/game.mp3';
        break;
      default:
        break;
    }

    // If track changed, update source and play
    if (track && !audio.src.endsWith(track)) {
      audio.src = track;
      audio.play().catch(() => {
        // Auto-play was prevented. 
        // This is normal until the user interacts with the page.
        console.log("Audio waiting for interaction...");
      });
    } else if (!track) {
      audio.pause();
    }

    // Global click listener to start audio if it was blocked by browser policy
    const startAudio = () => audio.paused && track && audio.play().catch(() => {});
    window.addEventListener('click', startAudio, { once: true });
    return () => window.removeEventListener('click', startAudio);

  }, [phase]);
}
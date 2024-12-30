// src/contexts/AudioContext.jsx
import React, { createContext, useState, useRef, useEffect } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const backgroundMusicRef = useRef(null);
  const buttonClickSoundRef = useRef(null);

  useEffect(() => {
    // Инициализация фоновой музыки
    backgroundMusicRef.current = new Audio('/assets/audio/background-music.mp3');
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = 0.054;

    // Инициализация звука клика по кнопке
    buttonClickSoundRef.current = new Audio('/assets/audio/button-click.mp3');
    buttonClickSoundRef.current.volume = 0.5;

    return () => {
      // Остановка музыки при размонтировании компонента
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
      if (buttonClickSoundRef.current) {
        buttonClickSoundRef.current.pause();
        buttonClickSoundRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isMuted) {
      backgroundMusicRef.current.pause();
    } else {
      // Воспроизведение музыки только если она приостановлена
      if (backgroundMusicRef.current.paused) {
        backgroundMusicRef.current.play().catch(error => {
          console.error('Ошибка при воспроизведении фоновой музыки:', error);
        });
      }
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const playButtonClick = () => {
    if (!isMuted && buttonClickSoundRef.current) {
      buttonClickSoundRef.current.currentTime = 0;
      buttonClickSoundRef.current.play().catch(error => {
        console.error('Ошибка при воспроизведении звука кнопки:', error);
      });
    }
  };

  const playBackgroundMusic = () => {
    if (!isMuted && backgroundMusicRef.current.paused) {
      backgroundMusicRef.current.play().catch(error => {
        console.error('Ошибка при воспроизведении фоновой музыки:', error);
      });
    }
  };

  const pauseBackgroundMusic = () => {
    if (backgroundMusicRef.current && !backgroundMusicRef.current.paused) {
      backgroundMusicRef.current.pause();
    }
  };

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playButtonClick, playBackgroundMusic, pauseBackgroundMusic }}>
      {children}
    </AudioContext.Provider>
  );
};

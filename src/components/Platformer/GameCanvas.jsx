// src/components/Platformer/GameCanvas.jsx
import { useRef, useEffect, useContext } from 'react';
import Phaser from 'phaser';

// Подключаем обе сцены
import PreloadScene from './game/scenes/PreloadScene';
import MainScene from './game/scenes/MainScene';

import { AudioContext } from '../../contexts/AudioContext';

const GameCanvas = ({ onGameEnd }) => {
  const gameRef = useRef(null);
  const { isMuted } = useContext(AudioContext);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      pixelArt: true,
      transparent: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 500 },
          debug: false
        }
      },
      // Подключаем сцены
      scene: [PreloadScene, MainScene],
      parent: 'phaser-container',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    // Инициализируем игру (сразу со всеми сценами)
    gameRef.current = new Phaser.Game(config);

    // Запускаем PreloadScene, передавая ей onGameEnd (=> onLevelComplete) и isMuted
    gameRef.current.scene.start('PreloadScene', {
      onLevelComplete: onGameEnd,
      isMuted: isMuted
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, [onGameEnd, isMuted]);

  return (
    <div
      id="phaser-container"
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10
      }}
    />
  );
};

export default GameCanvas;

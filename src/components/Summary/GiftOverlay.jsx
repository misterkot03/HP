// src/components/Summary/GiftOverlay.jsx

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Локальный Lottie
import { Player } from '@lottiefiles/react-lottie-player';
import fireworkAnimation from './fireworks.json';

// Конфетти (ReactConfetti)
import Confetti from 'react-confetti';

/*
  "FullScreen" - оверлей на весь экран,
  НЕ блокируем скролл => не ставим overflow:hidden,
  пусть пользователь может крутить страницу под ним.
*/
const FullScreen = styled.div`
  position: fixed;
  top: 0; 
  left: 0;
  width: 100vw; 
  height: 100vh;
  background: rgba(0,0,0,0.8);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  margin-top: 1rem;
  color: #fff;
`;

/* "Тряска" для гифки коробки */
const shake = keyframes`
  0%   { transform: rotate(0deg); }
  25%  { transform: rotate(2deg); }
  50%  { transform: rotate(-2deg); }
  75%  { transform: rotate(1deg); }
  100% { transform: rotate(0deg); }
`;

const BoxImage = styled.img`
  width: 300px;
  cursor: pointer;
  animation: ${shake} 1.2s infinite;
  margin-top: 2rem;
  z-index: 1;
`;

/* Кнопка «Закрыть» */
const CloseButton = styled.button`
  margin-top: 1.5rem;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  z-index: 1;
`;

export default function GiftOverlay({ onCloseGift }) {
  const [giftOpened, setGiftOpened] = useState(false);

  /* 
    Чтобы "react-confetti" занимало весь экран, 
    нам нужно знать текущее окно (width/height).
  */
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Отслеживаем ресайз, чтобы Confetti всегда занимало нужные размеры
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Кликаем на коробку => "открывается подарок"
  const handleBoxClick = () => {
    setGiftOpened(true);
  };

  // Закрыть оверлей
  const handleClose = () => {
    if (onCloseGift) {
      onCloseGift();
    }
  };

  return (
    <FullScreen>
      {/* Если подарок уже "открыт", рендерим ФЕЙЕРВЕРК и КОНФЕТТИ */}
      {giftOpened && (
        <>
          {/* Фейерверки (Lottie) на весь фон */}
          <div style={{
            position:'absolute',
            top:0,
            left:0,
            width:'100%',
            height:'100%',
            zIndex:0
          }}>
            <Player
              autoplay
              loop
              src={fireworkAnimation}
              style={{ width:'100%', height:'100%' }}
            />
          </div>

          {/* Падающие конфетти */}
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={300}
            recycle={false}
            /* recycle=false => конфетти пролетят один раз */
          />

          <Title>С Днём Рождения!!! </Title>
          <Title>Да, немного совсем чучуть опаздал но вот да, это вот подарок :3 </Title>
          <CloseButton onClick={handleClose}>
            Закрыть
          </CloseButton>
        </>
      )}

      {/* Если подарок ещё "закрыт", показываем гифку коробки */}
      {!giftOpened && (
        <>
          <Title>Опа, коробочка!</Title>
          <p style={{ color:'#fff' }}>Нажми на коробку, чтобы открыть</p>
          <BoxImage 
            src="/assets/images/gift-box.gif"
            alt="Gift box"
            onClick={handleBoxClick}
          />
        </>
      )}
    </FullScreen>
  );
}

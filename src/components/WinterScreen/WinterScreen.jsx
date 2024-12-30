// src/components/WinterScreen/WinterScreen.jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import Lottie from 'lottie-react';

// Импорт JSON-анимаций (лежащих в той же папке)
import snowAnimation from './snow.json';
import fireworksAnimation from './fireworks.json';

// Плавная анимация появления текста
const fadeIn = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(20px);
  }
  100% { 
    opacity: 1; 
    transform: translateY(0);
  }
`;

// Обёртка всего экрана
const WinterWrapper = styled.div`
  position: fixed;
  inset: 0; /* top:0, right:0, bottom:0, left:0 */
  margin: 0;
  padding: 0;
  overflow: hidden; /* Спрячем прокрутку и обрежем лишнее */

  /* Фон на всю ширину/высоту */
  background: url('/assets/images/winter-bg.gif') no-repeat center center / cover;
`;

/* 
  Базовый контейнер для анимаций: 
  - абсолютное позиционирование поверх экрана
  - растягиваем на 100% ширины/высоты
  - pointer-events: none (чтобы клики проходили "сквозь" анимацию) 
*/
const BaseLottieContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

/* 
  Пример контейнера для текста. 
  Можно задать position: relative, 
  чтобы текст располагался "поверх" анимаций. 
*/
const TextContainer = styled.div`
  position: relative; /* чтобы текст "всплывал" над фоном */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%; /* Занимаем весь экран, если нужно */
  color: #fff;
  font-size: 2rem;
  text-align: center;

  animation: ${fadeIn} 2s ease forwards;
`;

/* 
  Для удобства создаём два разных компонента: 
  SnowLayer и FireworksLayer.
  В каждом можно скорректировать scale (масштаб) 
  или смещения, чтобы перекрыть полностью экран.
*/

/* ---------- СНЕГ ---------- */
const SnowLayer1 = styled(BaseLottieContainer)`
  /* Пример небольшой трансформации: */
  transform: scale(1.2);
  transform-origin: center;
  opacity: 0.7; /* Чуть прозрачнее */
`;

const SnowLayer2 = styled(BaseLottieContainer)`
  transform: scale(1.5);
  transform-origin: center;
  opacity: 0.5;
  /* Можно ещё подвинуть, если нужно: top: -10%; left: -10%; */
`;

/* ---------- ФЕЙЕРВЕРКИ ---------- */
const FireworksLayer1 = styled(BaseLottieContainer)`
  /* Если анимация по центру — сместим и увеличим */
  transform: scale(1.2);
  transform-origin: center;
  opacity: 0.8;
`;

const FireworksLayer2 = styled(BaseLottieContainer)`
  transform: scale(1.5);
  transform-origin: center;
  opacity: 0.6;
  /* Можно дополнительно сместить */
  top: -5%;
  left: -5%;
`;

function WinterScreen() {
  return (
    <WinterWrapper>
      {/* --- СНЕГ --- */}
      <SnowLayer1>
        <Lottie animationData={snowAnimation} loop autoPlay />
      </SnowLayer1>
      <SnowLayer2>
        <Lottie animationData={snowAnimation} loop autoPlay />
      </SnowLayer2>

      {/* --- ФЕЙЕРВЕРКИ --- */}
      <FireworksLayer1>
        <Lottie animationData={fireworksAnimation} loop autoPlay />
      </FireworksLayer1>
      <FireworksLayer2>
        <Lottie animationData={fireworksAnimation} loop autoPlay />
      </FireworksLayer2>

      {/* --- ТЕКСТ --- */}
      <TextContainer>
        <p>Спасибо, что прошёл весь путь!</p>
        <p>Надеюсь, тебе понравилось это путешествие во времени :)</p>
        <p>С НОВЫМ ГОДОМ!!!</p>
      </TextContainer>
    </WinterWrapper>
  );
}

export default WinterScreen;

// src/components/Summary/Summary.js

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

import PartBeginning from './PartBeginning';
import PartSpring from './PartSpring';
import PartSummer from './PartSummer';
import PartAutumnWinter from './PartAutumnWinter';
import GiftOverlay from './GiftOverlay'; // <-- Добавьте импорт GiftOverlay

// Анимация градиента фона
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100%{ background-position: 0% 50%; }
`;

// Основной контейнер страницы
const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow-y: auto; 
  overflow-x: hidden;
  scroll-behavior: smooth;

  background: linear-gradient(270deg, #fda085, #f6d365, #fda085);
  background-size: 600% 600%;
  animation: ${gradientAnimation} 15s ease infinite;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Полупрозрачная «карточка»
const BlurredBox = styled(motion.div)`
  max-width: 1200px;
  width: 90%;
  margin: 2rem auto;
  padding: 3rem;
  color: #fff;
  text-align: center;

  background: rgba(0,0,0,0.2);
  backdrop-filter: blur(8px);
  border-radius: 20px;
`;

// Заголовок
const Title = styled(motion.h1)`
  font-size: 3rem;
  margin-bottom: 2rem;
`;

// Подзаголовок / обычный текст
const IntroText = styled(motion.p)`
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

// Блок-карточка для выбора части года
const PartCard = styled(motion.div)`
  margin: 1rem 0;
  padding: 1.5rem;
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background: rgba(255,255,255,0.2);
  }
`;

const PartTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const PartDesc = styled.p`
  font-size: 1rem;
`;

// Кнопка «Назад» или «Вернуться»
const BackButton = styled.button`
  margin-top: 2rem;
  padding: 12px 24px;
  font-size: 1rem;
  background-color: #ff0000;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #cc0000;
  }
`;

// Framer-motion варианты анимации
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, when: 'beforeChildren', staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7 }
  }
};

function Summary({ onRestart, onFinalFinish }) {
  // subPage = 'main', 'beginning', 'spring', 'summer', 'autumnWinter'
  const [subPage, setSubPage] = useState('main');

  // Показывать ли «подарок» (GiftOverlay)
  const [showGift, setShowGift] = useState(false);

  // Вернуться на главный экран (список частей)
  const goBackToMain = () => {
    setSubPage('main');
  };

  // Открыть «коробку»
  const handleOpenGift = () => {
    setShowGift(true);
  };

  // Закрыть «коробку»
  const handleCloseGift = () => {
    setShowGift(false);
  };

  return (
    <PageContainer>
      <BlurredBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {subPage === 'main' && (
          <>
            <Title variants={itemVariants}>Итоги Года</Title>
            <IntroText variants={itemVariants}>
              2024 год был наполнен знаменательными событиями.<br/>
              Ниже перечислены основные части года. Нажмите на любую, чтобы увидеть подробнее.
            </IntroText>

            <PartCard
              variants={itemVariants}
              onClick={() => setSubPage('beginning')}
            >
              <PartTitle>Начало Года</PartTitle>
              <PartDesc>События первых месяцев...</PartDesc>
            </PartCard>

            <PartCard
              variants={itemVariants}
              onClick={() => setSubPage('spring')}
            >
              <PartTitle>Весна</PartTitle>
              <PartDesc>Весенние события...</PartDesc>
            </PartCard>

            <PartCard
              variants={itemVariants}
              onClick={() => setSubPage('summer')}
            >
              <PartTitle>Лето</PartTitle>
              <PartDesc>Жаркая пора, поездки...</PartDesc>
            </PartCard>

            <PartCard
              variants={itemVariants}
              onClick={() => setSubPage('autumnWinter')}
            >
              <PartTitle>Осень и Зима</PartTitle>
              <PartDesc>В осенне-зимний период тоже многое произошло...</PartDesc>
            </PartCard>

            <BackButton onClick={onRestart}>
              Вернуться в Игру
            </BackButton>
          </>
        )}

        {subPage === 'beginning' && (
          <>
            <PartBeginning />
            <BackButton onClick={goBackToMain} style={{ marginTop:'2rem' }}>
              Назад к списку частей
            </BackButton>
          </>
        )}

        {subPage === 'spring' && (
          <>
            <PartSpring />
            <BackButton onClick={goBackToMain} style={{ marginTop:'2rem' }}>
              Назад к списку частей
            </BackButton>
          </>
        )}

        {subPage === 'summer' && (
          <>
            <PartSummer />
            <BackButton onClick={goBackToMain} style={{ marginTop:'2rem' }}>
              Назад к списку частей
            </BackButton>
          </>
        )}

        {subPage === 'autumnWinter' && (
          <>
            {/*
              PartAutumnWinter принимает onFinish (для финала) и onOpenGift (для открытия подарка).
              Например, внутри PartAutumnWinter у вас будет кнопка "Открыть подарок", и при нажатии:
              props.onOpenGift();
            */}
            <PartAutumnWinter onFinish={onFinalFinish} onOpenGift={handleOpenGift} />

            <BackButton onClick={goBackToMain} style={{ marginTop:'2rem' }}>
              Назад к списку частей
            </BackButton>
          </>
        )}
      </BlurredBox>

      {/*
        Если showGift === true, показываем оверлей GiftOverlay. 
        Внутри GiftOverlay у нас есть onCloseGift, 
        чтобы пользователь мог закрыть «коробку».
      */}
      {showGift && <GiftOverlay onCloseGift={handleCloseGift} />}
    </PageContainer>
  );
}

export default Summary;

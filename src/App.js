// src/App.js

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';

import IntroSoundAlert from './components/IntroSoundAlert/IntroSoundAlert';
import Loader from './components/Loader/Loader';
import MainMessage from './components/MainMessage/MainMessage';
import GameCanvas from './components/Platformer/GameCanvas';

/** 
 * ВАЖНО: импортируем ваш компонент Summary,
 * где уже будут части года + финал 
 */
import Summary from './components/Summary/Summary';

/** 
 * Предположим, новый "зимний" экран 
 * для «mainScreenEnded»:
 */
import WinterScreen from './components/WinterScreen/WinterScreen';
import BackgroundMusic from './components/BackgroundMusic/BackgroundMusic';

const ScreenContainer = styled(motion.div)`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center; 
  justify-content: center;
  flex-direction: column;
  position: relative;
  background-color: transparent;
`;

function App() {
  const [step, setStep] = useState('soundAlert');

  const handleSoundConfirmed = () => {
    setStep('loading');
    setTimeout(() => {
      setStep('message');
    }, 2000);
  };

  const handleMessageShown = () => {
    setStep('mainScreen');
  };

  const handleStartJourney = () => {
    setStep('platformer');
  };

  const handleGameEnd = () => {
    setStep('summary');
  };

  // Кнопка "Вернуться в игру" из Summary
  const handleRestart = () => {
    setStep('mainScreen');
  };

  // ВАЖНО: когда финал завершён, меняем step
  const handleFinishFinal = () => {
    setStep('mainScreenEnded');
  };

  const variants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit:    { opacity: 0, scale: 1.1, transition: { duration: 0.5 } }
  };

  return (
    <>
      <BackgroundMusic />
      <AnimatePresence mode="wait">
        {step === 'soundAlert' && (
          <ScreenContainer key="soundAlert" variants={variants} initial="initial" animate="animate" exit="exit">
            <IntroSoundAlert onConfirm={handleSoundConfirmed} />
          </ScreenContainer>
        )}

        {step === 'loading' && (
          <ScreenContainer key="loading" variants={variants} initial="initial" animate="animate" exit="exit">
            <Loader />
          </ScreenContainer>
        )}

        {step === 'message' && (
          <ScreenContainer key="message" variants={variants} initial="initial" animate="animate" exit="exit">
            <MainMessage onDone={handleMessageShown} />
          </ScreenContainer>
        )}

        {step === 'mainScreen' && (
          <ScreenContainer key="mainScreen" variants={variants} initial="initial" animate="animate" exit="exit">
            <h1 style={{ color: '#fff' }}>Многое произошло в этом году...</h1>
            <p style={{ color: '#fff' }}>Пройдемся по нему ещё раз, шаг за шагом?</p>
            <button
              onClick={handleStartJourney}
              style={{ marginTop: '2rem', padding: '10px 20px', fontSize: '16px' }}
            >
              Начать путь
            </button>
          </ScreenContainer>
        )}

        {step === 'platformer' && (
          <ScreenContainer key="platformer" variants={variants} initial="initial" animate="animate" exit="exit" style={{ overflow: 'hidden' }}>
            <GameCanvas onGameEnd={handleGameEnd} />
          </ScreenContainer>
        )}

        {step === 'summary' && (
          <ScreenContainer key="summary" variants={variants} initial="initial" animate="animate" exit="exit">
            {/* Передаём onFinalFinish, чтобы финальная часть могла вызвать handleFinishFinal */}
            <Summary onRestart={handleRestart} onFinalFinish={handleFinishFinal} />
          </ScreenContainer>
        )}

        {step === 'mainScreenEnded' && (
          <ScreenContainer key="mainScreenEnded" variants={variants} initial="initial" animate="animate" exit="exit">
            <WinterScreen />
          </ScreenContainer>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;

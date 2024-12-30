// src/components/Summary/ChatSection.js
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

/* ==== АНИМАЦИЯ ГРАДИЕНТА ФОНА ==== */
const backgroundAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

/* ==== ВНЕШНИЙ КОНТЕЙНЕР НА ВЕСЬ ЭКРАН ==== */
const PageContainer = styled.div`
  min-height: 100vh;
  /* Плавный скролл всей страницы */
  scroll-behavior: smooth;

  /* Анимированный градиентный фон */
  background: linear-gradient(270deg, #ffd3a5, #fdffc0, #c2ffd8, #ace7ff);
  background-size: 800% 800%;
  animation: ${backgroundAnimation} 20s ease infinite;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

/* ==== ЧАТ (центр экрана) ==== */
const ChatWrapper = styled.div`
  width: 100%;
  max-width: 700px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);

  /* Если хотите, чтобы чат прокручивался внутри себя, ограничьте высоту: */
  max-height: 80vh;
  overflow-y: auto;
`;

/* ==== ОДНО СООБЩЕНИЕ ==== */
const MessageBubble = styled(motion.div)`
  display: inline-block;
  max-width: 70%;
  margin-bottom: 1rem;
  padding: 12px 16px;
  border-radius: 18px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);

  align-self: ${props => props.isMine ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.isMine ? '#c2f1c2' : '#ffffff'};
  color: #333;

  border-bottom-right-radius: ${props => props.isMine ? '4px' : '18px'};
  border-bottom-left-radius: ${props => props.isMine ? '18px' : '4px'};

  white-space: pre-wrap; /* перенос по \n */
`;

/* ==== ВРЕМЯ ==== */
const TimeStamp = styled.div`
  font-size: 0.75rem;
  opacity: 0.6;
  text-align: right;
  margin-top: 4px;
`;

/* ==== СПИСОК СООБЩЕНИЙ ==== */
const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

/* ==== ВАРИАНТЫ АНИМАЦИИ ==== */
const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05, // небольшая задержка для последовательного появления
      duration: 0.3
    }
  })
};

/* ==== Хук для анимации при вхождении в область видимости ==== */
function useScrollAnimation() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return { ref, inView };
}

/* ==== ГЛАВНЫЙ КОМПОНЕНТ ==== */
const ChatSection = ({ messages, myId = 'М' }) => {
  // myId – условное значение, кто «я», чтобы цвет был другим
  // messages: [{ from: 'М'/'Д', text: '...', time: '...' }, ...]

  const { ref, inView } = useScrollAnimation();

  return (
    <PageContainer>
      <ChatWrapper ref={ref}>
        <MessagesContainer>
          {messages.map((msg, index) => {
            const isMine = (msg.from === myId);
            return (
              <MessageBubble
                key={index}
                variants={messageVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                custom={index}
                isMine={isMine}
              >
                {msg.text}
                <TimeStamp>{msg.time}</TimeStamp>
              </MessageBubble>
            );
          })}
        </MessagesContainer>
      </ChatWrapper>
    </PageContainer>
  );
};

export default ChatSection;

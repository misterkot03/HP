// src/components/Summary/PartBeginning.js

import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Snowfall from 'react-snowfall';

// Слайдер (react-slick)
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Lottie
import { Player } from '@lottiefiles/react-lottie-player';

/* ===================== 1) СТИЛИ ===================== */

// Общий контейнер (с зимним градиентом на всю высоту)
const PageWrapper = styled.div`
  /* "зимний" градиент: голубой -> синий */
  background: linear-gradient(180deg, #cceafc 0%, #3278b3 100%);
  position: relative;
  width: 100%;
  min-height: 100vh;

  /* Скроллим весь контент */
  overflow-x: hidden;
  overflow-y: auto;
`;

// Контейнер для контента
const ContentContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 2; /* Выше, чем снег и фон */
`;

// Для плавного появления каждого блока
const AnimatedBlock = styled(motion.div)`
  margin-bottom: 2rem;
`;

// Заголовок
const Heading = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
  color: #fff; /* Чтобы было видно на синем фоне */
`;

/* Чат */
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageBubble = styled(motion.div)`
  align-self: ${props => props.isMine ? 'flex-end' : 'flex-start'};
  background-color: ${props => props.isMine ? '#7dcf7d' : '#ffffff'};
  color: #333;
  padding: 10px 15px;
  border-radius: 16px;
  border-top-right-radius: ${props => props.isMine ? '0' : '16px'};
  border-top-left-radius: ${props => props.isMine ? '16px' : '0'};
  max-width: 80%;
  white-space: pre-line;
`;

const TimeStamp = styled.div`
  font-size: 0.8rem;
  text-align: right;
  margin-top: 4px;
  opacity: 0.6;
`;

/* Медиа-контейнер (картинки, видео, iframe) */
const MediaWrapper = styled.div`
  display: flex;
  justify-content: center;

  width: 100%;
  max-width: 600px;
  height: 340px;
  margin: 1rem auto;
  position: relative;
  overflow: hidden;

  & > img,
  & > video,
  & > iframe {
    width: 600px;
    height: 340px;
    object-fit: cover;
    border-radius: 8px;
  }
`;

// Стикеры / 3D-модели сбоку
const SideStickersContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 3; /* Чтобы они были поверх остального */
`;

const StickerImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  animation: floatUpDown 3s ease-in-out infinite alternate;
  
  @keyframes floatUpDown {
    0% { transform: translateY(0); }
    100% { transform: translateY(-15px); }
  }
`;

// LottieContainer для 3D/анимаций
const LottieContainer = styled.div`
  width: 150px;
  height: 150px;
`;

// Стикеры (увядающая роза и сигареты)
const StickersContainer = styled.div`
  text-align: center;
  font-size: 1.4rem;
  line-height: 2;
  color: #fff;
`;

const StickerEmoji = styled.span`
  font-size: 3rem;
  margin: 0 1rem;
`;

/* Слайдер */
const SliderWrapper = styled.div`
  margin-top: 1rem;

  .slick-slide img {
    margin: 0 auto;
    border-radius: 8px;
    width: 600px; 
    height: 340px;
    object-fit: cover;
  }
`;

/* Фото вкуснятины */
const StyledImage = styled.img`
  display: block;
  width: 600px;
  height: 340px;
  object-fit: cover;
  border-radius: 8px;
  margin: 0 auto;
`;

/* ===================== 2) ДАННЫЕ ДЛЯ ЧАТА ===================== */
const january1Chat = [
  { from: 'Д', text: 'Ты спишь?', time: '7:38' },
  { from: 'Д', text: 'Ля', time: '13:26' },
  { from: 'Д', text: 'Какой же он засонич', time: '13:26' },
  { from: 'Д', text: 'О', time: '13:29' },
  { from: 'М', text: 'Я в 6 часу уснул где то', time: '13:29' },
  { from: 'М', text: 'Проснулся', time: '13:29' },
  { from: 'Д', text: 'Ну да, во сколько меня из этого сонного царства забирать будешь?)', time: '13:30' },
  { from: 'М', text: 'Ну', time: '13:30' },
  { from: 'Д', text: 'Шо молчим', time: '13:30' },
  { from: 'Д', text: 'Ля', time: '13:33' },
  { from: 'Д', text: 'Ну ответь плизяя', time: '13:35' },
  { from: 'М', text: 'Да мне mom позвонила', time: '13:50' },
  { from: 'Д', text: 'Ааа', time: '13:50' },
  { from: 'Д', text: 'Ну до, во сколько меня...', time: '13:36' },
  { from: 'М', text: 'Ну могу щас приехать\nНу приезжай ;)', time: '13:36' },
  { from: 'Д', text: 'А то я тут один сижу пержу\nСкучно', time: '13:36' },
  { from: 'М', text: 'Окей, lets gou', time: '13:36' },
  { from: 'Д', text: 'Питался\nТавай жду', time: '13:36' },
  { from: 'Д', text: 'давай', time: '13:37' },
  { from: 'М', text: 'Все как всегда валяются дрыхнут...', time: '13:36' },
  { from: 'Д', text: 'Питался\nТавай жду', time: '13:36' },
  { from: 'М', text: 'ты то хоть поспал?', time: '13:37' },
  { from: 'М', text: 'Да\nМолодец\nВсе, выезжаю', time: '13:50' },
  { from: 'Д', text: 'Тавай\nПриехал', time: '13:50' },
  { from: 'М', text: 'Ок\nЩа выйду', time: '14:05' }
];

/* ===================== 3) Хук для анимации при скролле ===================== */
function useScrollAnimation() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };
  return { ref, inView, variants };
}

const AnimatedSection = ({ children }) => {
  const { ref, inView, variants } = useScrollAnimation();
  return (
    <AnimatedBlock
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
    >
      {children}
    </AnimatedBlock>
  );
}

/* ===================== 4) ОСНОВНОЙ КОМПОНЕНТ ===================== */
const PartBeginning = () => {
  // Используем React ref, чтобы вычислить полную высоту содержимого и задать высоту снегопада
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(2000); // какое-то значение по умолчанию

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight + 200); 
      // +200 на всякий случай
    }
  }, []);

  // Слайдер react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true
  };

  // Пример фоток для слайдера
  const photosForSlider = [
    '/assets/images/photo1.png',
    '/assets/images/photo2.png',
    '/assets/images/photo3.png',
    '/assets/images/photo4.png',
    '/assets/images/photo5.png',
    '/assets/images/photo6.png',
    '/assets/images/photo7.png',
    '/assets/images/photo8.png',
    '/assets/images/photo9.png',
    '/assets/images/photo10.png'
  ];
  return (
    <PageWrapper>
      {/* Снегопад на всю высоту содержимого */}
      <Snowfall
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        snowflakeCount={150}     // больше снега
        speed={[1.0, 2.0]}
        wind={[-0.5, 1]}
        radius={[0.5, 2.0]}
        snowfallStyle={{ height: contentHeight }}
      />

      {/* Стикеры/3D-модель сбоку (просто несколько картинок + Lottie анимация) */}
      <SideStickersContainer>
        <StickerImage src="/assets/images/snowman.png" alt="Snowman" />
        <LottieContainer>
          <Player
            autoplay
            loop
            speed={1}
            src="https://assets3.lottiefiles.com/packages/lf20_tM9kN3.json"
            style={{ height: '100%', width: '100%' }}
          />
        </LottieContainer>
      </SideStickersContainer>

      <ContentContainer ref={contentRef}>
        {/* 1) Заголовок */}
        <AnimatedSection>
          <Heading>Начало Года</Heading>
        </AnimatedSection>

        {/* 2) Чат */}
        <AnimatedSection>
          <p style={{ color: '#fff' }}>
            Это вся наша переписка за 1 января, да-да это я вот тебя сразу в новом году уже о чем-то попросил :)
          </p>
          <ChatContainer>
            {january1Chat.map((msg, index) => {
              const isMine = msg.from === 'М';
              return (
                <MessageBubble
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07, duration: 0.3 }}
                  isMine={isMine}
                >
                  {msg.text}
                  <TimeStamp>{msg.time}</TimeStamp>
                </MessageBubble>
              );
            })}
          </ChatContainer>
        </AnimatedSection>

        {/* 3) YouTube видео (контролы убираем — user wants to control?? Actually user said "Вернуть возможность самому включать видео" 
            so let's keep controls=1 on YouTube with no autoplay 
         */}
        <AnimatedSection>
          <p style={{ color: '#fff' }}>А вот тот самый трек, который я слушал каждое утро:</p>
          <MediaWrapper>
            <iframe
              src="https://www.youtube.com/embed/dCWCo4S1-to?controls=1" 
              frameBorder="0"
              allowFullScreen
              title="YouTube video"
            />
          </MediaWrapper>
        </AnimatedSection>

        {/* 4) Локальный видосик (с контролами, не автозапуск) */}
        <AnimatedSection>
          <p style={{ color: '#fff' }}>А это просто забавный видосик:</p>
          <MediaWrapper>
            <video
              src="/assets/videos/funny.mp4"
              controls
            />
          </MediaWrapper>
        </AnimatedSection>

        {/* 5) Стикеры (увядающая роза и сигареты) */}
        <AnimatedSection>
          <StickersContainer>
            <StickerEmoji>🌹</StickerEmoji>
            А это мы с тобой еще молодые и красивые 
            <StickerEmoji>🚬</StickerEmoji>
          </StickersContainer>
        </AnimatedSection>

        {/* 6) Слайдер с фотками */}
        <AnimatedSection>
          <p style={{ color: '#fff' }}>А теперь небольшой слайдер с фотками:</p>
          <SliderWrapper>
            <Slider {...sliderSettings}>
              {photosForSlider.map((src, idx) => (
                <div key={idx}>
                  <img src={src} alt={`Photo ${idx}`} />
                </div>
              ))}
            </Slider>
          </SliderWrapper>
        </AnimatedSection>

        {/* 7) "Я жоска флексю" - видео-кружок (с контролами) */}
        <AnimatedSection>
          <p style={{ color: '#fff' }}>А это я жоска флексю:</p>
          <MediaWrapper>
            <video
              src="/assets/videos/telegram_circle.mp4"
              controls
              style={{ borderRadius: '50%' }}
            />
          </MediaWrapper>
        </AnimatedSection>

        {/* 8) "Тупа Чех..."  */}
        <AnimatedSection>
          <p style={{ color: '#fff' }}>А это тупа Чех, когда ты уволился:</p>
          <MediaWrapper>
            <video
              src="/assets/videos/resignation.mp4"
              controls
            />
          </MediaWrapper>
        </AnimatedSection>

        {/* 9) "Смотри какой ты умочка..." + фото */}
        <AnimatedSection>
          <p style={{ color: '#fff' }}>
            Смотри какой ты умочка, сам приготовил такую вкуснятину:
          </p>
          <StyledImage src="/assets/images/delicious.jpg" alt="Вкуснятина" />
        </AnimatedSection>

        {/* 10) Финал */}
        <AnimatedSection>
          <p style={{ color: '#fff' }}>
            Ну вот и все, ты вспомнил целых 3 месяца этого года,
            проходи путь дальше, чтобы добраться до конца! :3
          </p>
        </AnimatedSection>
      </ContentContainer>
    </PageWrapper>
  );
};

export default PartBeginning;

// src/components/Summary/PartSummer.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { useSprings, animated } from 'react-spring';

/* ===================== 1) "ЛЕТНИЕ" ЛЕТАЮЩИЕ ЭФФЕКТЫ ===================== */
const SUMMER_ICONS = ['☀️', '🌞', '🌻', '⛱️'];

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

const FlyingSummerContainer = styled.div`
  pointer-events: none;
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  z-index: 1;
  overflow: hidden;
`;

const SummerEmoji = styled(animated.div)`
  position: absolute;
  font-size: 2.2rem;
`;

function FlyingSummerEffects({ count = 10 }) {
  const [icons] = useState(() =>
    new Array(count).fill(null).map(() => ({
      symbol: SUMMER_ICONS[Math.floor(Math.random() * SUMMER_ICONS.length)]
    }))
  );

  // Анимации полёта
  const [springs] = useSprings(count, index => {
    let x = randomRange(0, window.innerWidth - 50);
    const duration = randomRange(5000, 12000);

    return {
      from: { opacity: 1, top: -60, left: x },
      to: async next => {
        while (true) {
          await next({
            top: window.innerHeight + 60,
            left: x,
            config: { duration }
          });
          x = randomRange(0, window.innerWidth - 50);
          await next({
            top: -60,
            left: x,
            config: { duration: 0 }
          });
        }
      }
    };
  });

  return (
    <FlyingSummerContainer>
      {springs.map((style, idx) => (
        <SummerEmoji key={idx} style={style}>
          {icons[idx].symbol}
        </SummerEmoji>
      ))}
    </FlyingSummerContainer>
  );
}

/* ===================== 2) ОСНОВНОЙ КОНТЕЙНЕР (PartSummer) ===================== */

// Летний фон
const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  background: linear-gradient(180deg, #ffe089 0%, #ffd16a 100%);
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 2;
  padding: 2rem;
`;

const ContentContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 3; /* контент выше летающих иконок */
`;

// Плавное появление при скролле
function useScrollFadeIn() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const style = {
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(20px)',
    transition: 'all 0.8s ease'
  };
  return { ref, style };
}

// Базовые элементы
const SectionTitle = styled.h3`
  margin: 2rem 0 1rem;
  font-size: 1.8rem;
  color: #333;
`;
const Paragraph = styled.p`
  color: #333;
  line-height: 1.6;
`;
const SingleImage = styled.img`
  display: block;
  margin: 1rem auto;
  max-width: 600px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
`;
const RectVideo = styled.video`
  display: block;
  margin: 1rem auto;
  max-width: 600px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
`;
const CircleVideo = styled.video`
  display: block;
  margin: 1rem auto;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
`;
const RowContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: center;
`;
const Emoji = styled.span`
  font-size: 1.6rem;
  margin: 0 0.2rem;
`;

/* ===================== 3) ОТДЕЛЬНЫЙ БЛОК «ПИТЕР» ===================== */

// Контейнер под блок «Питер»
const BigBlockContainer = styled.div`
  margin: 2rem 0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  position: relative; /* чтобы плавающие картинки были внутри */
`;

// Фоновые фото
const FloatingPhoto = styled.img`
  position: absolute;
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  opacity: 0.85;
  z-index: 1;  /* "под" контентом, контент будет выше */
  
  /* Простая анимация покачивания/парения */
  animation: floatUpDown 6s ease-in-out infinite alternate;
  @keyframes floatUpDown {
    0% { transform: translateY(0) scale(1) rotate(0deg); }
    100% { transform: translateY(-20px) scale(1.03) rotate(2deg); }
  }
`;

// Контейнер для текста/видео, чтобы он был выше фоновых картинок
const PiterContent = styled.div`
  position: relative;
  z-index: 2;  /* выше, чем FloatingPhoto (z-index: 1) */
`;

const PiterPhotos = [
  { src: '/assets/images/piter-bg1.jpg', top: '5%', left: '5%' },
  { src: '/assets/images/piter-bg2.jpg', top: '40%', left: '2%' },
  { src: '/assets/images/piter-bg3.jpg', top: '15%', right: '5%' },
  { src: '/assets/images/piter-bg4.jpg', bottom: '10%', left: '10%' },
  { src: '/assets/images/piter-bg5.jpg', bottom: '25%', right: '15%' },
  { src: '/assets/images/piter-bg6.jpg', top: '50%', right: '10%' },
];

function PiterBlock() {
  return (
    <BigBlockContainer>
      {/* Фоновые картинки (больше, 200×200) */}
      {PiterPhotos.map((photo, i) => (
        <FloatingPhoto
          key={i}
          src={photo.src}
          alt={`piter-bg-${i}`}
          style={{
            top: photo.top,
            bottom: photo.bottom,
            left: photo.left,
            right: photo.right
          }}
        />
      ))}

      {/* Контент Питера (выше фона) */}
      <PiterContent>
        <SectionTitle>Поездка в Питер</SectionTitle>
        <Paragraph>Это вот мы взлетаем)</Paragraph>
        <RectVideo src="/assets/videos/takeoff.mp4" controls />

        <Paragraph>А это мы с тобой ходили в прикольный ресторан</Paragraph>
        <RectVideo src="/assets/videos/restaurant.mp4" controls />

        <Paragraph>Супер эпичная фоточка :D</Paragraph>
        <SingleImage src="/assets/images/epic-photo.jpg" alt="Epic Photo" />

        <Paragraph>А это мы сходили в Эрмитаж и потерялись :D</Paragraph>
        <SingleImage src="/assets/images/hermitage.jpg" alt="Hermitage" />

        <Paragraph>
          А это мы с тобой две дурехи решили созвониться по видеозвонку,
          находясь в метре друг от друга :D
        </Paragraph>
        <SingleImage src="/assets/images/weird-call.jpg" alt="Weird call" />

        <Paragraph>
          В конце этого блока — видео с общими воспоминаниями:
        </Paragraph>
        <RectVideo src="/assets/videos/memories.mp4" controls />
      </PiterContent>
    </BigBlockContainer>
  );
}

/* ===================== 4) ОСНОВНОЙ КОМПОНЕНТ — PartSummer ===================== */

const PartSummer = () => {
  const [count] = useState(10);

  // Хуки анимации при прокрутке
  const fadeIntro = useScrollFadeIn();
  const fade1 = useScrollFadeIn();
  const fade2 = useScrollFadeIn();
  const fade3 = useScrollFadeIn();
  const fade4 = useScrollFadeIn();
  const fadePiter = useScrollFadeIn();
  const fade6 = useScrollFadeIn();
  const fade7 = useScrollFadeIn();
  const fade8 = useScrollFadeIn();
  const fade9 = useScrollFadeIn();
  const fade10 = useScrollFadeIn();
  const fade11 = useScrollFadeIn();

  return (
    <PageWrapper>
      {/* Летающие "летние" иконки (солнышки, цветочки) */}
      <FlyingSummerEffects count={count} />

      <ContentContainer>
        <SectionTitle ref={fadeIntro.ref} style={fadeIntro.style}>
          Вот ты и дошел до прекрасной поры — Лето 
          <Emoji>☀️</Emoji><Emoji>🌻</Emoji><Emoji>⛱️</Emoji>
        </SectionTitle>

        {/* 1) */}
        <SectionTitle ref={fade1.ref} style={fade1.style}>
          1. Ну а первый день лета начался с того...
        </SectionTitle>
        <Paragraph style={fade1.style}>
          ...что мы с тобой два обжоркинса заказали питсы)
        </Paragraph>
        <SingleImage
          style={fade1.style}
          src="/assets/images/pizza.jpg"
          alt="Pizza"
        />

        {/* 2) */}
        <SectionTitle ref={fade2.ref} style={fade2.style}>
          2. А это я пвосто напвосто пвохиш, скушав твой сникелс :3
        </SectionTitle>
        <SingleImage
          style={fade2.style}
          src="/assets/images/snicker.jpg"
          alt="Snickers"
        />

        {/* 3) */}
        <SectionTitle ref={fade3.ref} style={fade3.style}>
          3. А это коротко говоря о твоей памяти, рыбка блин)
        </SectionTitle>
        <SingleImage
          style={fade3.style}
          src="/assets/images/fish-memory.jpg"
          alt="Fish memory"
        />

        {/* 4) */}
        <SectionTitle ref={fade4.ref} style={fade4.style}>
          4. А это я дразню Алексиоса))
        </SectionTitle>
        <RectVideo
          style={fade4.style}
          src="/assets/videos/tease-alexios.mp4"
          controls
        />

        {/* 5) — Питер-блок (оборачиваем в div, чтобы применить fadePiter) */}
        <div ref={fadePiter.ref} style={fadePiter.style}>
          <SectionTitle>
            5. Ну а это мы с тобой полетели в Питер увааа
          </SectionTitle>
          <PiterBlock />
        </div>

        {/* 6) */}
        <SectionTitle ref={fade6.ref} style={fade6.style}>
          6. Ой а это мы с мамой такие милахи типа :3
        </SectionTitle>
        <RowContainer style={fade6.style}>
          <SingleImage src="/assets/images/mom-1.jpg" alt="Mom1" />
          <SingleImage src="/assets/images/mom-2.jpg" alt="Mom2" />
          <SingleImage src="/assets/images/mom-3.jpg" alt="Mom3" />
        </RowContainer>

        {/* 7) */}
        <SectionTitle ref={fade7.ref} style={fade7.style}>
          7. А это ты опять полетел в Новосиб)
        </SectionTitle>
        <RowContainer style={fade7.style}>
          <SingleImage src="/assets/images/novosib1.jpg" alt="novosib1" />
          <SingleImage src="/assets/images/novosib2.jpg" alt="novosib2" />
          <SingleImage src="/assets/images/novosib3.jpg" alt="novosib3" />
        </RowContainer>

        {/* 8) */}
        <SectionTitle ref={fade8.ref} style={fade8.style}>
          8. А это ты на рыбалке)
        </SectionTitle>
        <SingleImage
          style={fade8.style}
          src="/assets/images/fishing.jpg"
          alt="Fishing"
        />

        {/* 9) */}
        <SectionTitle ref={fade9.ref} style={fade9.style}>
          9. А это просто мы с тобой ночью ржукаем как неадекватные :D
        </SectionTitle>
        <CircleVideo
          style={fade9.style}
          src="/assets/videos/laugh-night.mp4"
          controls
        />

        {/* 10) */}
        <SectionTitle ref={fade10.ref} style={fade10.style}>
          10. Она следит за тобой...
        </SectionTitle>
        <SingleImage
          style={fade10.style}
          src="/assets/images/she-watching.jpg"
          alt="She watching"
        />

        {/* 11) */}
        <SectionTitle ref={fade11.ref} style={fade11.style}>
          11. А это я пвосто напвосто чучут натоптал в коридоре,
          а ты сразу злюкаться)
        </SectionTitle>
        <SingleImage
          style={fade11.style}
          src="/assets/images/mess-corridor.jpg"
          alt="Mess corridor"
        />
      </ContentContainer>
    </PageWrapper>
  );
};

export default PartSummer;

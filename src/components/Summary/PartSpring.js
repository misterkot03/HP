// src/components/Summary/PartSpring.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import { useSprings, animated } from 'react-spring';

/* ================== "ЛЕТАЮЩИЕ" ОБЪЕКТЫ (цветочки) ================== */

const FLOWERS = ['🌸', '🌷', '💮', '🌺', '🌼', '🌻'];

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

const FlyingContainer = styled.div`
  pointer-events: none;
  position: fixed;
  top: 0; left: 0;
  width: 100vw; 
  height: 100vh;
  z-index: 1;
  overflow: hidden;
`;

const FlowerEmoji = styled(animated.div)`
  position: absolute;
  font-size: 2rem;
`;

function FlyingFlowers({ count = 10 }) {
  // 1) Храним размеры окна
  const [dims, setDims] = useState({ width: 0, height: 0 });

  // 2) Следим за изменениями размеров
  useEffect(() => {
    function handleResize() {
      setDims({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    // При первом рендере
    handleResize();
    // Событие ресайза
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3) Подготавливаем массив цветочков
  const [flowers] = useState(() =>
    new Array(count).fill(null).map(() => ({
      emoji: FLOWERS[Math.floor(Math.random() * FLOWERS.length)]
    }))
  );

  // 4) useSprings. Вызываем его безусловно, чтобы не было раннего return.
  const [springs] = useSprings(count, index => {
    // Если dims ещё не определён, подставим заглушки > 0, 
    // иначе может быть NaN в вычислениях
    const safeWidth = Math.max(dims.width, 1);
    const safeHeight = Math.max(dims.height, 1);

    let x = randomRange(0, safeWidth - 50);
    const duration = randomRange(8000, 15000);

    return {
      from: { opacity: 1, top: -50, left: x },
      to: async next => {
        while (true) {
          // Летим вниз за duration мс
          await next({
            top: safeHeight + 50,
            left: x,
            config: { duration }
          });
          // Сбрасываем наверх (0)
          x = randomRange(0, safeWidth - 50);
          await next({
            top: -50,
            left: x,
            config: { duration: 0 }
          });
        }
      }
    };
  });

  // 5) Если размеры ещё не получены, можно показать пустой контейнер,
  //    но без условий до хуков (хуки уже вызваны)
  if (dims.width === 0 || dims.height === 0) {
    // Возвращаем пустой блок, но ХУКИ уже были вызваны
    return <FlyingContainer />;
  }

  // 6) Иначе выводим анимацию
  return (
    <FlyingContainer>
      {springs.map((style, idx) => (
        <FlowerEmoji key={idx} style={style}>
          {flowers[idx].emoji}
        </FlowerEmoji>
      ))}
    </FlyingContainer>
  );
}

/* ================== ОСНОВНАЯ СЕКЦИЯ PARTSPRING ================== */

// Общий контейнер (фон)
const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  background: linear-gradient(180deg, #ace7ff 0%, #c2ffd8 100%);
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 2;
  padding: 2rem;
`;

// Контейнер для текста/картинок
const ContentContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 3; /* выше, чем FlyingFlowers (z=1) */
`;

// Хук появления при скролле
function useScrollFadeIn() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const style = {
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(20px)',
    transition: 'all 0.8s ease'
  };
  return { ref, style };
}

// Стили
const SectionTitle = styled.h3`
  margin: 2rem 0 1rem;
  font-size: 1.8rem;
  color: #333;
`;
const Paragraph = styled.p`
  color: #333;
  line-height: 1.6;
`;

// Веер из 3х картинок
const FanContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 600px;
  height: 320px;
  margin: 1rem auto;
`;
const FanImage = styled.img`
  position: absolute;
  max-width: 45%;
  height: auto;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);

  &:nth-child(1) {
    transform: rotate(-15deg) translateX(-120px);
    z-index: 1;
  }
  &:nth-child(2) {
    transform: rotate(0deg);
    z-index: 2;
  }
  &:nth-child(3) {
    transform: rotate(15deg) translateX(120px);
    z-index: 1;
  }
  &:hover {
    transform: scale(1.1);
    z-index: 3;
    box-shadow: 0 8px 30px rgba(0,0,0,0.3);
  }
`;

// Одиночное изображение
const SingleImage = styled.img`
  display: block;
  margin: 1rem auto;
  max-width: 600px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
`;

// Прямоугольное видео
const RectVideo = styled.video`
  display: block;
  margin: 1rem auto;
  max-width: 600px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
`;

// Круглое видео
const CircleVideo = styled.video`
  display: block;
  margin: 1rem auto;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
`;

// Контейнер для нескольких
const RowContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: center;
`;

// Эмодзи
const Emoji = styled.span`
  font-size: 1.5rem;
  margin: 0 0.2rem;
`;

const PartSpring = () => {
  // Количество цветочков
  const [countFlowers] = useState(12);

  // Анимация появления
  const fade1 = useScrollFadeIn();
  const fade2 = useScrollFadeIn();
  const fade3 = useScrollFadeIn();
  const fade4 = useScrollFadeIn();
  const fade5 = useScrollFadeIn();
  const fade6 = useScrollFadeIn();
  const fade7 = useScrollFadeIn();
  const fade8 = useScrollFadeIn();
  const fade9 = useScrollFadeIn();
  const fade10 = useScrollFadeIn();
  const fade11 = useScrollFadeIn();
  const fade12 = useScrollFadeIn();
  const fade13 = useScrollFadeIn();
  const fadeEnd = useScrollFadeIn();

  return (
    <PageWrapper>
      {/* Летающие цветочки */}
      <FlyingFlowers count={countFlowers} />

      <ContentContainer>
        <SectionTitle ref={fade1.ref} style={fade1.style}>
          1. А вот мы дошли с тобой до весны)
        </SectionTitle>
        <Paragraph style={fade1.style}>
          в первый день весны ты полетел в командировку)
        </Paragraph>
        <FanContainer style={fade1.style}>
          <FanImage src="/assets/images/spring-trip1.jpg" alt="Trip1" />
          <FanImage src="/assets/images/spring-trip2.jpg" alt="Trip2" />
          <FanImage src="/assets/images/spring-trip3.jpg" alt="Trip3" />
        </FanContainer>

        {/* 2) */}
        <SectionTitle ref={fade2.ref} style={fade2.style}>
          2. А это ты меня попросил приготовить что хочу...
        </SectionTitle>
        <Paragraph style={fade2.style}>
          ...ну я и приготовил то, что ты попросил :3
        </Paragraph>
        <SingleImage
          style={fade2.style}
          src="/assets/images/cooking-request.jpg"
          alt="Cooking request"
        />

        {/* 3) */}
        <SectionTitle ref={fade3.ref} style={fade3.style}>
          3. А это я проснулся и записал кружок какое было у меня настроение :D
        </SectionTitle>
        <Paragraph style={fade3.style}>
          P.S. Мама и Папа если вы это смотрите, то выключите звук,
          а то ушки завянут&nbsp;<Emoji>🙈</Emoji>
        </Paragraph>
        <CircleVideo
          style={fade3.style}
          src="/assets/videos/morning-mood.mp4"
          controls
        />

        {/* 4) */}
        <SectionTitle ref={fade4.ref} style={fade4.style}>
          4. А это ты хороший работник, которого похвалили и дали денежку)
        </SectionTitle>
        <SingleImage
          style={fade4.style}
          src="/assets/images/money-reward.jpg"
          alt="Reward"
        />

        {/* 5) */}
        <SectionTitle ref={fade5.ref} style={fade5.style}>
          5. А это пвосто напвосто мы с тобой :D
        </SectionTitle>
        <RectVideo
          style={fade5.style}
          src="/assets/videos/we-together.mp4"
          controls
        />

        {/* 6) */}
        <SectionTitle ref={fade6.ref} style={fade6.style}>
          6. А это Алексиос была очень недовольной)
        </SectionTitle>
        <CircleVideo
          style={fade6.style}
          src="/assets/videos/alexios-mad.mp4"
          controls
        />

        {/* 7) */}
        <Paragraph ref={fade7.ref} style={fade7.style}>
          А это мы с тобой очень порядочные дети, которые общаются 
          как истинные интеллегенты :D
        </Paragraph>
        <SingleImage
          style={fade7.style}
          src="/assets/images/good-kids.jpg"
          alt="Good kids"
        />

        {/* 8) */}
        <SectionTitle ref={fade8.ref} style={fade8.style}>
          7. Ну да, мама и правда у нас много словечек знает 
          <Emoji>😉</Emoji>
        </SectionTitle>
        <SingleImage
          style={fade8.style}
          src="/assets/images/mom-knows.jpg"
          alt="Mom knows"
        />

        {/* 9) */}
        <SectionTitle ref={fade9.ref} style={fade9.style}>
          8. Очередной очень тонкий намек 
          <Emoji>🙄</Emoji><Emoji>💅</Emoji>
        </SectionTitle>
        <SingleImage
          style={fade9.style}
          src="/assets/images/hint.jpg"
          alt="Hint"
        />

        {/* 10) */}
        <SectionTitle ref={fade10.ref} style={fade10.style}>
          9. А это я в клуб ходил екэлэмэнэ <Emoji>🙈</Emoji>
        </SectionTitle>
        <RowContainer style={fade10.style}>
          <RectVideo src="/assets/videos/club1.mp4" controls />
          <RectVideo src="/assets/videos/club2.mp4" controls />
        </RowContainer>

        {/* 11) */}
        <SectionTitle ref={fade11.ref} style={fade11.style}>
          10. А это типичная уборка когда мы жили вместе ахзаххахаха
        </SectionTitle>
        <CircleVideo
          style={fade11.style}
          src="/assets/videos/cleaning.mp4"
          controls
        />

        {/* 12) */}
        <SectionTitle ref={fade12.ref} style={fade12.style}>
          11. А это я совсем чучуть удивился что ты сходил в баню
        </SectionTitle>
        <RowContainer style={fade12.style}>
          <CircleVideo src="/assets/videos/banya1.mp4" controls />
          <CircleVideo src="/assets/videos/banya2.mp4" controls />
        </RowContainer>

        {/* 13) */}
        <SectionTitle ref={fade13.ref} style={fade13.style}>
          12. Ахахах <Emoji>🪨</Emoji> Ахаххаха <Emoji>🪨</Emoji>
        </SectionTitle>
        <CircleVideo
          style={fade13.style}
          src="/assets/videos/stone-laugh.mp4"
          controls
        />

        {/* 14) */}
        <SectionTitle>
          13. А это пвосто напвосто я под конец семестра 
          сижу с дергающимся глазом :D
        </SectionTitle>
        <RectVideo
          src="/assets/videos/end-semester.mp4"
          controls
        />

        <Paragraph ref={fadeEnd.ref} style={fadeEnd.style}>
          Ну вот мы быстренько пробежались с тобой по весне этого года,
          продолжай держать путь, возможно там есть что-то интересное!
        </Paragraph>
      </ContentContainer>
    </PageWrapper>
  );
};

export default PartSpring;

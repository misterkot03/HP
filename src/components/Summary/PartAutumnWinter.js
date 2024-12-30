// src/components/Summary/PartAutumnWinter.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  box-sizing: border-box;
  color: #fff; /* Текст на фоне, который задаётся в Summary */
`;

const SectionTitle = styled.h3`
  margin: 2rem 0 1rem;
  font-size: 1.4rem;
`;

const Paragraph = styled.p`
  line-height: 1.6;
`;

const CircleVideo = styled.video`
  display: block;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  object-fit: cover;
  margin: 1rem auto;
`;

const RectVideo = styled.video`
  display: block;
  max-width: 600px;
  height: auto;
  margin: 1rem auto;
  border-radius: 8px;
`;

const SingleImage = styled.img`
  display: block;
  max-width: 600px;
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem auto;
`;

const FinishButton = styled.button`
  display: block;
  margin: 2rem auto;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
`;

export default function PartAutumnWinter({ onFinish, onOpenGift }) {
  /*
    onFinish   - вызываем при нажатии "Завершить путь"
    onOpenGift - вызываем, когда пользователь докрутил до середины (первый раз)
  */

  // Середина для Intersection Observer
  const [midRef, midInView] = useInView({ threshold: 0.1 });

  // Флаг, чтобы "подарок" открывался лишь однажды
  const [giftTriggered, setGiftTriggered] = useState(false);

  useEffect(() => {
    // Если середина попала во вьюпорт, а подарок ещё не вызывался:
    if (midInView && !giftTriggered && onOpenGift) {
      onOpenGift();           // Вызываем "Открыть подарок" (родитель)
      setGiftTriggered(true); // Чтобы второй раз не открывалось
    }
  }, [midInView, giftTriggered, onOpenGift]);

  return (
    <ContentWrapper>
      <h2 style={{ textAlign:'center' }}>
        Осенне-зимний период
      </h2>

      <SectionTitle>1. 1-е сентября, начало учебы</SectionTitle>
      <CircleVideo src="/assets/videos/1sep-call-game.mp4" controls />
      <Paragraph>М-многозадачность :D</Paragraph>

      <SectionTitle>2. Новая квартира и новые проблемы</SectionTitle>
      <CircleVideo src="/assets/videos/new-flat.mp4" controls />

      <SectionTitle>3. А потом кто-то наехал на камушек...</SectionTitle>
      <SingleImage src="/assets/images/fix-car.jpg" alt="Fix car" />

      <SectionTitle>4. А это я готовил себе всякие вкусняхи</SectionTitle>
      <CircleVideo src="/assets/videos/tasty-food.mp4" controls />

      <SectionTitle>5. А это самое лучшее дизайнерское решение...</SectionTitle>
      <SingleImage src="/assets/images/design-idea.jpg" alt="Design idea" />

      <SectionTitle>6. Когда делал этот сайт и оно начинало работать :D</SectionTitle>
      <CircleVideo src="/assets/videos/site-working.mp4" controls />

      <SectionTitle>7. А это я у мамы сантехник :D</SectionTitle>
      <SingleImage src="/assets/images/plumber-me.jpg" alt="Plumber me" />

      <SectionTitle>8. Вот оно безумие XD</SectionTitle>
      <CircleVideo src="/assets/videos/madness.mp4" controls />

      <SectionTitle>9. Мама, мяса уже тогда ещё не было :D</SectionTitle>
      <SingleImage src="/assets/images/no-meat.jpg" alt="No Meat" />

      <SectionTitle>10. Ой а это ты меня поздлавил с дэрэшкой</SectionTitle>
      <SingleImage src="/assets/images/birthday-congrats.jpg" alt="Birthday Congrats" />


            {/* Середина (раз триггерили — повторно не откроется) */}
            <div 
        ref={midRef}
        style={{ margin:'2rem 0', border:'1px dashed #ccc', height:'40px' }}
      >
        <p style={{ color:'#ccc', fontSize:'0.8rem' }}>-- Середина --</p>
      </div>

      <SectionTitle>11. Волосяное сердечко от хомячегощаго братика :3</SectionTitle>
      <CircleVideo src="/assets/videos/hair-heart.mp4" controls />

      <SectionTitle>12. Моё недовольное лицо</SectionTitle>
      <Paragraph>Это вот так я сижу делаю сайт и вылазит ошибка :D</Paragraph>
      <CircleVideo src="/assets/videos/angry-face.mp4" controls />

      <SectionTitle>13. Первый снег</SectionTitle>
      <CircleVideo src="/assets/videos/first-snow.mp4" controls />

      <SectionTitle>14. Дед мороз полетел в Питер на командировку</SectionTitle>
      <SingleImage src="/assets/images/santa-piter.jpg" alt="Santa in Piter" />

      <SectionTitle>15. Посвящаю один видосик GPT</SectionTitle>
      <RectVideo src="/assets/videos/dedicated-gpt.mp4" controls />

      <SectionTitle>16. А это ты на конференции</SectionTitle>
      <SingleImage src="/assets/images/conf1.jpg" alt="Conf1" />
      <SingleImage src="/assets/images/conf2.jpg" alt="Conf2" />
      <SingleImage src="/assets/images/conf3.jpg" alt="Conf3" />
      <SingleImage src="/assets/images/conf4.jpg" alt="Conf4" />

      <SectionTitle>17. А это мы тебя поздравляли</SectionTitle>
      <Paragraph>2 рядом стоящих видео</Paragraph>
      <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
        <RectVideo src="/assets/videos/congrats1.mp4" controls />
        <RectVideo src="/assets/videos/congrats2.mp4" controls />
      </div>

      <SectionTitle>18. А это ты опять летал в Новосиб</SectionTitle>
      <SingleImage src="/assets/images/novosib-late.jpg" alt="Novosib late" />



      

{/* Наконец, кнопка "Завершить путь" */}
<FinishButton onClick={onFinish}>
        Завершить путь
      </FinishButton>
    </ContentWrapper>
  );
}

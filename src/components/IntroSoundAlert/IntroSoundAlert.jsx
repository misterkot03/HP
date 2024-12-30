// src/components/IntroSoundAlert/IntroSoundAlert.jsx
import React, { useContext } from 'react';
import SoundButton from '../SoundButton/SoundButton';
import styled from 'styled-components';
import { AudioContext } from '../../contexts/AudioContext';

const AlertContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  color: #fff;
`;

const IntroSoundAlert = ({ onConfirm }) => {
  const { playBackgroundMusic } = useContext(AudioContext);

  const handleConfirm = () => {
    playBackgroundMusic(); // Воспроизведение музыки после взаимодействия
    onConfirm(); // Переход к следующему шагу
  };

  return (
    <AlertContainer>
      <h2 style={{textAlign:'center'}}>Включи звук,<br/>чтобы услышать эхо прошедшего года...</h2>
      <p style={{textAlign:'center'}}>Включи громкость на ПК, это будет важно.</p>
      <SoundButton
        onClick={handleConfirm}
        style={{ marginTop: '1rem', padding: '10px 20px', fontSize: '16px' }}
      >
        Звук включен
      </SoundButton>
    </AlertContainer>
  );
};

export default IntroSoundAlert;

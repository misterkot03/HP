// src/components/SoundButton/SoundButton.jsx
import React, { useRef, useContext } from 'react';
import { AudioContext } from '../../contexts/AudioContext';
import styled from 'styled-components';

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #ffffffaa;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #ffffff;
  }
`;

const SoundButton = ({ onClick, children, style }) => {
  const { isMuted, playButtonClick } = useContext(AudioContext);
  const buttonClickSoundRef = useRef(null);

  const handleClick = () => {
    if (!isMuted && buttonClickSoundRef.current) {
      buttonClickSoundRef.current.currentTime = 0;
      buttonClickSoundRef.current.play().catch(error => {
        console.error('Ошибка при воспроизведении звука кнопки:', error);
      });
    }
    if (onClick) onClick();
  };

  return (
    <>
      <audio ref={buttonClickSoundRef} src="/assets/audio/button-click.mp3" />
      <Button onClick={handleClick} style={style}>
        {children}
      </Button>
    </>
  );
};

export default SoundButton;

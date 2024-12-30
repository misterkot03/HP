// src/components/BackgroundMusic/BackgroundMusic.jsx
import React, { useContext } from 'react';
import { AudioContext } from '../../contexts/AudioContext';
import styled from 'styled-components';

const MusicButton = styled.button`
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

const BackgroundMusic = () => {
  const { isMuted, toggleMute } = useContext(AudioContext);

  const handleToggleMute = () => {
    toggleMute();
  };

  return (
    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
      <MusicButton onClick={handleToggleMute}>
        {isMuted ? '🔇 Музыка' : '🔊 Музыка'}
      </MusicButton>
    </div>
  );
};

export default BackgroundMusic;

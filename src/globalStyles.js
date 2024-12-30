import { createGlobalStyle, keyframes } from 'styled-components';

const moveBackground = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 1000px 0; }
`;

const GlobalStyles = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    font-family: 'Press Start 2P', cursive;
    background: #000;
    color: #fff;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  * {
    box-sizing: border-box;
  }

  body {
    background: url('https://i.pinimg.com/originals/4f/df/c1/4fdfc15e4339422e434b294f3382de0a.png') repeat;
    animation: ${moveBackground} 30s linear infinite;
  }

  button {
    font-family: 'Press Start 2P', cursive;
    background: #333;
    color: #fff;
    border: 4px solid #fff;
    padding: 0.5rem 1rem;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: background 0.3s;

    &:hover {
      background: #555;
    }

    &:active {
      background: #777;
    }
  }
`;

export default GlobalStyles;

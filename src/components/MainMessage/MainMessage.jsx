import { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
`;

const MainMessage = ({ onDone }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <Container>
      <h1>Этот год был полон событий...</h1>
      <p>Приготовься снова пройти сквозь дни, недели и месяцы,<br/>чтобы вспомнить всё, что было важным.</p>
    </Container>
  );
};

MainMessage.propTypes = {
  onDone: PropTypes.func.isRequired
};

export default MainMessage;

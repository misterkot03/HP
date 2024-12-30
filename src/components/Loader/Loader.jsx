import styled from 'styled-components';

const Container = styled.div`
  display:flex; 
  flex-direction:column;
  align-items:center; 
  justify-content:center; 
`;

const Spinner = styled.div`
  width:50px;
  height:50px;
  border:5px solid #333;
  border-top:5px solid #fff;
  border-radius:50%;
  animation:spin 1s linear infinite;

  @keyframes spin {
    to {transform: rotate(360deg);}
  }
`;

const Loader = () => {
  return (
    <Container>
      <Spinner />
      <p style={{marginTop:'1rem'}}>Загрузка...</p>
    </Container>
  );
};

export default Loader;

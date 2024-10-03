import styled from "styled-components";

const Buttons = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 30px;
  border-radius: 10px;
`;
const ButtonStyle = styled.button`
  display: flex;
  width: 221px;
  height: 72px;
  padding: 26px 20px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  background-color: #1abc9c;
`;

function ButtonsContainer() {
  return (
    <>
      <Buttons>
        <Button text={"Analisis de datos"}></Button>
        <Button text={"Historial de rutas"}></Button>
      </Buttons>
    </>
  );
}

function Button(props) {
  const { text } = props;
  return <ButtonStyle>{text}</ButtonStyle>;
}

export default ButtonsContainer;

import styled from "styled-components";

const MetricsContainer = styled.div`
  display: flex;
  height: 142px;
  padding: 15px 25px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 15px;
  align-self: stretch;
  border-radius: 10px;
  background-color: #fff;
`;
const TextStyle = styled.p`
  color: #34495e;
  font-size: 14px;
  font-family: Inter;
  font-weight: 600;
  word-wrap: break-word;
`;

function Metrics() {
  return (
    <>
      <MetricsContainer>
        <MetricsBody></MetricsBody>
      </MetricsContainer>
    </>
  );
}
function MetricsBody() {
  return (
    <>
      <TextStyle>Pedidos en curso:</TextStyle>
      <TextStyle>Vehiculos Disponibles:</TextStyle>
      <TextStyle>Tiempo promedio de entrega</TextStyle>
    </>
  );
}

export default Metrics;

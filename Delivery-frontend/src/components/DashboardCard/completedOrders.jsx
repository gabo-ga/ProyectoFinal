import styled from "styled-components";

const ActiveOrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
`;
const TittleStyle = styled.h4`
  display: flex;
  width: 203px;
  height: 22px;
  justify-content: center;
  align-items: center;
  margin: 0;
`;
const OrderCardContainer = styled.div`
  display: flex;
  width: 200px;
  height: 133px;
  padding: 35px 23px;
  align-items: center;
  gap: 6px;
  background-color: #fff;
  border-radius: 10px;
`;
const TextStyle = styled.p`
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin: 0;
`;
const TextContainer = styled.div`
  display: flex;
  width: 140px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  flex-shrink: 0;
`;

function CompletedOrders() {
  return (
    <>
      <ActiveOrdersContainer>
        <TittleStyle>PEDIDOS COMPLETADOS</TittleStyle>
        <OrderCardContainer>
          <OrderCard></OrderCard>
        </OrderCardContainer>
      </ActiveOrdersContainer>
    </>
  );
}

function OrderCard() {
  return (
    <>
      <TextContainer>
        <TextStyle>Cliente:</TextStyle>
        <TextStyle>Telefono:</TextStyle>
        <TextStyle>Destino:</TextStyle>
        <TextStyle>Hora de Entrega:</TextStyle>
        <TextStyle>Descripcion:</TextStyle>
      </TextContainer>
    </>
  );
}

export default CompletedOrders;

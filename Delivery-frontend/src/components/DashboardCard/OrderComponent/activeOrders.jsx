import styles from "./orders.module.css";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import styled from "styled-components";
import Card from "react-bootstrap/Card";

const ActiveOrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
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

function ActiveOrders() {
  return (
    <>
      <Container fluid>
        <Row>
          <Col xs={12}>
            <h4 className={styles.TextStyle}>PEDIDOS EN CURSO</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <OrderCard></OrderCard>
            </Card>
          </Col>
        </Row>
      </Container>
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

export default ActiveOrders;

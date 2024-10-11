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
            <OrderCard></OrderCard>
          </Col>
        </Row>
      </Container>
    </>
  );
}

function OrderCard() {
  return (
    <>
      <Card className={styles.CardStyle}>
        <Card.Body className={styles.textContainer}>
          <Card.Text className={styles.TextStyle}>Cliente:</Card.Text>
          <Card.Text className={styles.TextStyle}>Telefono:</Card.Text>
          <Card.Text className={styles.TextStyle}>Destino:</Card.Text>
          <Card.Text className={styles.TextStyle}>Hora de entrega:</Card.Text>
          <Card.Text className={styles.TextStyle}>Descripcion:</Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default ActiveOrders;

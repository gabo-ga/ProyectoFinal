import styles from "./orders.module.css";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Card from "react-bootstrap/Card";

function ActiveOrders(props) {
  return (
    <>
      <Container fluid>
        <Row>
          <Col xs={12}>
            <h4 className={styles.TextStyle}>{props.tittle}</h4>
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

import { Col, Row, Container } from "react-bootstrap";
import styles from "./orders.module.css";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

function CompletedOrders(props) {
  return (
    <>
      <Container fluid>
        <Row>
          <Col xs={12}>
            <h4 className={styles.TextStyle}>
              <Link to="/ordershistory" className={styles.TextStyle}>
                {props.title}
              </Link>
            </h4>
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
          <Card.Text className={styles.TextStyle}>Teléfono: </Card.Text>
          <Card.Text className={styles.TextStyle}>Fecha del pedido:</Card.Text>
          <Card.Text className={styles.TextStyle}>Estado: </Card.Text>
          <Card.Text className={styles.TextStyle}>Destino:</Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default CompletedOrders;

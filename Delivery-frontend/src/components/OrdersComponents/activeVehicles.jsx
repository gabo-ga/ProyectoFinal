import { Col, Row, Container } from "react-bootstrap";
import styles from "./orders.module.css";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

function ActiveVehicles(props) {
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
          <Card.Text className={styles.TextStyle}>Vehiculo:</Card.Text>
          <Card.Text className={styles.TextStyle}>Tipo: </Card.Text>
          <Card.Text className={styles.TextStyle}>Conductor:</Card.Text>
          <Card.Text className={styles.TextStyle}>Placa: </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default ActiveVehicles;

import Container from "react-bootstrap/esm/Container";
import Card from "react-bootstrap/esm/Card";
import styles from "./metrics.module.css";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

function Metrics() {
  return (
    <>
      <Container className={styles.MetricsContainer}>
        <MetricsBody></MetricsBody>
      </Container>
    </>
  );
}
function MetricsBody() {
  return (
    <>
      <Row>
        <Col xs={12} md={4}>
          <Card.Title className={styles.TextStyle}>
            Pedidos en curso:
          </Card.Title>
        </Col>
        <Col xs={12} md={4}>
          <Card.Title className={styles.TextStyle}>
            Vehículos Disponibles:
          </Card.Title>
        </Col>
        <Col xs={12} md={4}>
          <Card.Title className={styles.TextStyle}>
            Tiempo promedio de entrega:
          </Card.Title>
        </Col>
      </Row>
    </>
  );
}

export default Metrics;

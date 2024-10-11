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
        <Col xs={12} md={4} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Pedidos en curso:</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Vehículos Disponibles:</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Tiempo promedio de entrega:</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Metrics;

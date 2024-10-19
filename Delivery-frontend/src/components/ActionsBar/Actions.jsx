import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import styles from "./Actions.module.css";

function ActionBar() {
  return (
    <Container fluid className={styles.container}>
      <Row className={styles.row}>
        <Col md={2} className={styles.hiddenOnXS}>
          ID
        </Col>
        <Col xs={4} md={2}>
          CLIENTE
        </Col>
        <Col xs={4} md={2}>
          ESTADO
        </Col>
        <Col xs={4} md={2}>
          HORA ESTIMADA
        </Col>
        <Col md={2} className={styles.hiddenOnXS}>
          CONDUCTOR
        </Col>
        <Col className={styles.hiddenOnXS} xs={3} md={2}>
          ACCIONES
        </Col>
      </Row>
    </Container>
  );
}

export default ActionBar;

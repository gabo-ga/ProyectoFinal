import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import styles from "./Actions.module.css";

function ActionBar({ label1, label2, label3, label4, label5 }) {
  return (
    <Container fluid className={styles.container}>
      <Row className={styles.row}>
        <Col md={2} className={styles.hiddenOnXS}>
          {label1}
        </Col>
        <Col xs={4} md={3}>
          {label2}
        </Col>
        <Col xs={4} md={2}>
          {label3}
        </Col>
        <Col md={2} className={styles.hiddenOnXS}>
          {label4}
        </Col>
        <Col xs={3} md={2}>
          {label5}
        </Col>
      </Row>
    </Container>
  );
}

export default ActionBar;

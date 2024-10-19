import { Col, Container, Row } from "react-bootstrap";
import styles from "./index.module.css";
import { PencilSquare, Trash } from "react-bootstrap-icons";

function Order() {
  return (
    <Container fluid className={styles.container}>
      <Row className="w-100">
        <Col md={2} className={styles.hideOnXS}>
          ID
        </Col>
        <Col xs={4} md={2}>
          Cliente
        </Col>
        <Col xs={3} md={2}>
          En camino
        </Col>
        <Col xs={2} md={2}>
          hora
        </Col>
        <Col md={2} className={styles.hideOnXS}>
          CONDUCTOR
        </Col>
        <Col xs={3} md={2}>
          <PencilSquare className={styles.icons}></PencilSquare>
          <Trash className={styles.icons}></Trash>
        </Col>
      </Row>
    </Container>
  );
}

export default Order;

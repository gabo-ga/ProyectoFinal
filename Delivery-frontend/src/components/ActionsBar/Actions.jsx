import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import styles from "./Actions.module.css";

function ActionBar() {
  return (
    <Container className={styles.container}>
      <Row>
        <Col xs={3}>CLIENTE</Col>
        <Col xs={3}>ESTADO</Col>
        <Col xs={3}>HORA</Col>
        <Col xs={3}>ACCIONES</Col>
      </Row>
    </Container>
  );
}

export default ActionBar;

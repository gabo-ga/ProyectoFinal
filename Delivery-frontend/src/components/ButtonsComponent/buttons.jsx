import styles from "./buttons.module.css";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

function ButtonsContainer() {
  return (
    <>
      <Container>
        <Row className={styles.ButtonsContainer}>
          <Col xs={6} md={6}>
            <Button text={"Analisis de datos"}></Button>
          </Col>
          <Col xs={6} md={6}>
            <Button
              text={"Analisis de datos"}
              className={styles.TextStyle}
            ></Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

function Button(props) {
  const { text } = props;
  return <div className={styles.TextStyle}>{text}</div>;
}

export default ButtonsContainer;

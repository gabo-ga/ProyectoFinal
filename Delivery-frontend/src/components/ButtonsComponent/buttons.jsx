import { useNavigate } from "react-router-dom";
import styles from "./buttons.module.css";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

function ButtonsContainer() {
  return (
    <Container>
      <Row className={styles.ButtonsContainer}>
        <Col xs={12} md={12}>
          <Button
            text={"Análisis de datos"}
            className={styles.TextStyle}
            redirectTo="/metrics"
          />
        </Col>
      </Row>
    </Container>
  );
}

function Button(props) {
  const { text, redirectTo } = props;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(redirectTo); // Redirige a la página especificada
  };

  return (
    <div
      className={styles.TextStyle}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      {text}
    </div>
  );
}

export default ButtonsContainer;

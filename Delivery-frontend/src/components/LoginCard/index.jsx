import styles from "./index.module.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function LoginCard() {
  return (
    <>
      <div className={styles.Background}>
        <Container className={styles.FormContainer}>
          <Row className={styles.RowStyle}>
            <Col xs={12} md={8} lg={4}>
              <Card>
                <Card.Body>
                  <Card.Title className={styles.LoginTitle}>
                    INICIAR SESION
                  </Card.Title>
                  <Form>
                    <EmailInput></EmailInput>
                    <PasswordInput></PasswordInput>
                    <LoginButton></LoginButton>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

function EmailInput() {
  return (
    <>
      <div>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label className={styles.LabelStyle}>
            Correo electrónico
          </Form.Label>
          <Form.Control
            className={styles.InputStyle}
            type="email"
            placeholder="Ingrese su correo"
          />
        </Form.Group>
      </div>
    </>
  );
}

function PasswordInput() {
  return (
    <>
      <div>
        <Form.Group controlId="password" className="mb-3">
          <Form.Label className={styles.LabelStyle}>Contraseña</Form.Label>
          <Form.Control
            className={styles.InputStyle}
            type="password"
            placeholder="Ingrese su contraseña"
          />
        </Form.Group>
      </div>
    </>
  );
}

function LoginButton() {
  const handleClick = () => {
    console.log("click");
  };
  return (
    <>
      <div>
        <Button
          className={styles.LoginButton}
          variant="warning"
          type="submit"
          onClick={handleClick}
        >
          INICIAR SESIÓN
        </Button>
      </div>
    </>
  );
}

export default LoginCard;

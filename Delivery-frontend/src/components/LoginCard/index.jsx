import styles from "./index.module.css";
import {
  Button,
  Alert,
  Card,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/login/", {
        username,
        password,
      });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access}`;
      navigate("/dashboard");
    } catch (error) {
      console.error("error al iniciar sesion", error);
      if (error.response && error.response.data && error.response.data.detail) {
        setErrorMessage(error.response.data.detail);
      } else {
        setErrorMessage(
          "Error al iniciar sesión. Por favor, inténtalo de nuevo."
        );
      }
    }
  };

  return (
    <div className={styles.Background}>
      <Container className={styles.FormContainer}>
        <Row className={styles.RowStyle}>
          <Col xs={12} md={8} lg={4}>
            <Card.Body>
              <Card.Title className={styles.LoginTitle}>
                INICIAR SESION
              </Card.Title>
              {errorMessage && (
                <LoginError message={errorMessage} variant="danger" />
              )}
              <Form onSubmit={handleSubmit}>
                <UsernameInput username={username} setUsername={setUsername} />
                <PasswordInput password={password} setPassword={setPassword} />
                <LoginButton></LoginButton>
              </Form>
            </Card.Body>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function UsernameInput({ username, setUsername }) {
  return (
    <div>
      <Form.Group controlId="username" className="mb-3">
        <Form.Label className={styles.LabelStyle}>Nombre de usuario</Form.Label>
        <Form.Control
          className={styles.InputStyle}
          type="text"
          placeholder="Ingrese su nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>
    </div>
  );
}

function PasswordInput({ password, setPassword }) {
  return (
    <div>
      <Form.Group controlId="password" className="mb-3">
        <Form.Label className={styles.LabelStyle}>Contraseña</Form.Label>
        <Form.Control
          className={styles.InputStyle}
          type="password"
          placeholder="Ingrese su contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
    </div>
  );
}

function LoginButton() {
  const navigate = useNavigate();
  return (
    <>
      <div>
        <Button className={styles.LoginButton} variant="warning" type="submit">
          INICIAR SESIÓN
        </Button>
      </div>
    </>
  );
}

function LoginError({ message, variant = "danger" }) {
  return <Alert variant={variant}>{message}</Alert>;
}

export default LoginCard;

import React, { useState } from "react";
import styles from "./index.module.css";
import {
  Card,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UsernameInput from "../../components/userNameInput";
import PasswordInput from "../../components/PasswordInput";
import LoginButton from "../../components/LoginButton";
import LoginError from "../../components/LoginError";
import { useAuth } from "../../AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      await loginUser(username, password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMessage("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className={styles.Background}>
      <Container className={styles.FormContainer}>
        <Row className={styles.RowStyle}>
          <Col xs={12} md={8} lg={4}>
            <Card.Body>
              <Card.Title className={styles.LoginTitle}>
                INICIAR SESIÓN
              </Card.Title>
              {errorMessage && (
                <LoginError message={errorMessage} variant="danger" />
              )}
              <Form onSubmit={handleSubmit}>
                <UsernameInput value={username} onChange={setUsername} />
                <PasswordInput value={password} onChange={setPassword} />
                <LoginButton />
              </Form>
            </Card.Body>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;

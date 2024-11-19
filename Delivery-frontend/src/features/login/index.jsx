import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import UsernameInput from "../../components/userNameInput";
import PasswordInput from "../../components/PasswordInput";
import LoginButton from "../../components/LoginButton";
import LoginError from "../../components/LoginError";
import { loginUser } from "../../services/authService";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
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

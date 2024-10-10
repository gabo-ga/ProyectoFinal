import styles from "./index.module.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getAllUsers } from "../../api/delivery.api";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    const response = await axios.post("http://localhost:8000/api/login/", {
      email,
      password,
    });

    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_irem", response.data.refresh);
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.access}`;
  };

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
                  <Form onSubmit={handleSubmit}>
                    <EmailInput email={email} setEmail={setEmail} />
                    <PasswordInput
                      password={password}
                      setPassword={setPassword}
                    />
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
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
      </div>
    </>
  );
}

function LoginButton() {
  async function handleClick() {
    const res = await getAllUsers();
    console.log(res);
  }
  const navigate = useNavigate();
  return (
    <>
      <div>
        <Button
          className={styles.LoginButton}
          variant="warning"
          type="submit"
          onClick={() => navigate("/dashboard")}
        >
          INICIAR SESIÓN
        </Button>
      </div>
    </>
  );
}

export default LoginCard;

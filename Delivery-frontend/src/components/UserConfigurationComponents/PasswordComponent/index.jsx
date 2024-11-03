import { Form } from "react-bootstrap";
import React from "react";

function PasswordInput() {
  return (
    <Form.Group>
      <Form.Label>Contraseña</Form.Label>
      <Form.Control placeholder="contrasena" disabled></Form.Control>
    </Form.Group>
  );
}
export default PasswordInput;

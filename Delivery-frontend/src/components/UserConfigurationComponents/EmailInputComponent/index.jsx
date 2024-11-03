import { Form } from "react-bootstrap";
import React from "react";

function EmailInput() {
  return (
    <Form.Group>
      <Form.Label>Correo electronico</Form.Label>
      <Form.Control placeholder="corre@gmail.com" disabled></Form.Control>
    </Form.Group>
  );
}

export default EmailInput;

// EmailInput.js
import { Form } from "react-bootstrap";
import React from "react";

function EmailInput({ value }) {
  return (
    <Form.Group>
      <Form.Label>Correo electrónico</Form.Label>
      <Form.Control
        type="email"
        value={value}
        placeholder="correo@gmail.com"
        disabled
        readOnly
      />
    </Form.Group>
  );
}

export default EmailInput;

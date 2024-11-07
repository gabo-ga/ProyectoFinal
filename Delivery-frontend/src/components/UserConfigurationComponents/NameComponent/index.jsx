import { Form } from "react-bootstrap";
import React from "react";

function NameComponent({ value }) {
  return (
    <Form.Group>
      <Form.Label>Nombre Completo</Form.Label>
      <Form.Control
        type="text"
        value={value}
        placeholder="Gabriel Gonzales"
        disabled
        readOnly
      />
    </Form.Group>
  );
}

export default NameComponent;

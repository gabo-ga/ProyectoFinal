import React from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";

const DateFormComponent = ({ value, onChange, name }) => {
  return (
    <Form.Group controlId="formDeliveryDate">
      <Form.Label>Fecha de Entrega</Form.Label>
      <Form.Control
        type="date"
        value={value}
        onChange={onChange}
        name={name}
        required
      />
    </Form.Group>
  );
};

export default DateFormComponent;

import React from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";

const TimeFormComponent = ({ value, onChange, name }) => {
  return (
    <Form.Group controlId="formDeliveryTime">
      <Form.Label>Hora de Entrega</Form.Label>
      <Form.Control
        type="time"
        value={value}
        onChange={onChange}
        name={name}
        required
      />
    </Form.Group>
  );
};

export default TimeFormComponent;

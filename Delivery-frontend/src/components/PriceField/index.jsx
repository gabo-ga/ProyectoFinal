import React, { useState } from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";

const PriceField = ({ value, onChange }) => {
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
      onChange(e);
    }
    if (
      inputValue !== "" &&
      (parseFloat(inputValue) <= 0 || isNaN(inputValue))
    ) {
      setError("El precio debe ser un número positivo mayor que 0.");
    } else {
      setError("");
    }
  };

  return (
    <Form.Group controlId="formPrice">
      <Form.Label>PRECIO:</Form.Label>
      <Form.Control
        type="text"
        value={value}
        onChange={handleInputChange}
        name="precio"
        required
      />
      {error && <Form.Text className="text-danger">{error}</Form.Text>}
    </Form.Group>
  );
};

PriceField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PriceField;

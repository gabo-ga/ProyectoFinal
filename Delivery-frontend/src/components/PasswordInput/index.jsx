import React from "react";
import { Form } from "react-bootstrap";
import styles from "./index.module.css";

function PasswordInput({ value, onChange }) {
  return (
    <Form.Group controlId="password" className="mb-3">
      <Form.Label className={styles.LabelStyle}>Contraseña</Form.Label>
      <Form.Control
        className={styles.InputStyle}
        type="password"
        placeholder="Ingrese su contraseña"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Form.Group>
  );
}

export default PasswordInput;

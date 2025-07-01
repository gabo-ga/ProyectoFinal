import React from "react";
import { Form } from "react-bootstrap";
import styles from "./index.module.css";

function UsernameInput({ value, onChange }) {
  return (
    <Form.Group controlId="username" className="mb-3">
      <Form.Label className={styles.LabelStyle}>Nombre de usuario</Form.Label>
      <Form.Control
        className={styles.InputStyle}
        type="text"
        placeholder="Ingrese su nombre de usuario"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="username"
      />
    </Form.Group>
  );
}

export default UsernameInput;

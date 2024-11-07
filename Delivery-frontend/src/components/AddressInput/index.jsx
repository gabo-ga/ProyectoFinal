// src/components/SearchInput.jsx
import React from "react";
import styles from "./index.module.css";

// Función declarada para el componente SearchInput
function SearchInput({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Buscar dirección..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.inputStyles}
    />
  );
}

export default SearchInput;

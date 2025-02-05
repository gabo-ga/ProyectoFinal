import React from "react";
import styles from "./index.module.css";

function SearchInput({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Buscar dirección..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.inputStyles}
      required
    />
  );
}

export default SearchInput;

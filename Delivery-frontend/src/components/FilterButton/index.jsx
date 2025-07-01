import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { Filter } from "react-bootstrap-icons";
import styles from "./button.module.css";
import FilterForm from "../../features/FilterForm";

function FilterButton() {
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleAbrirModal = () => setMostrarModal(true);
  const handleCerrarModal = () => setMostrarModal(false);

  return (
    <>
      <Button
        variant="warning"
        className={styles.buttonContainer}
        onClick={handleAbrirModal}
      >
        <Filter></Filter>
      </Button>
      <FilterForm show={mostrarModal} onHide={handleCerrarModal} />
    </>
  );
}

export default FilterButton;

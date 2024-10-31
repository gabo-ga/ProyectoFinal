import Button from "react-bootstrap/Button";
import React from "react";

function AcceptButton({ isEditMode, variant = "success", type = "submit" }) {
  return (
    <Button variant={variant} type={type}>
      {isEditMode ? "Actualizar Pedido" : "Añadir Pedido"}
    </Button>
  );
}

export default AcceptButton;

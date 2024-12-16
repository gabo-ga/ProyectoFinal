import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { BoxArrowDown } from "react-bootstrap-icons";
import styles from "./button.module.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function DownloadButton({ data }) {
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.text("Lista de pedidos", 14, 10);

    const tableData = data.map((pedido) => [
      pedido.ID,
      pedido.CLIENTE,
      pedido.ESTADO,
      pedido.DIRECCION_DESTINO,
    ]);

    const tableHeaders = ["ID", "Cliente", "Estado", "Direccion de destino"];

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 20,
    });

    doc.save("Reporte.pdf");
  };

  return (
    <>
      <Button
        variant="warning"
        className={styles.buttonContainer}
        onClick={exportToPDF}
      >
        <BoxArrowDown></BoxArrowDown>
      </Button>
    </>
  );
}

export default DownloadButton;

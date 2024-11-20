import React from "react";
import { render, screen } from "@testing-library/react";
import ButtonsContainer from "./buttons";
import styles from "./buttons.module.css";

describe("ButtonsContainer Component", () => {
  it("renderiza correctamente el contenedor de botones", () => {
    render(<ButtonsContainer />);

    const buttonText = screen.getByText(/Analisis de datos/i);
    expect(buttonText).toBeInTheDocument();

    const container = buttonText.closest(`div`);
    expect(container).toHaveClass(styles.TextStyle);
  });

  it("aplica correctamente las clases CSS al Row", () => {
    render(<ButtonsContainer />);

    // Verifica que el Row tiene la clase correcta
    const rowElement = document.querySelector(`.${styles.ButtonsContainer}`);
    expect(rowElement).toBeInTheDocument();
  });

  it("renderiza correctamente el componente Button dentro del Col", () => {
    render(<ButtonsContainer />);

    // Verifica que el texto del botón se encuentra dentro del Col
    const buttonText = screen.getByText(/Analisis de datos/i);
    const colElement = buttonText.closest("div");
    expect(colElement).toBeInTheDocument();
  });
});

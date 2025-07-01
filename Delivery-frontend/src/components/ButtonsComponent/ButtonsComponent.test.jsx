import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ButtonsContainer from "./buttons";
import styles from "./buttons.module.css";

describe("ButtonsContainer Component", () => {
  it("renderiza correctamente el contenedor de botones", () => {
    render(
      <MemoryRouter>
        <ButtonsContainer />
      </MemoryRouter>
    );

    const buttonText = screen.getByText(/Análisis de datos/i);
    expect(buttonText).toBeInTheDocument();

    const container = buttonText.closest(`div`);
    expect(container).toHaveClass(styles.TextStyle);
  });

  it("aplica correctamente las clases CSS al Row", () => {
    render(
      <MemoryRouter>
        <ButtonsContainer />
      </MemoryRouter>
    );

    // Verifica que el Row tiene la clase correcta
    const rowElement = document.querySelector(`.${styles.ButtonsContainer}`);
    expect(rowElement).toBeInTheDocument();
  });
});

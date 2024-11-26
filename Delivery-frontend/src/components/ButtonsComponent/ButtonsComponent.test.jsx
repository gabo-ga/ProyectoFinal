{
  /*import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Importar MemoryRouter para manejar rutas
import ButtonsContainer from "./buttons";
import styles from "./buttons.module.css";

describe("ButtonsContainer Component", () => {
  it("renderiza correctamente el contenedor de botones", () => {
    render(
      <MemoryRouter>
        <ButtonsContainer />
      </MemoryRouter>
    );

    const buttonText = screen.getByText(/Analisis de datos/i);
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

  it("renderiza correctamente el Link dentro del Col", () => {
    render(
      <MemoryRouter>
        <ButtonsContainer />
      </MemoryRouter>
    );

    // Verifica que el texto del botón se encuentra dentro del Col
    const buttonText = screen.getByText(/Analisis de datos/i);
    const colElement = buttonText.closest("div");
    expect(colElement).toBeInTheDocument();

    // Verifica que el Link tiene el atributo `href` correcto
    const linkElement = screen.getByRole("link", {
      name: /Analisis de datos/i,
    });
    expect(linkElement).toHaveAttribute("href", "/metrics");
  });
});*/
}

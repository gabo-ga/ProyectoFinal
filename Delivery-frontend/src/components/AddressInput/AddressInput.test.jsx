import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchInput from "./index";
import styles from "./index.module.css";

describe("SearchInput Component", () => {
  it("renderiza correctamente el placeholder", () => {
    render(<SearchInput value="" onChange={() => {}} />);
    expect(
      screen.getByPlaceholderText(/Buscar dirección.../i)
    ).toBeInTheDocument();
  });

  it("muestra el valor inicial correctamente", () => {
    render(<SearchInput value="Inicial" onChange={() => {}} />);
    const input = screen.getByPlaceholderText(/Buscar dirección.../i);
    expect(input).toHaveValue("Inicial");
  });

  it("invoca la función onChange cuando cambia el valor", () => {
    const handleChange = vi.fn();
    render(<SearchInput value="" onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/Buscar dirección.../i);

    fireEvent.change(input, { target: { value: "Nueva dirección" } });
    expect(handleChange).toHaveBeenCalledWith("Nueva dirección");
  });

  it("aplica correctamente la clase CSS personalizada", () => {
    render(<SearchInput value="" onChange={() => {}} />);
    const input = screen.getByPlaceholderText(/Buscar dirección.../i);
    expect(input).toHaveClass(styles.inputStyles);
  });
});

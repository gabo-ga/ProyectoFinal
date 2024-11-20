import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddButton from "./button";
import { useNavigate } from "react-router-dom";
import { vi } from "vitest";
import styles from "./button.module.css";
// Mock de useNavigate
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

describe("AddButton Component", () => {
  it("renderiza correctamente el botón con ícono", () => {
    render(<AddButton redirectTo="/add-item" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveClass("btn-warning");
  });

  it("navega a la ruta especificada al hacer clic", async () => {
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(<AddButton redirectTo="/add-item" />);

    const button = screen.getByRole("button");
    await userEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/add-item");
  });

  it("aplica correctamente la clase personalizada", () => {
    render(<AddButton redirectTo="/add-item" />);
    const button = screen.getByRole("button");

    // Compara contra la clase generada por CSS Modules
    expect(button).toHaveClass(styles.buttonContainer);
  });
});

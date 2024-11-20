import React from "react";
import { render, screen } from "@testing-library/react";
import AcceptButton from ".";

describe("AcceptButton Component", () => {
  it("muestra 'Añadir Pedido' cuando isEditMode es false", () => {
    render(<AcceptButton isEditMode={false} />);
    expect(screen.getByText(/Añadir Pedido/i)).toBeInTheDocument();
  });

  it("muestra 'Actualizar Pedido' cuando isEditMode es true", () => {
    render(<AcceptButton isEditMode={true} />);
    expect(screen.getByText(/Actualizar Pedido/i)).toBeInTheDocument();
  });

  it("usa el variante 'success' por defecto", () => {
    const { container } = render(<AcceptButton isEditMode={false} />);
    const button = container.querySelector("button");
    expect(button).toHaveClass("btn-success");
  });

  it("acepta variantes personalizadas", () => {
    const { container } = render(
      <AcceptButton isEditMode={false} variant="primary" />
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("btn-primary");
  });

  it("usa el tipo 'submit' por defecto", () => {
    const { container } = render(<AcceptButton isEditMode={false} />);
    const button = container.querySelector("button");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("acepta tipos personalizados", () => {
    const { container } = render(
      <AcceptButton isEditMode={false} type="button" />
    );
    const button = container.querySelector("button");
    expect(button).toHaveAttribute("type", "button");
  });
});

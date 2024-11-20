import React from "react";
import { render, screen } from "@testing-library/react";
import ActionBar from "./Actions";

describe("ActionBar Component", () => {
  it("renderiza correctamente los labels proporcionados", () => {
    render(
      <ActionBar
        label1="Acción 1"
        label2="Acción 2"
        label3="Acción 3"
        label4="Acción 4"
        label5="Acción 5"
      />
    );

    expect(screen.getByText(/Acción 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Acción 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Acción 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Acción 4/i)).toBeInTheDocument();
    expect(screen.getByText(/Acción 5/i)).toBeInTheDocument();
  });

  it("no muestra contenido adicional no especificado", () => {
    render(
      <ActionBar
        label1="Label A"
        label2="Label B"
        label3="Label C"
        label4=""
        label5={null}
      />
    );

    expect(screen.getByText(/Label A/i)).toBeInTheDocument();
    expect(screen.getByText(/Label B/i)).toBeInTheDocument();
    expect(screen.getByText(/Label C/i)).toBeInTheDocument();
    expect(screen.queryByText(/Label 4/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Label 5/i)).not.toBeInTheDocument();
  });
});

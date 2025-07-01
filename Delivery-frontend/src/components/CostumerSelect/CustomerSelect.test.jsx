import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CustomerSelect from "./index";
import * as clientesApi from "../../api/apiService";

describe("CustomerSelect Component", () => {
  it("debe mostrar las opciones correctas después de cargar los datos", async () => {
    vi.spyOn(clientesApi, "fetchClientes").mockResolvedValue([
      { id: 1, nombre: "Jose Carlos Fernandez" },
      { id: 2, nombre: "Ana Lopez" },
    ]);

    render(<CustomerSelect value="" onChange={() => {}} name="cliente" />);

    expect(screen.getByText("Seleccione un cliente")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Jose Carlos Fernandez")).toBeInTheDocument();
      expect(screen.getByText("Ana Lopez")).toBeInTheDocument();
    });
  });
});

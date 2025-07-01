import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DriverField from "./index";
import { fetchDriversWithActiveOrders } from "../../api/apiService";

vi.mock("../../api/apiService", () => ({
  fetchDriversWithActiveOrders: vi.fn(),
}));

describe("DriverField Component", () => {
  it("muestra el mensaje de carga mientras se obtienen los conductores", () => {
    fetchDriversWithActiveOrders.mockImplementation(
      () => new Promise(() => {})
    );

    render(<DriverField value="" onChange={() => {}} />);

    expect(screen.getByText("Cargando conductores...")).toBeInTheDocument();
  });

  it("renderiza los conductores correctamente una vez cargados", async () => {
    const mockDrivers = [
      { id: 1, nombre: "Conductor 1" },
      { id: 2, nombre: "Conductor 2" },
    ];
    fetchDriversWithActiveOrders.mockResolvedValue(mockDrivers);

    render(<DriverField value="" onChange={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText("Conductor 1")).toBeInTheDocument();
      expect(screen.getByText("Conductor 2")).toBeInTheDocument();
    });
  });

  it("llama a onChange al seleccionar un conductor", async () => {
    const mockDrivers = [
      { id: 1, nombre: "Conductor 1" },
      { id: 2, nombre: "Conductor 2" },
    ];
    fetchDriversWithActiveOrders.mockResolvedValue(mockDrivers);

    const mockOnChange = vi.fn();
    render(<DriverField value="" onChange={mockOnChange} />);

    await waitFor(() => {
      expect(screen.getByText("Conductor 1")).toBeInTheDocument();
    });

    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "1" } });

    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it("maneja correctamente los errores al obtener los conductores", async () => {
    fetchDriversWithActiveOrders.mockRejectedValue(
      new Error("Error al obtener los conductores")
    );

    render(<DriverField value="" onChange={() => {}} />);

    await waitFor(() => {
      expect(
        screen.queryByText("Cargando conductores...")
      ).not.toBeInTheDocument();
    });

    expect(screen.queryByText("Conductor 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Conductor 2")).not.toBeInTheDocument();
  });
});

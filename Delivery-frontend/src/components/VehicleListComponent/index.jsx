// src/components/Vehicles.js
import React, { useEffect, useState } from "react";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { fetchActiveVehicles, deleteVehicle } from "../../api/vehicleFormService.js";

function Vehicles() {
  const [vehiculos, setVehiculos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerVehiculos = async () => {
      try {
        const data = await fetchActiveVehicles();

        setVehiculos(data);
      } catch (error) {
        console.error("Error al obtener los vehículos:", error);
      }
    };

    obtenerVehiculos();
  }, []);

  const handleEdit = (vehiculo) => {
    // Lógica para editar el vehículo
    navigate(`/edit-vehicles/${vehiculo.id}`);
  };

  const handleDelete = async (vehiculo) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar el vehículo ${vehiculo.placa}?`
      )
    ) {
      try {
        await deleteVehicle(vehiculo.id);
        setVehiculos(vehiculos.filter((v) => v.placa !== vehiculo.placa));
      } catch (error) {
        console.error("Error al eliminar el vehículo:", error);
      }
    }
  };

  return (
    <section className="bg-white rounded-lg flex w-full flex-col">
      {vehiculos.map((vehiculo)  => (
        <div key={vehiculo.id} className="grid grid-cols-3 p-2 md:grid-cols-5 lg:grid-cols-5">
          <div className="hidden md:block lg:block">
            {vehiculo.id}
          </div>
          <div className="text-sm lg:text-base">
            {vehiculo.vehiculo_nombre}
          </div>
          <div className="text-sm lg:text-base">
            {vehiculo.tipo}
          </div>
          <div className="hidden md:block lg:block">
            {vehiculo.placa}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3">
            <PencilSquare
              className="size-7 lg:size-10 cursor-pointer"
              onClick={() => handleEdit(vehiculo)}
            />
            <Trash
              className="size-7 lg:size-10 cursor-pointer"
              onClick={() => handleDelete(vehiculo)}
            />
          </div>
        </div>
      ))}
    
    </section>
  );
}

export default Vehicles;

// src/components/ActiveVehicles.js
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchActiveVehicles } from "../../api/vehicleFormService.js";

function ActiveVehicles(props) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getVehicles = async () => {
      try {
        const data = await fetchActiveVehicles();
        setVehicles(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    getVehicles();
  }, []);

  if (loading) {
    return <p>Cargando vehículos disponibles...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
     <div className="flex h-full w-full flex-col">
                    <h4 className="font-semibold flex items-center">
                      <Link to="/vehicles" className="text-xs text-gray-800 hover:text-gray-600 lg:text-base">
                        {props.title}
                      </Link>
                    </h4>
                <div className="flex-1 overflow-y-hidden overflow-x-auto pb-2">
                  <div className="flex flex-nowrap h-full w-auto gap-4">
                      {vehicles.map((vehicle) => (
                        <div key={vehicle.id} className="flex-none w-auto">
                            <OrderCard
                             vehiculoNombre={vehicle.vehiculo_nombre}
                             tipo={vehicle.tipo}
                             placa={vehicle.placa}
                             conductorNombre={vehicle.conductor.nombre}
                             conductorTelefono={vehicle.conductor.telefono}
                            />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
  );
}

function OrderCard({
  vehiculoNombre,
  tipo,
  placa,
  conductorNombre,
  conductorTelefono,
}) {
  return (
    <Card className="w-48 p-2 lg:w-54">
            <Card.Body className="flex w-auto flex-col p-2 items-start gap-1 break-words overflow-hidden truncate">
              <Card.Text className="text-xs font-semibold leading-normal m-0 lg:text-sm">Vehiculo: {vehiculoNombre}</Card.Text>
              <Card.Text className="text-xs font-semibold leading-normal m-0 truncate break-words lg:text-sm">
                Tipo: {tipo}
              </Card.Text>
              <Card.Text className="text-xs font-semibold leadng-normal m-0 truncate break-words lg:text-sm">
                Placa: {placa}
              </Card.Text>
              <Card.Text className="text-xs font-semibold leading-normal m-0  truncate break-words lg:text-sm">Conductor: {conductorNombre}</Card.Text>
              <Card.Text className="text-xs font-semibold leading-normal m-0 truncate break-words lg:text-sm">Teléfono: {conductorTelefono}</Card.Text>
            </Card.Body>
          </Card>
  );
}

export default ActiveVehicles;

// src/components/ActiveVehicles.js
import React, { useEffect, useState } from "react";
import { Col, Row, Container, Card } from "react-bootstrap";
import styles from "./orders.module.css";
import { Link } from "react-router-dom";
import { fetchActiveVehicles } from "../../api/apiService.js";

function ActiveVehicles(props) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getVehicles = async () => {
      try {
        const data = await fetchActiveVehicles(); // Llama a la función desde apiService
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
                    
                      {vehicles.map((vehicle, index) => (
                        <div key={index} className="flex-none w-auto">
                            <OrderCard
                             vehiculoNombre={vehicle.vehiculo_nombre}
                             tipo={vehicle.vehiculo_tipo}
                             placa={vehicle.vehiculo_placa}
                             conductorNombre={vehicle.conductor_nombre}
                             conductorTelefono={vehicle.conductor_telefono}
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
    <Card className="w-48 p-2 lg:w-52">
            <Card.Body className="flex w-ato flex-col p-2 items-start gap-1 break-words overflow-hidden truncate">
              <Card.Text className="text-xs font-semibold leading-normal m-0">Vehiculo: {vehiculoNombre}</Card.Text>
              <Card.Text className="text-xs font-semibold leading-normal m-0 truncate break-words">
                Tipo: {tipo}
              </Card.Text>
              <Card.Text className="text-xs font-semibold leadng-normal m-0 truncate break-words">
                Placa: {placa}
              </Card.Text>
              <Card.Text className="text-xs font-semibold leading-normal m-0  truncate break-words">Conductor: {conductorNombre}</Card.Text>
              <Card.Text className="text-xs font-semibold leading-normal m-0 truncate break-words">Teléfono: {conductorTelefono}</Card.Text>
            </Card.Body>
          </Card>
  );
}

export default ActiveVehicles;

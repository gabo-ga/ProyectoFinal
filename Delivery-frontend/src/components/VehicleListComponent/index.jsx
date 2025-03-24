// src/components/Vehicles.js
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./index.module.css";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { fetchActiveVehicles, deleteVehiculo } from "../../api/apiService.js";

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
    navigate(`/editar-vehiculo/${vehiculo.placa}`);
  };

  const handleDelete = async (vehiculo) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar el vehículo ${vehiculo.placa}?`
      )
    ) {
      try {
        await deleteVehiculo(vehiculo.placa);
        setVehiculos(vehiculos.filter((v) => v.placa !== vehiculo.placa));
      } catch (error) {
        console.error("Error al eliminar el vehículo:", error);
      }
    }
  };

  return (
    <section className="bg-white rounded-lg flex w-full flex-col">
      {vehiculos.map((vehiculo, index) => (
        <div  className="grid grid-cols-3 p-2 lg:grid-cols-5">
          <Col md={2} className={styles.hideOnXS}>
            {index + 1}
          </Col>
          <Col xs={4} md={3}>
            {vehiculo.vehiculo_nombre}
          </Col>
          <Col xs={3} md={2}>
            {vehiculo.vehiculo_tipo}
          </Col>
          <Col md={2} className={styles.hideOnXS}>
            {vehiculo.placa}
          </Col>
          <Col xs={3} md={2}>
            <PencilSquare
              className={styles.icons}
              onClick={() => handleEdit(vehiculo)}
              style={{ cursor: "pointer", marginRight: "10px" }}
            />
            <Trash
              className={styles.icons}
              onClick={() => handleDelete(vehiculo)}
              style={{ cursor: "pointer" }}
            />
          </Col>
        </div>
      ))}
    
    </section>
  );
}

export default Vehicles;

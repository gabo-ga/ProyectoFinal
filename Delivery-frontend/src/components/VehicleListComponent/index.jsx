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
    <Container fluid className={styles.container}>
      {/* Datos de los vehículos */}
      {vehiculos.map((vehiculo, index) => (
        <Row key={vehiculo.placa} className="w-100">
          <Col md={2} className={styles.hideOnXS}>
            {index + 1} {/* Puedes usar un campo de ID si está disponible */}
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
        </Row>
      ))}
    </Container>
  );
}

export default Vehicles;

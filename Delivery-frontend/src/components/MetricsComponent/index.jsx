import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import styles from "./metrics.module.css";
import axiosInstance from "../../axiosInstance";

function Metrics() {
  return (
    <Container className={styles.MetricsContainer}>
      <MetricsBody />
    </Container>
  );
}

function MetricsBody() {
  const [pedidosEnCurso, setPedidosEnCurso] = useState(0);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState(0);

  useEffect(() => {
    // Función para obtener pedidos en curso
    const fetchPedidosEnCurso = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/pedidos/count/");
        setPedidosEnCurso(response.data.count); // Actualiza el estado con el conteo
      } catch (error) {
        console.error("Error al obtener los pedidos en curso:", error);
      }
    };

    // Función para obtener vehículos disponibles
    const fetchVehiculosDisponibles = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/vehiculos/count/");
        setVehiculosDisponibles(response.data.count); // Actualiza el estado con el conteo
      } catch (error) {
        console.error("Error al obtener los vehículos disponibles:", error);
      }
    };

    fetchPedidosEnCurso();
    fetchVehiculosDisponibles();
  }, []); // Ejecuta ambas llamadas solo una vez al montar el componente

  return (
    <Row>
      <Col xs={12} md={6}>
        <h3 className={styles.TextStyle}>Pedidos en curso: {pedidosEnCurso}</h3>
      </Col>
      <Col xs={12} md={6}>
        <h3 className={styles.TextStyle}>
          Vehículos Disponibles: {vehiculosDisponibles}
        </h3>
      </Col>
    </Row>
  );
}

export default Metrics;

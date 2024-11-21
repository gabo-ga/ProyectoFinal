import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import styles from "./metrics.module.css";
import {
  fetchPedidosEnCurso,
  fetchVehiculosDisponibles,
} from "../../api/apiService";

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
    const fetchData = async () => {
      try {
        const pedidosCount = await fetchPedidosEnCurso();
        setPedidosEnCurso(pedidosCount);

        const vehiculosCount = await fetchVehiculosDisponibles();
        setVehiculosDisponibles(vehiculosCount);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();
  }, []);

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

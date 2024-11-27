import React, { useEffect, useState } from "react";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./index.module.css";

function MetricsPage() {
  const [pedidosTotales, setPedidosTotales] = useState(0);
  const [pedidosEntregados, setPedidosEntregados] = useState(0);
  const [pedidosPendientes, setPedidosPendientes] = useState(0);
  const [tiempoPromedioEntrega, setTiempoPromedioEntrega] = useState(0);
  const [kilometrosRecorridosTotales, setKilometrosRecorridosTotales] =
    useState(0);

  useEffect(() => {
    // Función para obtener los datos del endpoint
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/analisis-pedido"
        );
        const data = await response.json();

        console.log("Datos recibidos del endpoint:", data);

        // Si data es un array, obtenemos el primer elemento
        const record = Array.isArray(data) ? data[0] : data;

        // Actualizar las variables de estado con los datos recibidos
        setPedidosTotales(record.pedidos_totales || 0);
        setPedidosEntregados(record.pedidos_entregados || 0);
        setTiempoPromedioEntrega(record.tiempo_promedio_entrega_minutos || 0);
        setKilometrosRecorridosTotales(
          parseFloat(record.kilometros_recorridos_totales) || 0
        );

        // Calcular pedidos pendientes
        const pendientes =
          (record.pedidos_totales || 0) - (record.pedidos_entregados || 0);
        setPedidosPendientes(pendientes);
      } catch (error) {
        console.error("Error al obtener los datos del endpoint:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <Container fluid className={styles.body}>
        {/* Primera fila de tarjetas */}
        <Row className={styles.row}>
          <Col xs={12} md={4}>
            <Card>
              <Card.Body>
                <Card.Text>Pedidos totales:</Card.Text>
                <Card.Title>{pedidosTotales}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card>
              <Card.Body>
                <Card.Text>Pedidos entregados:</Card.Text>
                <Card.Title>{pedidosEntregados}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card>
              <Card.Body>
                <Card.Text>Pedidos pendientes:</Card.Text>
                <Card.Title>{pedidosPendientes}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Segunda fila de tarjetas */}
        <Row className={styles.row}>
          <Col xs={12} md={6}>
            <Card>
              <Card.Body>
                <Card.Text>Tiempo promedio de entrega (minutos):</Card.Text>
                <Card.Title>{tiempoPromedioEntrega}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card>
              <Card.Body>
                <Card.Text>Kilómetros recorridos totales:</Card.Text>
                <Card.Title>{kilometrosRecorridosTotales}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default MetricsPage;

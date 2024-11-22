import React, { useEffect, useState } from "react";
import {
  fetchPedidosEnCurso,
  fetchPedidosCancelados,
  fetchPedidosEntregados,
} from "../../api/apiService";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./index.module.css";

function MetricsPage() {
  const [pedidosPendientes, setPedidosPendientes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const count = await fetchPedidosEnCurso();
        setPedidosPendientes(count);
      } catch (error) {
        console.error("Error al obtener los pedidos pendientes:", error);
      }
    };

    fetchData();
  }, []);

  const [pedidosCancelados, setPedidosCancelados] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const count = await fetchPedidosCancelados();
        setPedidosCancelados(count);
      } catch (error) {
        console.error("Error al obtener los pedidos cancelados:", error);
      }
    };

    fetchData();
  }, []);

  const [pedidosEntregados, setPedidosEntregados] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const count = await fetchPedidosEntregados(); // Llama al endpoint
        setPedidosEntregados(count); // Actualiza el estado con el conteo
      } catch (error) {
        console.error("Error al obtener los pedidos entregados:", error);
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
                <Card.Text>Pedidos pendientes:</Card.Text>
                <Card.Title>{pedidosPendientes}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card>
              <Card.Body>
                <Card.Text>Pedidos cancelados:</Card.Text>
                <Card.Title>{pedidosCancelados}</Card.Title>
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
        </Row>

        {/* Segunda fila de tarjetas */}
        <Row className={styles.row}>
          <Col xs={12} md={4}>
            <Card>
              <Card.Body>
                <Card.Text>Tiempo promedio de entrega:</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card>
              <Card.Body>
                <Card.Text>Distancia recorrida promedio:</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card>
              <Card.Body>
                <Card.Text>Promedio de precios de pedidos:</Card.Text>
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

import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./orders.module.css";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

function ActiveOrders(props) {
  const [orders, setOrders] = useState([]); // Estado para almacenar los pedidos
  const [loading, setLoading] = useState(true); // Estado para el indicador de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  // Efecto para hacer la solicitud GET cuando el componente se monta
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/pedidos/en-curso/"
        );
        setOrders(response.data); // Asignar la respuesta al estado
        setLoading(false); // Detener el indicador de carga
      } catch (error) {
        setError("Error al cargar los pedidos");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // Ejecutar el efecto solo una vez cuando el componente se monta

  // Mostrar un indicador de carga mientras los datos se están obteniendo
  if (loading) {
    return <p>Cargando pedidos...</p>;
  }

  // Mostrar mensaje de error si ocurre algún problema
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col xs={12}>
            <h4 className={styles.TextStyle}>
              <Link to="/ordershistory" className={styles.TextStyle}>
                {props.title}
              </Link>
            </h4>
          </Col>
        </Row>
        <Row>
          {orders.map((order, index) => (
            <Col key={index}>
              <OrderCard
                cliente={order.cliente_nombre}
                telefono={order.cliente_telefono}
                fecha={order.pedido_fecha}
                estado={order.pedido_estado}
                destino={order.pedido_direccion_destino}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

function OrderCard({ cliente, telefono, fecha, estado, destino }) {
  return (
    <Card className={styles.CardStyle}>
      <Card.Body className={styles.textContainer}>
        <Card.Text className={styles.TextStyle}>Cliente: {cliente}</Card.Text>
        <Card.Text className={styles.TextStyle}>Teléfono: {telefono}</Card.Text>
        <Card.Text className={styles.TextStyle}>
          Fecha del pedido: {fecha}
        </Card.Text>
        <Card.Text className={styles.TextStyle}>Estado: {estado}</Card.Text>
        <Card.Text className={styles.TextStyle}>Destino: {destino}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default ActiveOrders;

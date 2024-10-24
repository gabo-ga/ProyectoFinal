import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./orders.module.css";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

function ActiveOrders(props) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  if (loading) {
    return <p>Cargando pedidos...</p>;
  }

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
          <div className={styles.scrollWrapper}>
            <div className={styles.scrollContainer}>
              {orders.map((order, index) => (
                <Col xs={12} md={5} key={index}>
                  <OrderCard
                    cliente={order.cliente_nombre}
                    telefono={order.cliente_telefono}
                    fecha={order.pedido_fecha}
                    estado={order.pedido_estado}
                    destino={order.pedido_direccion_destino}
                  />
                </Col>
              ))}
            </div>
          </div>
        </Row>
      </Container>
    </>
  );
}

function OrderCard({ cliente, telefono, fecha, estado, destino }) {
  return (
    <div className={styles.scrollItem}>
      <Card className={styles.CardStyle}>
        <Card.Body className={styles.textContainer}>
          <Card.Text className={styles.TextStyle}>Cliente: {cliente}</Card.Text>
          <Card.Text className={styles.TextStyle}>
            Teléfono: {telefono}
          </Card.Text>
          <Card.Text className={styles.TextStyle}>
            Fecha del pedido: {fecha}
          </Card.Text>
          <Card.Text className={styles.TextStyle}>Estado: {estado}</Card.Text>
          <Card.Text className={styles.TextStyle}>Destino: {destino}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ActiveOrders;

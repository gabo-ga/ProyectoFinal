import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import styles from "./orders.module.css";
import { Link } from "react-router-dom";
import { fetchCompletedOrders } from "../../api/apiService";

function CompletedOrders(props) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCompletedOrders = async () => {
      try {
        const data = await fetchCompletedOrders();
        setOrders(data);
        setLoading(false);
      } catch (error) {
        setError("Error al cargar los pedidos completados");
        setLoading(false);
      }
    };

    loadCompletedOrders();
  }, []);

  if (loading) return <p>Cargando pedidos completados...</p>;
  if (error) return <p>{error}</p>;

  return (
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
      <div className={styles.scrollWrapper}>
        <div className={styles.scrollContainer}>
          {orders.map((order, index) => (
            <Col xs={12} md={7} lg={4} key={index}>
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
    </Container>
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

export default CompletedOrders;

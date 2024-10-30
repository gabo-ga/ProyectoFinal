import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./index.module.css";
import { PencilSquare, Trash } from "react-bootstrap-icons";

function Order() {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/pedidos/detalle-pedidos/")
      .then((response) => response.json())
      .then((data) => {
        setPedidos(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los pedidos:", error);
        setError(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error al cargar los pedidos.</div>;
  }

  return (
    <Container fluid className={styles.container}>
      {pedidos.map((pedido) => (
        <Row key={pedido.ID} className="w-100">
          <Col md={2} className={styles.hideOnXS}>
            {pedido.ID}
          </Col>
          <Col xs={4} md={2}>
            {pedido.CLIENTE}
          </Col>
          <Col xs={3} md={2}>
            {pedido.ESTADO}
          </Col>
          <Col xs={2} md={2}>
            {pedido.HORA_ESTIMADA}
          </Col>
          <Col md={2} className={styles.hideOnXS}>
            {pedido.DIRECCION_DESTINO}
          </Col>
          <Col xs={3} md={2}>
            <PencilSquare className={styles.icons} />
            <Trash className={styles.icons} />
          </Col>
        </Row>
      ))}
    </Container>
  );
}

export default Order;

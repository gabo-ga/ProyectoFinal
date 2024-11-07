// src/components/Order.js
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./index.module.css";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { fetchPedidos, deletePedido } from "../../api/apiService.js";

function Order() {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      const data = await fetchPedidos();
      setPedidos(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error.message);
      setError(error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este pedido?")) {
      try {
        const success = await deletePedido(id);
        if (success) {
          alert("Pedido eliminado con éxito");
          loadPedidos(); // Actualizar la lista de pedidos
        } else {
          alert("Error al eliminar el pedido");
        }
      } catch (error) {
        console.error(error.message);
        alert("Error de red");
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/editOrder/${id}`);
  };

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
            <PencilSquare
              className={styles.icons}
              onClick={() => handleEdit(pedido.ID)}
            />
            <Trash
              className={styles.icons}
              onClick={() => handleDelete(pedido.ID)}
            />
          </Col>
        </Row>
      ))}
    </Container>
  );
}

export default Order;

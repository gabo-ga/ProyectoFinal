import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {
  fetchOrderDetailsById,
  updateOrderStatusById,
} from "../../api/apiService";

function OrderDetails() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const orderDetails = await fetchOrderDetailsById(id); // Llama a la función de apiService
        setPedido(orderDetails);
      } catch (err) {
        setError(err.message || "Error al cargar los detalles del pedido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const updateOrderStatus = async (nuevoEstado) => {
    try {
      const updatedPedido = await updateOrderStatusById(id, nuevoEstado); // Llama a la función de apiService
      setPedido((prevPedido) => ({
        ...prevPedido,
        pedido_estado: nuevoEstado,
      }));
      return true;
    } catch (error) {
      setError("Error al actualizar el estado del pedido");
      return false;
    }
  };
  const handleComplete = async () => {
    const success = await updateOrderStatus("entregado");
    if (success) {
      alert("Pedido completado");
      navigate("/dashboard");
    }
  };

  const handleCancel = async () => {
    const success = await updateOrderStatus("cancelado");
    if (success) {
      alert("Pedido cancelado");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  const formattedDate = new Date(pedido.pedido_fecha).toLocaleString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div>
      <Header />
      <div className="container my-4">
        <Card>
          <Card.Body>
            <Card.Text>
              <strong>Pedido:</strong> {pedido.pedido_id}
            </Card.Text>
            <Card.Text>
              <strong>Cliente:</strong> {pedido.cliente_nombre}
            </Card.Text>
            <Card.Text>
              <strong>Teléfono:</strong> {pedido.cliente_telefono}
            </Card.Text>
            <Card.Text>
              <strong>Destino:</strong> {pedido.pedido_direccion_destino}
            </Card.Text>
            <Card.Text>
              <strong>Hora de Creación:</strong> {formattedDate}
            </Card.Text>
            <Card.Text>
              <strong>Estado:</strong> {pedido.pedido_estado}
            </Card.Text>
            <Button variant="primary" className="me-2" onClick={handleComplete}>
              Terminar
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
          </Card.Body>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

export default OrderDetails;

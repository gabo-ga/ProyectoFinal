import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { fetchActiveOrders } from "../../api/apiService";

function OrderDetails() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orders = await fetchActiveOrders();
        const selectedOrder = orders.find(
          (order) => order.pedido_id === parseInt(id)
        );
        if (selectedOrder) {
          setPedido(selectedOrder);
        } else {
          setError("Pedido no encontrado");
        }
      } catch (error) {
        setError("Error al cargar los detalles del pedido");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  // Formatear la fecha de creación
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
            {/* Agrega otros detalles según sea necesario */}
            <Button variant="primary">Terminar</Button>
          </Card.Body>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

export default OrderDetails;

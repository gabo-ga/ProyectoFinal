import React, { useEffect, useState } from "react";
import {  Card } from "react-bootstrap";
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
    <div className="flex h-full w-full flex-col">
                <h4 className="font-semibold flex items-center">
                  <Link to="/ordershistory" className="text-xs text-gray-800 hover:text-gray-600 lg:text-base">
                    {props.title}
                  </Link>
                </h4>
            <div className="flex-1 overflow-y-hidden overflow-x-auto pb-2">
              <div className="flex flex-nowrap h-full w-auto gap-4">
                
                  {orders.map((order) => (
                    <div key={order.pedido_id} className="flex-none w-auto">
                      <Link
                        to={`/orderdetails/${order.pedido_id}`}
                        className="block text-decoration-none"
                      >
                        <OrderCard
                          cliente={order.cliente_nombre}
                          telefono={order.cliente_telefono}
                          fecha={order.pedido_fecha}
                          estado={order.pedido_estado}
                          destino={order.pedido_direccion_destino}
                        />
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </div>
  );
}

function OrderCard({ cliente, telefono, fecha, estado, destino }) {
  return (
     <Card className="w-48 p-2 lg:w-54">
            <Card.Body className="flex w-ato flex-col p-2 items-start gap-1 break-words overflow-hidden truncate">
              <Card.Text className="text-xs font-semibold leading-normal m-0 lg:text-sm">Cliente: {cliente}</Card.Text>
              <Card.Text className="text-xs font-semibold leading-normal m-0 truncate break-words lg:text-sm">
                Teléfono: {telefono}
              </Card.Text>
              <Card.Text className="text-xs font-semibold leadng-normal m-0 truncate break-words lg:text-sm">
                Fecha del pedido: {fecha}
              </Card.Text>
              <Card.Text className="text-xs font-semibold leading-normal m-0  truncate break-words lg:text-sm">Estado: {estado}</Card.Text>
              <Card.Text className="text-xs font-semibold leading-normal m-0 truncate break-words lg:text-sm">Destino: {destino}</Card.Text>
            </Card.Body>
          </Card>
  );
}

export default CompletedOrders;

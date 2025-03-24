import React, { useEffect, useState } from "react";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { fetchPedidos, deletePedido } from "../../api/apiService.js";
import { useFilter } from "../../contexts/FilterContext"; // Importa el contexto

function Order({ onPedidosLoad }) {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { filters } = useFilter(); // Consumir filtros desde el contexto

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      const data = await fetchPedidos();
      setPedidos(data);
      setIsLoading(false);

      if (onPedidosLoad) {
        onPedidosLoad(data);
      }
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
          loadPedidos();
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

  // Filtrar pedidos según los valores en `filters`
  const pedidosFiltrados = pedidos.filter((pedido) => {
    const clienteCoincide =
      !filters.cliente || pedido.CLIENTE === filters.cliente;
    const estadoCoincide =
      !filters.estado || pedido.ESTADO.toLowerCase() === filters.estado;

    return clienteCoincide && estadoCoincide;
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error al cargar los pedidos.</div>;
  }

  return (
    <section className="bg-white rounded-lg flex w-full flex-col">
      {pedidosFiltrados.map((pedido) => (
        <div key={pedido.ID} className="grid grid-cols-3 p-2 lg:grid-cols-5">
          <div className="hidden md:block lg:block">
            {pedido.ID}
          </div>
          <div className="text-sm lg:text-base">
            {pedido.CLIENTE}
          </div>
          <div className="text-sm lg:text-base">
            {pedido.ESTADO}
          </div>
          <div className="hidden md:block lg:block">
            {pedido.DIRECCION_DESTINO}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3">
            <PencilSquare
              className="size-7 lg:size-10"
              onClick={() => handleEdit(pedido.ID)}
            />
            <Trash
              className="size-7 lg:size-10"
              onClick={() => handleDelete(pedido.ID)}
            />
          </div>
        </div>
      ))}
    </section>
  );
}

export default Order;

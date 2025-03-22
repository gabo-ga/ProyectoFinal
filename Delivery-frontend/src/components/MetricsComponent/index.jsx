import React, { useEffect, useState } from "react";
import {
  fetchPedidosEnCurso,
  fetchVehiculosDisponibles,
} from "../../api/apiService";

function Metrics() {
  const [pedidosEnCurso, setPedidosEnCurso] = useState(0);
  const [pedidosCompletados, setPedidosCompletados] = useState(0);
  const [pedidosCancelados, setPedidosCancelados] = useState(0);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pedidosCount = await fetchPedidosEnCurso();
        setPedidosEnCurso(pedidosCount);
        const pedidosEntregados = await fetchPedidosEnCurso(2);
        setPedidosCompletados(pedidosEntregados);
        const pedidosCancelados = await fetchPedidosEnCurso(3);
        setPedidosCancelados(pedidosCancelados);

        const vehiculosCount = await fetchVehiculosDisponibles();
        setVehiculosDisponibles(vehiculosCount);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <section className="h-auto w-full rounded-lg bg-white p-2">
      <div className="grid grid-cols-2 gap-1">
        <p className="text-xs font-semibold break-words m-0 lg:text-sm">
          Pedidos en curso: {pedidosEnCurso}</p>
        <p className="text-xs font-semibold break-words m-0 lg:text-sm">
          Vehículos Disponibles: {vehiculosDisponibles}
        </p>
        <p className="text-xs font-semibold break-words m-0 lg:text-sm">
          Pedidos completados: {pedidosCompletados}
        </p>
        <p className="text-xs font-semibold break-words m-0 lg:text-sm">
          Pedidos cancelados: {pedidosCancelados}
        </p>
      </div>
    </section>
  );
}


export default Metrics;

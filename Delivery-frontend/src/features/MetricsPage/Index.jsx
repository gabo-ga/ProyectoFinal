import React, { useEffect, useState } from "react";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import Card from "react-bootstrap/Card";
import styles from "./index.module.css";
import { DateRangePicker } from 'react-date-range';
import { fetchAnalisisPedidosPorFecha } from "../../api/apiService";
import BarChart from "../../components/BarChart";

function MetricsPage() {
  const [pedidosTotales, setPedidosTotales] = useState(0);
  const [pedidosEntregados, setPedidosEntregados] = useState(0);
  const [tiempoPromedioEntrega, setTiempoPromedioEntrega] = useState(0);
  const [kilometrosRecorridosTotales, setKilometrosRecorridosTotales] = useState(0);
  const [pedidosCancelados, setPedidosCancelados] = useState(0);

  const [chartData, setChartData] = useState([]);
  
  const [range, setRange] = useState([
    {
      startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Format dates correctly for API
        const formatDate = (date) => {
          const d = new Date(date);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        };

        const data = await fetchAnalisisPedidosPorFecha({
          fechaInicio: formatDate(range[0].startDate),
          fechaFin: formatDate(range[0].endDate)
        });
        console.log("Datos obtenidos:", data);

        setPedidosTotales(data.pedidos_totales || 0);
        setPedidosEntregados(data.pedidos_entregados || 0);
        setTiempoPromedioEntrega(data.tiempo_promedio_entrega_minutos || 0);
        setKilometrosRecorridosTotales(
          Number((parseFloat(data.distancia_total_km) || 0).toFixed(2))
        );
        setPedidosCancelados(data.pedidos_cancelados || 0);

        const apiData =[
          {month: "totales", pedidos: data.pedidos_totales},
          {month: "entregados", pedidos: data.pedidos_entregados},
          {month: "cancelados", pedidos: data.pedidos_cancelados},
        ];
        setChartData(apiData);

      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, [range]);

  const handleRangeChange = (item) => {
    setRange([item.selection]);
  };

  return (
    <>
      <Header />
      <main className="bg-[#ecf0f1] h-auto p-8 gap-2 flex flex-col items-start lg:flex-row lg:h-98">
          <div className="w-full grid lg:w-auto lg:grid-rows-2">
            <DateRangePicker
              onChange={handleRangeChange}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={1}
              ranges={range}
              direction="vertical"
            />
          </div>
          <div className="w-full h-98 lg:w-auto">
            <BarChart data={chartData}/>
          </div>
          <div className="h-86 grid grid-rows-3 grid-cols-2 gap-2 lg:grid-rows-6 lg:grid-cols-1 lg:h-98">
            <Card className="text-sm lg:text-base">
              <Card.Body className="flex flex-col lg:flex-row lg:gap-1 lg:align-baseline">
                <Card.Text className="m-1 lg:m-0 lg:flex lg:items-center">Pedidos totales:</Card.Text>
                <Card.Title className="m-1 lg:m-0 lg:items-center">{pedidosTotales}</Card.Title>
              </Card.Body>
            </Card>
            <Card className="text-sm">
              <Card.Body className="flex flex-col lg:flex-row lg: gap-2">
                <Card.Text className="m-0">Pedidos entregados:</Card.Text>
                <Card.Title>{pedidosEntregados}</Card.Title>
              </Card.Body>
            </Card>
            <Card className="text-sm">
              <Card.Body className="flex flex-col lg:flex-row lg: gap-2">
                <Card.Text className="m-0">Promedio de precio:</Card.Text>
                <Card.Title>{pedidosEntregados}</Card.Title>
              </Card.Body>
            </Card>

          <Card className="text-sm">
              <Card.Body className="flex flex-col lg:flex-row lg: gap-2">
                <Card.Text className="m-0">Pedidos cancelados:</Card.Text>
                <Card.Title>{pedidosCancelados}</Card.Title>
              </Card.Body>
            </Card>
            <Card className="text-sm">
              <Card.Body className="flex flex-col lg:flex-row lg: gap-2">
                <Card.Text className="m-0">Tiempo promedio de entrega (horas):</Card.Text>
                <Card.Title>{tiempoPromedioEntrega/60}</Card.Title>
              </Card.Body>
            </Card>
            <Card className="text-sm">
              <Card.Body className="flex flex-col lg:flex-row lg: gap-2">
                <Card.Text className="m-0">Kilómetros recorridos totales:</Card.Text>
                <Card.Title>{kilometrosRecorridosTotales}</Card.Title>
              </Card.Body>
            </Card>
            </div>
      </main>
      <Footer />
    </>
  );
}

export default MetricsPage;

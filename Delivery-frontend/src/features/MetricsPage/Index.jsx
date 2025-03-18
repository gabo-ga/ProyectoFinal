import React, { useEffect, useState } from "react";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./index.module.css";
import { DateRangePicker } from 'react-date-range';
import { fetchAnalisisPedidosPorFecha } from "../../api/apiService";

function MetricsPage() {
  const [pedidosTotales, setPedidosTotales] = useState(0);
  const [pedidosEntregados, setPedidosEntregados] = useState(0);
  const [tiempoPromedioEntrega, setTiempoPromedioEntrega] = useState(0);
  const [kilometrosRecorridosTotales, setKilometrosRecorridosTotales] = useState(0);
  const [pedidosCancelados, setPedidosCancelados] = useState(0);
  
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

        setPedidosTotales(data.pedidos_totales || 0);
        setPedidosEntregados(data.pedidos_entregados || 0);
        setTiempoPromedioEntrega(data.tiempo_promedio_entrega_minutos || 0);
        setKilometrosRecorridosTotales(
          parseFloat(data.kilometros_recorridos_totales) || 0
        );
        setPedidosCancelados(data.pedidos_cancelados || 0);

      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, [range]); // Add range as dependency

  const handleRangeChange = (item) => {
    setRange([item.selection]);
  };

  return (
    <>
      <Header />
      <Container fluid className={styles.body}>
        <Row className={styles.row}>
          <Col xs={12} md={4} lg={5}>
            <DateRangePicker
              onChange={handleRangeChange}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={1}
              ranges={range}
              direction="vertical"
            />
          </Col>
          <Col xs={12} md={4} lg={3} className={styles.metricsStyle}>
            <Card>
              <Card.Body>
                <Card.Text>Pedidos totales:</Card.Text>
                <Card.Title>{pedidosTotales}</Card.Title>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Card.Text>Pedidos entregados:</Card.Text>
                <Card.Title>{pedidosEntregados}</Card.Title>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Card.Text>Promedio de precio:</Card.Text>
                <Card.Title>{pedidosEntregados}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4} lg={4} className={styles.metricsStyle}>
          <Card>
              <Card.Body>
                <Card.Text>Pedidos cancelados:</Card.Text>
                <Card.Title>{pedidosCancelados}</Card.Title>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Card.Text>Tiempo promedio de entrega (minutos):</Card.Text>
                <Card.Title>{tiempoPromedioEntrega}</Card.Title>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Card.Text>Kilómetros recorridos totales:</Card.Text>
                <Card.Title>{kilometrosRecorridosTotales}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {/*<Footer />*/}
    </>
  );
}

export default MetricsPage;

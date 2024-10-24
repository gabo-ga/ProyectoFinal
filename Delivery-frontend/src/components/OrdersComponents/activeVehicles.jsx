import React, { useEffect, useState } from "react";
import { Col, Row, Container, Card } from "react-bootstrap";
import styles from "./orders.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

function ActiveVehicles(props) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/vehiculos/vehiculos-disponibles/"
        );
        setVehicles(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error al cargar los vehículos disponibles");
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return <p>Cargando vehículos disponibles...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
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
        <Row>
          <div className={styles.scrollWrapper}>
            <div className={styles.scrollContainer}>
              {vehicles.map((vehicle, index) => (
                <Col key={index}>
                  <OrderCard
                    vehiculoNombre={vehicle.vehiculo_nombre}
                    tipo={vehicle.vehiculo_tipo}
                    placa={vehicle.placa}
                    conductorNombre={vehicle.conductor_nombre}
                    conductorTelefono={vehicle.conductor_telefono}
                  />
                </Col>
              ))}
            </div>
          </div>
        </Row>
      </Container>
    </>
  );
}

function OrderCard({
  vehiculoNombre,
  tipo,
  placa,
  conductorNombre,
  conductorTelefono,
}) {
  return (
    <div className={styles.scrollItem}>
      <Card className={styles.CardStyle}>
        <Card.Body className={styles.textContainer}>
          <Card.Text className={styles.TextStyle}>
            Vehículo: {vehiculoNombre}
          </Card.Text>
          <Card.Text className={styles.TextStyle}>Tipo: {tipo}</Card.Text>
          <Card.Text className={styles.TextStyle}>Placa: {placa}</Card.Text>
          <Card.Text className={styles.TextStyle}>
            Conductor: {conductorNombre}
          </Card.Text>
          <Card.Text className={styles.TextStyle}>
            Teléfono: {conductorTelefono}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ActiveVehicles;

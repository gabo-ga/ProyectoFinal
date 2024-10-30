import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { Card, Col, Container, Row } from "react-bootstrap";
import styles from "./index.module.css";
import { Form } from "react-bootstrap";
import CancelButton from "../../components/CancelButton";
import AcceptButton from "../../components/AcceptButton";
import AddressSearch from "../../components/AddressSearch";
import CustomerSelect from "../../components/CostumerSelect";
import DateFormComponent from "../../components/DateFormComponent";
import TimeFormComponent from "../../components/TimeFormComponent";
import { useState, useEffect } from "react";

function addOrder() {
  const [formData, setFormData] = useState({
    direccion_origen: "",
    coordenadas_origen_lat: null,
    coordenadas_origen_lng: null,
    direccion_destino: "",
    coordenadas_destino_lat: null,
    coordenadas_destino_lng: null,
    customer: "",
    estado: "pendiente",
    price: "",
    date: "",
    time: "",
    description: "",
  });

  useEffect(() => {
    console.log("formData ha cambiado:", formData);
  }, [formData]);

  const handleOrigenSelect = (place) => {
    setFormData((prevData) => ({
      ...prevData,
      direccion_origen: place.address,
      coordenadas_origen_lat: place.lat,
      coordenadas_origen_lng: place.lng,
    }));
  };

  const handleDestinoSelect = (place) => {
    setFormData((prevData) => ({
      ...prevData,
      direccion_destino: place.address,
      coordenadas_destino_lat: place.lat,
      coordenadas_destino_lng: place.lng,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      // Puedes combinar las coordenadas en un solo objeto si lo prefieres
      coordenadas_origen: {
        lat: formData.coordenadas_origen_lat,
        lng: formData.coordenadas_origen_lng,
      },
      coordenadas_destino: {
        lat: formData.coordenadas_destino_lat,
        lng: formData.coordenadas_destino_lng,
      },
    };

    try {
      const response = await fetch("http://localhost:8000/api/v1/pedidos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Pedido añadido con éxito");
        // Aquí puedes limpiar el formulario o redirigir al usuario
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert("Error al añadir el pedido");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de red");
    }
  };

  return (
    <>
      <Header />
      <Container fluid className={styles.body}>
        <Row className={styles.rowContainer}>
          <h4>Añadir pedido</h4>
        </Row>
        <Row className={styles.rowContainer}>
          <Card className={styles.cardContainer}>
            <Form className={styles.formContainer} onSubmit={handleSubmit}>
              <Col xs={12} md={8}>
                <Form.Group controlId="formOrigin">
                  <Form.Label>DIRECCIÓN DE ORIGEN:</Form.Label>
                  <AddressSearch onPlaceSelected={handleOrigenSelect} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group controlId="fromDestiny">
                  <Form.Label>DIRECCIÓN DESTINO:</Form.Label>
                  <AddressSearch onPlaceSelected={handleDestinoSelect} />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <CustomerSelect
                  value={formData.customer}
                  onChange={handleInputChange}
                  name="customer"
                />
              </Col>
              <Col xs={12} md={8}>
                <Row>
                  <Col xs={12} md={3}>
                    <Form.Group controlId="formPrice">
                      <Form.Label>PRECIO:</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.price}
                        onChange={handleInputChange}
                        name="price"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={9}>
                    <Form.Group className={styles.datetimeContainer}>
                      <DateFormComponent
                        value={formData.date}
                        onChange={handleInputChange}
                        name="date"
                      />
                      <TimeFormComponent
                        value={formData.time}
                        onChange={handleInputChange}
                        name="time"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group>
                  <Form.Label>DESCRIPCIÓN:</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={formData.description}
                    onChange={handleInputChange}
                    name="description"
                    rows={3}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Form.Group className={styles.buttonsContainer}>
                <CancelButton type="submit"></CancelButton>
                <AcceptButton></AcceptButton>
              </Form.Group>
            </Form>
          </Card>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default addOrder;

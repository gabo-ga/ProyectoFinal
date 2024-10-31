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
import { useNavigate, useParams } from "react-router-dom";

function OrderForm() {
  const [formData, setFormData] = useState({
    direccion_origen: "",
    coordenadas_origen_lat: null,
    coordenadas_origen_lng: null,
    direccion_destino: "",
    coordenadas_destino_lat: null,
    coordenadas_destino_lng: null,
    cliente: "",
    estado: "pendiente",
    precio: "",
    date: "",
    time: "",
    detalle: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  /* useEffect(() => {
    console.log("formData ha cambiado:", formData);
  }, [formData]); */

  const handleOrigenSelect = (place) => {
    setFormData((prevData) => ({
      ...prevData,
      direccion_origen: place.address,
      coordenadas_origen_lat: place.lat,
      coordenadas_origen_lng: place.lng,
    }));
  };

  const handleOriginPlaceSelected = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      direccion_origen: data.address,
      coordenadas_origen_lat: data.lat,
      coordenadas_origen_lng: data.lng,
    }));
  };

  const handleDestinationPlaceSelected = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      direccion_destino: data.address,
      coordenadas_destino_lat: data.lat,
      coordenadas_destino_lng: data.lng,
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

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      // Obtener los datos del pedido para prellenar el formulario
      fetch(`http://localhost:8000/api/v1/pedidos/${id}/`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Datos del pedido:", data);
          // Mapear los datos al estado formData
          setFormData({
            direccion_origen: data.direccion_origen || "",
            coordenadas_origen_lat: data.coordenadas_origen?.lat || "",
            coordenadas_origen_lng: data.coordenadas_origen?.lng || "",
            direccion_destino: data.direccion_destino || "",
            coordenadas_destino_lat: data.coordenadas_destino?.lat || "",
            coordenadas_destino_lng: data.coordenadas_destino?.lng || "",
            customer: data.cliente || "", // Asegúrate de que este campo existe en data
            estado: data.estado || "",
            price: data.precio || "",
            date: data.fecha_entrega ? data.fecha_entrega.split("T")[0] : "",
            time: data.fecha_entrega
              ? data.fecha_entrega.split("T")[1].substring(0, 5)
              : "",
            description: data.detalle || "",
          });
        })
        .catch((error) => {
          console.error("Error al obtener el pedido:", error);
        });
    }
  }, [id]);

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

    const url = isEditMode
      ? `http://localhost:8000/api/v1/pedidos/${id}/`
      : "http://localhost:8000/api/v1/pedidos/";
    const method = isEditMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert(
          isEditMode
            ? "Pedido actualizado con éxito"
            : "Pedido añadido con éxito"
        );
        navigate("/");
      } else {
        alert("Error al enviar el formulario");
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
              <Col xs={12} md={10}>
                <Form.Group controlId="formOrigin">
                  <Form.Label>DIRECCIÓN DE ORIGEN:</Form.Label>
                  <AddressSearch
                    onPlaceSelected={handleOrigenSelect}
                    initialAddress={formData.direccion_origen}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={10}>
                <Form.Group controlId="fromDestiny">
                  <Form.Label>DIRECCIÓN DESTINO:</Form.Label>
                  <AddressSearch
                    onPlaceSelected={handleDestinoSelect}
                    initialAddress={formData.direccion_destino}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={10}>
                <CustomerSelect
                  value={formData.customer}
                  onChange={handleInputChange}
                  name="cliente"
                />
              </Col>
              <Col xs={12} md={10}>
                <Row>
                  <Col xs={12} md={3}>
                    <Form.Group controlId="formPrice">
                      <Form.Label>PRECIO:</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.price}
                        onChange={handleInputChange}
                        name="precio"
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
              <Col xs={12} md={10}>
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
                <AcceptButton isEditMode={isEditMode} />
              </Form.Group>
            </Form>
          </Card>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default OrderForm;

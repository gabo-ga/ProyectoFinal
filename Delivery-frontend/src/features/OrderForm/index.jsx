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

  useEffect(() => {
    // Obtener la dirección de origen fija al cargar el componente
    const obtenerOrigenFijo = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/configuracion/obtener-origen/"
        );
        const data = await response.json();

        if (data.direccion_origen && data.punto_origen) {
          // Extraer lat y lng de punto_origen
          const [lng, lat] = data.punto_origen
            .replace("SRID=4326;POINT (", "")
            .replace(")", "")
            .split(" ")
            .map(parseFloat);

          setFormData((prevData) => ({
            ...prevData,
            direccion_origen: data.direccion_origen,
            coordenadas_origen_lat: lat,
            coordenadas_origen_lng: lng,
          }));
        } else {
          console.error("Error: Dirección de origen incompleta", data);
        }
      } catch (error) {
        console.error("Error al obtener la dirección de origen:", error);
      }
    };

    obtenerOrigenFijo();
  }, []);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetch(`http://localhost:8000/api/v1/pedidos/${id}/`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Datos del pedido:", data);
          setFormData({
            direccion_origen: data.direccion_origen || "",
            coordenadas_origen_lat: data.coordenadas_origen?.lat || "",
            coordenadas_origen_lng: data.coordenadas_origen?.lng || "",
            direccion_destino: data.direccion_destino || "",
            coordenadas_destino_lat: data.coordenadas_destino?.lat || "",
            coordenadas_destino_lng: data.coordenadas_destino?.lng || "",
            cliente: data.cliente || "",
            estado: data.estado || "",
            precio: data.precio || "",
            date: data.fecha_entrega ? data.fecha_entrega.split("T")[0] : "",
            time: data.fecha_entrega
              ? data.fecha_entrega.split("T")[1].substring(0, 5)
              : "",
            detalle: data.detalle || "",
          });
        })
        .catch((error) => {
          console.error("Error al obtener el pedido:", error);
        });
    }
  }, [id]);

  const handleDestinationPlaceSelected = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      direccion_destino: data.address,
      coordenadas_destino_lat: data.lat,
      coordenadas_destino_lng: data.lng,
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
          <h4>{isEditMode ? "Editar pedido" : "Añadir pedido"}</h4>
        </Row>
        <Row className={styles.rowContainer}>
          <Card className={styles.cardContainer}>
            <Form className={styles.formContainer} onSubmit={handleSubmit}>
              <Col xs={12} md={10}>
                <Form.Group controlId="formOrigin">
                  <Form.Label>DIRECCIÓN DE ORIGEN:</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.direccion_origen}
                    readOnly // Hace que el campo no sea editable
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={10}>
                <Form.Group controlId="fromDestiny">
                  <Form.Label>DIRECCIÓN DESTINO:</Form.Label>
                  <AddressSearch
                    onPlaceSelected={handleDestinationPlaceSelected}
                    initialAddress={formData.direccion_destino}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={10}>
                <CustomerSelect
                  value={formData.cliente}
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
                        value={formData.precio}
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
                    value={formData.detalle}
                    onChange={handleInputChange}
                    name="detalle"
                    rows={3}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Form.Group className={styles.buttonsContainer}>
                <CancelButton type="button" />
                <AcceptButton type="submit" />
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

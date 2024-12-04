// src/pages/OrderForm.js
import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import CancelButton from "../../components/CancelButton";
import AcceptButton from "../../components/AcceptButton";
import AddressSearch from "../AddressSearch";
import CustomerSelect from "../../components/CostumerSelect";
import DriverField from "../../components/DriverField";
import PriceField from "../../components/PriceField";
import DescriptionField from "../../components/DescriptionField";
import {
  fetchPedidoById,
  saveOrUpdatePedido,
  fetchDriversWithActiveOrders,
  crearUbicacion,
} from "../../api/apiService";
import styles from "./index.module.css";
import MapWithMarker from "../../components/MapWithMarkerComponent";
import {
  obtenerOrigenFijo,
  cargarPedido,
  handleOrderSubmit,
} from "../../api/orderFormService";

function OrderForm() {
  const [formData, setFormData] = useState({
    origen_id: null,
    destino_id: null,
    cliente_id: null,
    estado_id: 1,
    precio: "",
    detalle: "",
    conductor: null,
  });

  const [drivers, setDrivers] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    obtenerOrigenFijo(setFormData);
  }, []);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      cargarPedido(id, setFormData);
    }
  }, [id]);

  const handleDestinationPlaceSelected = async (data) => {
    try {
      if (
        !data ||
        typeof data.address !== "string" ||
        typeof data.lat !== "number" ||
        typeof data.lng !== "number"
      ) {
        console.error("Datos incompletos o inválidos seleccionados:", data);
        return;
      }

      console.log("Datos seleccionados:", data);

      //se crea la ubicacion y devuelve el id
      const destinoId = await crearUbicacion(data.address, data.lat, data.lng);

      if (!destinoId) {
        console.error("El backend no devolvió un ID válido para la ubicación.");
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        direccion_destino: data.address,
        coordenadas_destino_lat: data.lat,
        coordenadas_destino_lng: data.lng,
        destino_id: destinoId,
      }));

      console.log("Ubicación creada con ID:", destinoId);
    } catch (error) {
      console.error("Error al crear la ubicación de destino:", error);
      alert("No se pudo crear la ubicación. Por favor, inténtelo de nuevo.");
    }
  };

  const handleMarkerPositionChanged = (position) => {
    setFormData((prevData) => ({
      ...prevData,
      coordenadas_destino_lat: position.lat,
      coordenadas_destino_lng: position.lng,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(`Campo actualizado: ${name} = ${value}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await handleOrderSubmit(formData, id);
      if (success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
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
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={10}>
                <Form.Group controlId="fromDestiny">
                  <Form.Label>DIRECCIÓN DE DESTINO:</Form.Label>
                  <AddressSearch
                    onPlaceSelected={handleDestinationPlaceSelected}
                    initialAddress={formData.direccion_destino}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={10}>
                {formData.coordenadas_destino_lat &&
                  formData.coordenadas_destino_lng && (
                    <MapWithMarker
                      center={{
                        lat: formData.coordenadas_destino_lat,
                        lng: formData.coordenadas_destino_lng,
                      }}
                      onMarkerPositionChanged={handleMarkerPositionChanged}
                    />
                  )}
              </Col>
              <Col xs={12} md={10}>
                <CustomerSelect
                  value={formData.cliente_id}
                  onChange={handleInputChange}
                  name="cliente_id"
                />
              </Col>
              <Col xs={12} md={10}>
                <DriverField
                  drivers={drivers}
                  value={formData.conductor}
                  onChange={handleInputChange}
                />
              </Col>
              <Col xs={12} md={10}>
                <PriceField
                  value={formData.precio}
                  onChange={handleInputChange}
                />
              </Col>
              <Col xs={12} md={10}>
                <DescriptionField
                  value={formData.detalle}
                  onChange={handleInputChange}
                />
              </Col>
              <Form.Group className={styles.buttonsContainer}>
                <CancelButton type="button" />
                <AcceptButton type="submit" />
              </Form.Group>
            </Form>
          </Card>
        </Row>
      </Container>
      {/*<Footer />*/}
    </>
  );
}

export default OrderForm;

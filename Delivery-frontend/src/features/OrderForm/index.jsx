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
import {
  fetchOrigenFijo,
  fetchPedidoById,
  saveOrUpdatePedido,
  fetchDrivers, // Importamos fetchDrivers
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
    conductor: "", // Añadido: Campo para el conductor designado
  });

  const [drivers, setDrivers] = useState([]); // Añadido: Estado para los conductores
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    obtenerOrigenFijo(setFormData);

    // Añadido: Obtener la lista de conductores
    const obtenerConductores = async () => {
      try {
        const data = await fetchDrivers();
        setDrivers(data);
      } catch (error) {
        console.error("Error al obtener los conductores:", error);
      }
    };

    obtenerConductores();
  }, []);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      cargarPedido(id, setFormData);
    }
  }, [id]);

  const handleDestinationPlaceSelected = (data) => {
    console.log("Dirección seleccionada:", data);
    setFormData({
      ...formData,
      direccion_destino: data.address,
      coordenadas_destino_lat: data.lat,
      coordenadas_destino_lng: data.lng,
    });
  };

  const handleMarkerPositionChanged = (position) => {
    console.log("Nueva posición del marcador:", position);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleOrderSubmit(formData);
    if (success) navigate("/dashboard");
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
                  <Form.Label>DIRECCIÓN DESTINO:</Form.Label>
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
                  value={formData.cliente}
                  onChange={handleInputChange}
                  name="cliente"
                />
              </Col>
              {/* Añadido: Campo para seleccionar el conductor designado */}
              <Col xs={12} md={10}>
                <Form.Group controlId="formDesignatedDriver">
                  <Form.Label>CONDUCTOR DESIGNADO:</Form.Label>
                  <Form.Select
                    value={formData.conductor_designado}
                    onChange={handleInputChange}
                    name="conductor_designado"
                    required
                  >
                    <option value="">Seleccione un conductor</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.nombre} {driver.apellido}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={10}>
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
              <Col xs={12} md={10}>
                <Form.Group>
                  <Form.Label>DESCRIPCIÓN:</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={formData.detalle}
                    onChange={handleInputChange}
                    name="detalle"
                    rows={3}
                  />
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
      {/*<Footer />*/}
    </>
  );
}

export default OrderForm;

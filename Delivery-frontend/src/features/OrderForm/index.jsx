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
} from "../../api/apiService";
import styles from "./index.module.css";
import MapWithMarker from "../../components/MapWithMarkerComponent";

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
    const obtenerOrigenFijo = async () => {
      try {
        const data = await fetchOrigenFijo();
        if (data.direccion_origen && data.punto_origen) {
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
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    obtenerOrigenFijo();
  }, []);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const cargarPedido = async () => {
        try {
          const data = await fetchPedidoById(id);
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
        } catch (error) {
          console.error(error.message);
        }
      };
      cargarPedido();
    }
  }, [id]);

  const handleDestinationPlaceSelected = (data) => {
    console.log("Dirección seleccionada:", data); // Verificar datos de dirección
    setFormData({
      ...formData,
      direccion_destino: data.address,
      coordenadas_destino_lat: data.lat,
      coordenadas_destino_lng: data.lng,
    });
  };

  const handleMarkerPositionChanged = (position) => {
    console.log("Nueva posición del marcador:", position); // Verificar datos de marcador ajustado
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
    console.log("Datos a enviar:", formData);
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

    try {
      const response = await fetch("http://localhost:8000/api/v1/pedidos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("Pedido añadido con éxito");
      } else {
        console.error("Error al enviar el formulario:", response.statusText);
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
                {formData.coordenadas_destino_lat &&
                  formData.coordenadas_destino_lng && (
                    <div>
                      <p>Latitud: {formData.coordenadas_destino_lat}</p>
                      <p>Longitud: {formData.coordenadas_destino_lng}</p>
                    </div>
                  )}
              </Col>
              <Col xs={12} md={10}>
                <CustomerSelect
                  value={formData.cliente}
                  onChange={handleInputChange}
                  name="cliente"
                />
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

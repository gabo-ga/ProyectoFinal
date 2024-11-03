import React, { useState, useEffect } from "react";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { Card, Container, Form } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import styles from "./index.module.css";
import EmailInput from "../../components/UserConfigurationComponents/EmailInputComponent";
import PasswordInput from "../../components/UserConfigurationComponents/PasswordComponent";
import NameComponent from "../../components/UserConfigurationComponents/NameComponent";
import AddressSearch from "../../components/AddressSearch";
import AcceptButton from "../../components/AcceptButton";

function UserPage() {
  const [direccionOrigen, setDireccionOrigen] = useState("");
  const [coordenadasOrigen, setCoordenadasOrigen] = useState({
    lat: null,
    lng: null,
  });

  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/configuracion/obtener-origen/"
        );
        const data = await response.json();
        if (data.direccion_origen) {
          setDireccionOrigen(data.direccion_origen);
          setCoordenadasOrigen({ lat: data.lat, lng: data.lng });
        }
      } catch (error) {
        console.error("Error al cargar la configuración:", error);
      }
    };

    cargarConfiguracion();
  }, []);

  const handlePlaceSelected = ({ address, lat, lng }) => {
    setDireccionOrigen(address);
    setCoordenadasOrigen({ lat, lng });
    console.log("Datos que se enviarán:", {
      direccion_origen: address,
      lat: lat,
      lng: lng,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    console.log("Datos enviados al hacer clic en Guardar:", {
      direccion_origen: direccionOrigen,
      lat: coordenadasOrigen.lat,
      lng: coordenadasOrigen.lng,
    });

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/configuracion/guardar-origen/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            direccion_origen: direccionOrigen,
            lat: coordenadasOrigen.lat,
            lng: coordenadasOrigen.lng,
          }),
        }
      );
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
    }
  };

  return (
    <>
      <Header />
      <Container fluid className={styles.body}>
        <Card>
          <Card.Body className="text-center">
            <PersonCircle size={50} />
            <Card.Title>Hola: usuario</Card.Title>
            <Form onSubmit={handleSave}>
              {" "}
              {/* Se pasa handleSave como controlador de submit */}
              <EmailInput />
              <PasswordInput />
              <NameComponent />
              <Form.Group controlId="direccionOrigen">
                <Form.Label>Dirección de Origen</Form.Label>
                <AddressSearch
                  onPlaceSelected={handlePlaceSelected}
                  initialAddress={direccionOrigen}
                />
              </Form.Group>
              <AcceptButton type="submit" /> {/* Cambiado a tipo submit */}
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
}

export default UserPage;

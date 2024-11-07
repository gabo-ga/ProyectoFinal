// src/pages/UserPage.js
import React, { useState, useEffect } from "react";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { Card, Container, Form } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import styles from "./index.module.css";
import EmailInput from "../../components/UserConfigurationComponents/EmailInputComponent";
import PasswordInput from "../../components/UserConfigurationComponents/PasswordComponent";
import NameComponent from "../../components/UserConfigurationComponents/NameComponent";
import AddressSearch from "../AddressSearch/index.jsx";
import AcceptButton from "../../components/AcceptButton";
import {
  fetchDireccionOrigen,
  saveDireccionOrigen,
} from "../../api/apiService.js";

function UserPage() {
  const [direccionOrigen, setDireccionOrigen] = useState("");
  const [coordenadasOrigen, setCoordenadasOrigen] = useState({
    lat: null,
    lng: null,
  });

  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        const data = await fetchDireccionOrigen(); // Usa fetchDireccionOrigen
        if (data.direccion_origen) {
          setDireccionOrigen(data.direccion_origen);
          setCoordenadasOrigen({ lat: data.lat, lng: data.lng });
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    cargarConfiguracion();
  }, []);

  const handlePlaceSelected = ({ address, lat, lng }) => {
    setDireccionOrigen(address);
    setCoordenadasOrigen({ lat, lng });
    console.log("Datos que se enviarán:", {
      direccion_origen: address,
      lat,
      lng,
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
      const data = await saveDireccionOrigen({
        direccion_origen: direccionOrigen,
        lat: coordenadasOrigen.lat,
        lng: coordenadasOrigen.lng,
      }); // Usa saveDireccionOrigen
      console.log("Respuesta del servidor:", data);
    } catch (error) {
      console.error(error.message);
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
              <AcceptButton type="submit" />
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
}

export default UserPage;

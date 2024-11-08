// src/pages/UserPage.js
import React, { useState, useEffect } from "react";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { Card, Col, Container, Form } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import styles from "./index.module.css";
import EmailInput from "../../components/UserConfigurationComponents/EmailInputComponent";
import NameComponent from "../../components/UserConfigurationComponents/NameComponent";
import AddressSearch from "../AddressSearch/index.jsx";
import AcceptButton from "../../components/AcceptButton";
import {
  fetchDireccionOrigen,
  saveDireccionOrigen,
  fetchUserById,
} from "../../api/apiService.js";
import { useParams } from "react-router-dom";

function UserPage() {
  const { userId } = useParams;
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [direccionOrigen, setDireccionOrigen] = useState("");
  const [coordenadasOrigen, setCoordenadasOrigen] = useState({
    lat: null,
    lng: null,
  });

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const userData = await fetchUserById();
        setUserEmail(userData.email);
        setUserName(`${userData.first_name} ${userData.last_name}`);
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error.message);
      }
    };

    const cargarConfiguracion = async () => {
      try {
        const data = await fetchDireccionOrigen();
        if (data.direccion_origen) {
          setDireccionOrigen(data.direccion_origen);
          setCoordenadasOrigen({ lat: data.lat, lng: data.lng });
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    cargarDatosUsuario();
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
      });
      console.log("Respuesta del servidor:", data);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <Header />
      <Container fluid className={styles.body}>
        <Card className={styles.card}>
          <Card.Body>
            <Col xs={12} className={styles.container}>
              <PersonCircle size={50} />
              <Card.Title>Hola: {userName}</Card.Title>
              <Form className={styles.formContainer} onSubmit={handleSave}>
                <EmailInput value={userEmail} />
                <NameComponent value={userName} />
                <Form.Group controlId="direccionOrigen">
                  <Form.Label>Dirección de Origen</Form.Label>
                  <AddressSearch
                    onPlaceSelected={handlePlaceSelected}
                    initialAddress={direccionOrigen}
                  />
                </Form.Group>
                <AcceptButton type="submit" />
              </Form>
            </Col>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
}

export default UserPage;

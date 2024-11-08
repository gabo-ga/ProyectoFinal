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
import MapWithMarker from "../../components/MapWithMarkerComponent";

function UserPage() {
  const { userId } = useParams();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [direccionOrigen, setDireccionOrigen] = useState("");
  const [coordenadasOrigen, setCoordenadasOrigen] = useState({
    lat: -17.3895, // Coordenadas predeterminadas (Cochabamba, Bolivia)
    lng: -66.1568,
  });

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const userData = await fetchUserById(userId);
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
  }, [userId]);

  const handlePlaceSelected = ({ address, lat, lng }) => {
    setDireccionOrigen(address);
    setCoordenadasOrigen({ lat, lng });
  };

  const handleMarkerPositionChanged = (newPosition) => {
    setCoordenadasOrigen(newPosition);

    // Actualiza la dirección en función de las nuevas coordenadas
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
        newPosition.lat
      },${newPosition.lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.results[0]) {
          setDireccionOrigen(data.results[0].formatted_address);
        }
      })
      .catch((error) => console.error("Error al obtener la dirección:", error));
  };

  const handleSave = async (e) => {
    e.preventDefault();
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
                {/* Mapa interactivo con marcador reutilizable */}
                <MapWithMarker
                  center={coordenadasOrigen}
                  onMarkerPositionChanged={handleMarkerPositionChanged}
                />
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

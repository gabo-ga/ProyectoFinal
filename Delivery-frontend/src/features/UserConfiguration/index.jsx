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

  // Cargar la dirección de origen guardada al cargar el componente
  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/configuracion/obtener-origen/"
        );
        const data = await response.json();
        if (data.address) {
          setDireccionOrigen(data.address);
          setCoordenadasOrigen({ lat: data.lat, lng: data.lng });
        }
      } catch (error) {
        console.error("Error al cargar la configuración:", error);
      }
    };

    cargarConfiguracion();
  }, []);

  // Callback para manejar la selección de dirección en AddressSearch
  const handlePlaceSelected = ({ address, lat, lng }) => {
    setDireccionOrigen(address);
    setCoordenadasOrigen({ lat, lng });
  };

  // Función para guardar la configuración en el backend
  const handleSave = async () => {
    console.log("Datos enviados:", {
      address: direccionOrigen,
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
            address: direccionOrigen,
            lat: coordenadasOrigen.lat,
            lng: coordenadasOrigen.lng,
          }),
        }
      );
      const data = await response.json();
      console.log("Configuración guardada:", data);
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
            <Form>
              <EmailInput />
              <PasswordInput />
              <NameComponent />

              {/* Campo para la dirección de origen fija */}
              <Form.Group controlId="direccionOrigen">
                <Form.Label>Dirección de Origen Fija</Form.Label>
                <AddressSearch
                  onPlaceSelected={handlePlaceSelected}
                  initialAddress={direccionOrigen}
                />
              </Form.Group>

              {/* Botón para guardar la configuración */}
              <AcceptButton onClick={handleSave} />
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
}

export default UserPage;

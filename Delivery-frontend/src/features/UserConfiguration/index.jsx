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
        setUserEmail(userData.correo);
        setUserName(userData.nombre);
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error.message);
      }
    };

    const cargarConfiguracion = async () => {
      try {
        const data = await fetchDireccionOrigen();
        if (data[0].direccion) {
          setDireccionOrigen(data[0].direccion);
        }
        if(data[0].geojson && data[0].geojson.coordinates){
          setCoordenadasOrigen({
            lat: data[0].geojson.coordinates[1],
            lng: data[0].geojson.coordinates[0],
          });
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

  const handleMarkerPositionChanged = async (newPosition) => {
    try {
      setCoordenadasOrigen(newPosition);

      const formattedAddress = await fetchAddressFromCoordinates(newPosition);

      if (formattedAddress) {
        setDireccionOrigen(formattedAddress);
      } else {
        console.warn(
          "No se pudo obtener una dirección para las coordenadas proporcionadas."
        );
      }
    } catch (error) {
      console.error(
        "Error al manejar el cambio de posición del marcador:",
        error
      );
    }
  };

  const fetchAddressFromCoordinates = async ({ lat, lng }) => {
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const data = await response.json();

      return data.results?.[0]?.formatted_address || null;
    } catch (error) {
      console.error(
        "Error al obtener la dirección desde las coordenadas:",
        error
      );
      return null;
    }
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
      <main className="bg-[#ecf0f1] h-auto py-12 px-4 flex items-center justify-center w-full lg:px-24">
        <Card className="w-full md:w-98 lg:w-1/2">
          <Card.Body>
            <div className="flex items-center flex-col gap-3">
              <PersonCircle size={100} />
              <Form className="w-full flex flex-col gap-3" onSubmit={handleSave}>
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
              </div>
          </Card.Body>
        </Card>
      </main>
      <Footer />
    </>
  );
}

export default UserPage;

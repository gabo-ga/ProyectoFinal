import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const Map = () => {
  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const center = {
    lat: -17.3895, // Centro aproximado de Cochabamba, Bolivia
    lng: -66.1568,
  };

  const [vehiculos, setVehiculos] = useState([]);
  const [rutas, setRutas] = useState([]);

  useEffect(() => {
    // Petición GET para obtener las ubicaciones de los vehículos
    const obtenerUbicaciones = async () => {
      try {
        const respuesta = await fetch(
          "http://localhost:8000/api/v1/vehiculos/ubicaciones"
        );
        const datos = await respuesta.json();
        setVehiculos(datos);
      } catch (error) {
        console.error("Error al obtener ubicaciones:", error);
      }
    };

    obtenerUbicaciones();
  }, []);

  useEffect(() => {
    // Petición GET para obtener las coordenadas de origen y destino de los pedidos
    const obtenerCoordenadas = async () => {
      try {
        const respuesta = await fetch(
          "http://localhost:8000/api/v1/pedidos/coordenadas"
        );
        const datos = await respuesta.json();

        // Para cada pedido, calcular la ruta
        datos.forEach((pedido) => {
          const origen = {
            lat: parseFloat(pedido.ORIGEN_LNG),
            lng: parseFloat(pedido.ORIGEN_LAT),
          };
          const destino = {
            lat: parseFloat(pedido.DESTINO_LNG),
            lng: parseFloat(pedido.DESTINO_LAT),
          };
          calculateRoute(origen, destino);
        });
      } catch (error) {
        console.error("Error al obtener coordenadas:", error);
      }
    };

    obtenerCoordenadas();
  }, []);

  const calculateRoute = (origin, destination) => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setRutas((prevRutas) => [...prevRutas, result]);
        } else {
          console.error("Error al calcular la ruta:", status);
        }
      }
    );
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {/* Marcadores de los vehículos */}
        {vehiculos.map((vehiculo) => (
          <Marker
            key={vehiculo.placa}
            position={{
              lat: vehiculo.ubicacion_geografica.latitude,
              lng: vehiculo.ubicacion_geografica.longitude,
            }}
            title={`Vehículo: ${vehiculo.placa}`}
          />
        ))}

        {/* Renderizar múltiples rutas */}
        {rutas.map((route, index) => (
          <DirectionsRenderer
            key={index}
            options={{
              directions: route,
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;

import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { fetchVehiculos, fetchPedidosCoordenadas } from "../../api/apiService";
import { calculateRoute } from "../../api/mapService";

function Map() {
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

  // Obtener ubicaciones de vehículos
  useEffect(() => {
    const obtenerUbicaciones = async () => {
      try {
        const data = await fetchVehiculos(); // Usar fetchVehiculos de apiService
        setVehiculos(data);
      } catch (error) {
        console.error(error);
      }
    };

    obtenerUbicaciones();
  }, []);

  // Obtener coordenadas de pedidos y calcular rutas
  useEffect(() => {
    const obtenerCoordenadas = async () => {
      try {
        const data = await fetchPedidosCoordenadas(); // Usar fetchPedidosCoordenadas de apiService
        data.forEach(async (pedido) => {
          const origen = {
            lat: parseFloat(pedido.ORIGEN_LNG),
            lng: parseFloat(pedido.ORIGEN_LAT),
          };
          const destino = {
            lat: parseFloat(pedido.DESTINO_LNG),
            lng: parseFloat(pedido.DESTINO_LAT),
          };
          try {
            const result = await calculateRoute(origen, destino); // Usar calculateRoute de mapService
            setRutas((prevRutas) => [...prevRutas, result]);
          } catch (status) {
            console.error("Error al calcular la ruta:", status);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    obtenerCoordenadas();
  }, []);

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
}

export default Map;

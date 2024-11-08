import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
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
    lat: -17.3895,
    lng: -66.1568,
  };

  const [vehiculos, setVehiculos] = useState([]);
  const [route, setRoute] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Obtener ubicaciones de vehículos
  useEffect(() => {
    const obtenerUbicaciones = async () => {
      try {
        const data = await fetchVehiculos();
        setVehiculos(data);
      } catch (error) {
        console.error("Error al obtener vehículos:", error);
      }
    };

    obtenerUbicaciones();
  }, []);

  // Obtener pedidos y calcular ruta con waypoints optimizados
  useEffect(() => {
    const fetchAndCalculateRoute = async () => {
      try {
        const data = await fetchPedidosCoordenadas();

        if (data.length < 2) {
          console.error("No hay suficientes datos para calcular la ruta");
          return;
        }

        // Extraer origen y destino
        const origin = {
          lat: parseFloat(data[0].ORIGEN_LNG),
          lng: parseFloat(data[0].ORIGEN_LAT),
        };

        const destination = {
          lat: parseFloat(data[data.length - 1].DESTINO_LNG),
          lng: parseFloat(data[data.length - 1].DESTINO_LAT),
        };

        // Extraer los waypoints
        const waypoints = data.slice(1, -1).map((pedido) => ({
          location: {
            lat: parseFloat(pedido.DESTINO_LNG),
            lng: parseFloat(pedido.DESTINO_LAT),
          },
          stopover: true,
        }));

        // Calcular la ruta con waypoints optimizados
        const routeResult = await calculateRoute(
          origin,
          destination,
          waypoints
        );
        console.log(
          "Orden optimizado de waypoints:",
          routeResult.routes[0].waypoint_order
        );
        setRoute(routeResult);
      } catch (error) {
        console.error("Error al obtener pedidos o calcular la ruta:", error);
      }
    };

    if (isLoaded) {
      fetchAndCalculateRoute();
    }
  }, [isLoaded]);

  if (loadError) {
    return <div>Error al cargar el mapa</div>;
  }

  if (!isLoaded) {
    return <div>Cargando mapa...</div>;
  }

  return (
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

      {/* Renderizar la ruta */}
      {route && <DirectionsRenderer directions={route} />}
    </GoogleMap>
  );
}

export default Map;

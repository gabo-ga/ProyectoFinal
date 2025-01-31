import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { fetchVehiculos, fetchPedidosCoordenadas } from "../../api/apiService";
import { calculateRoute } from "../../api/mapService";
import { useAuth } from "../../AuthContext";

function Map() {
  const containerStyle = { width: "100%", height: "100%" };
  const center = { lat: -17.3895, lng: -66.1568 };

  const [vehiculos, setVehiculos] = useState([]);
  const [routes, setRoutes] = useState([]);
  const { userId } = useAuth();

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
        if (userId === 6) {
          //caso de admin
          const conductores = [
            { id: 7, color: "red" },
            { id: 10, color: "blue" },
            { id: 11, color: "green" },
            { id: 12, color: "yellow" },
          ];
          const tempRoutes = [];
          for (const conductor of conductores) {
            const data = await fetchPedidosCoordenadas(conductor.id);
            if (data.length < 2) continue;

            const { origin, destination, waypoints } = parseCoords(data);
            const routeResult = await calculateRoute(
              origin,
              destination,
              waypoints
            );

            tempRoutes.push({
              directions: routeResult,
              color: conductor.color,
              conductorId: conductor.id,
            });

            console.log(
              "Orden optimizado de waypoints:",
              routeResult.routes[0].waypoint_order
            );
          }

          setRoutes(tempRoutes);
        } else {
          const data = await fetchPedidosCoordenadas(userId);
          if (data.length < 2) {
            console.warn("No hay suficientes datos para trazar la ruta");
            return;
          }
          const { origin, destination, waypoints } = parseCoords(data);
          const routeResult = await calculateRoute(
            origin,
            destination,
            waypoints
          );

          setRoutes([
            {
              directions: routeResult,
              color: "blue",
              conductorId: userId,
            },
          ]);
        }
      } catch (err) {
        console.error("Error al obtener o calcular rutas", err);
      }
    };

    fetchAndCalculateRoute();
  }, [isLoaded, userId]);

  const parseCoords = (data) => {
    const origin = {
      lat: parseFloat(data[0].ORIGEN_LNG),
      lng: parseFloat(data[0].ORIGEN_LAT),
    };
    const destination = {
      lat: parseFloat(data[data.length - 1].DESTINO_LNG),
      lng: parseFloat(data[data.length - 1].DESTINO_LAT),
    };
    const waypoints = data.slice(1, -1).map((pedido) => ({
      location: {
        lat: parseFloat(pedido.DESTINO_LNG),
        lng: parseFloat(pedido.DESTINO_LAT),
      },
      stopover: true,
    }));
    return { origin, destination, waypoints };
  };

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
      {routes.map((routeObj, index) => (
        <DirectionsRenderer
          key={index}
          directions={routeObj.directions}
          options={{
            polylineOptions: {
              strokeColor: routeObj.color,
              strokeWeight: 4,
              strokeOpacity: 0.8,
            },
          }}
        />
      ))}
    </GoogleMap>
  );
}

export default Map;

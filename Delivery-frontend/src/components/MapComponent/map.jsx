import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { fetchPedidosCoordenadas } from "../../api/apiService";
import { calculateRoute, useGoogleMapsScript } from "../../api/mapService";
import { useAuth } from "../../AuthContext";
import {
  initSocket,
  sendLocation,
  closeSocket,
  socket,
} from "../../api/socketService";

function Map() {
  const center = { lat: -17.3895, lng: -66.1568 };

  const [vehiculos, setVehiculos] = useState([]);
  const [routes, setRoutes] = useState([]);
  const { userId } = useAuth();
  const [location, setLocation] = useState(null);

  const { isLoaded, loadError } = useGoogleMapsScript();

  // Obtener ubicaciones de vehículos
  useEffect(() => {
    if (!userId) return;
    initSocket(userId);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Ubicación recibida del servidor: ", data);
      const lat = parseFloat(data.latitude);
      const lng = parseFloat(data.longitude);
      setLocation({
        lat,
        lng,
      });
    };

    return () => {
      closeSocket();
    };
  }, [userId]);

  //enviar ubicacion del conductor periodicamente
  useEffect(() => {
    if (userId !== 6) {
      const intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          sendLocation(latitude, longitude);
          console.log("Ubicación enviada al servidor", { latitude, longitude });
        });
      }, 5000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [userId]);

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
    <GoogleMap mapContainerClassName="w-full h-full rounded-lg overflow-hidden shadow-lg grid row-span-5 lg:row-span-6" center={center} zoom={12}>
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
      {location && (
        <Marker
          position={location}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          }}
        />
      )}
    </GoogleMap>
  
  );
}

export default Map;

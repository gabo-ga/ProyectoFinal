import React, { useEffect, useState } from "react";
import {
  GoogleMap,
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
import { orderByDistance } from 'geolib';

function Map() {
  const center = { lat: -17.3895, lng: -66.1568 };

  const [vehiculos, setVehiculos] = useState([]);
  const [routes, setRoutes] = useState([]);
  const { userId } = useAuth();
  const [location, setLocation] = useState(null);

  const { isLoaded, loadError } = useGoogleMapsScript();

  useEffect(() => {
    if (!userId) return;
    initSocket(userId);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const lat = parseFloat(data.latitude);
      const lng = parseFloat(data.longitude);
      setLocation({ lat, lng });
    };

    return () => {
      closeSocket();
    };
  }, [userId]);

  useEffect(() => {
    if (userId !== 6) {
      const intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          sendLocation(latitude, longitude);
        });
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [userId]);

  const prepararRutaDesdePedidos = (data) => {
    const origin = {
      latitude: data[0].ORIGEN_LNG,
      longitude: data[0].ORIGEN_LAT,
    };

    const destinos = data.map((pedido) => ({
      id: pedido.ID,
      latitude: pedido.DESTINO_LNG,
      longitude: pedido.DESTINO_LAT,
    }));

    const destinosOrdenados = orderByDistance(origin, destinos);
    const destinoFinal = destinosOrdenados.at(-1);

    const waypoints = destinosOrdenados.slice(0, -1).map((p) => ({
      location: {
        lat: p.latitude,
        lng: p.longitude,
      },
      stopover: true,
    }));

    return {
      origin: {
        lat: origin.latitude,
        lng: origin.longitude,
      },
      destination: {
        lat: destinoFinal.latitude,
        lng: destinoFinal.longitude,
      },
      waypoints,
    };
  };

  useEffect(() => {
    const fetchAndCalculateRoute = async () => {
      try {
        if (userId === 6) {
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

            const { origin, destination, waypoints } = prepararRutaDesdePedidos(data);
            const routeResult = await calculateRoute(origin, destination, waypoints);

            tempRoutes.push({
              directions: routeResult,
              color: conductor.color,
              conductorId: conductor.id,
            });
          }

          setRoutes(tempRoutes);
        } else {
          const data = await fetchPedidosCoordenadas(userId);
          if (data.length < 2) return;

          const { origin, destination, waypoints } = prepararRutaDesdePedidos(data);
          const routeResult = await calculateRoute(origin, destination, waypoints);

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

    if (isLoaded) fetchAndCalculateRoute();
  }, [isLoaded, userId]);

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full rounded-lg overflow-hidden shadow-lg grid row-span-5 lg:row-span-6"
      center={center}
      zoom={12}
    >
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
          icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
        />
      )}
    </GoogleMap>
  );
}

export default Map;

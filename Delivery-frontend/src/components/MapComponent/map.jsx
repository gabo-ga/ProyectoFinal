import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  InfoWindow
} from "@react-google-maps/api";
import { fetchPedidosCoordenadas } from "../../api/apiService";
import {
  calculateRoute,
  calculateRouteDistances,  // Add this import
  useGoogleMapsScript
} from "../../api/mapService";
import { useAuth } from "../../AuthContext";
import { orderByDistance } from 'geolib';
import { useWebSocket } from "../../hooks/useWebSocket";

function Map() {
  const [routes, setRoutes] = useState([]);
  const [routeDistances, setRouteDistances] = useState({});  // Add this state
  const { userId } = useAuth();
  const [selectedItem, setSelectedItem] = useState(null);
  const { location } = useWebSocket(userId);
  const { isLoaded, loadError } = useGoogleMapsScript();

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
      location: { lat: p.latitude, lng: p.longitude },
      stopover: true,
    }));

    return {
      origin: { lat: origin.latitude, lng: origin.longitude },
      destination: { lat: destinoFinal.latitude, lng: destinoFinal.longitude },
      waypoints,
    };
  };

  useEffect(() => {
    const fetchAndCalculateRoute = async () => {
      try {
        const tempRoutes = [];
        const tempDistances = {};

        if (userId === 6) {
          const conductores = [
            { id: 7, color: "red" },
            { id: 10, color: "blue" },
            { id: 11, color: "green" },
            { id: 12, color: "yellow" },
          ];

          for (const conductor of conductores) {
            const data = await fetchPedidosCoordenadas(conductor.id);
            if (!data || data.length < 2) continue;

            const { origin, destination, waypoints } = prepararRutaDesdePedidos(data);
            const routeResult = await calculateRoute(origin, destination, waypoints);
            const distanceResult = await calculateRouteDistances(origin, destination, waypoints);

            tempRoutes.push({
              directions: routeResult,
              color: conductor.color,
              conductorId: conductor.id,
              origin,
              destination,
              waypoints,
              pedidos: data
            });

            tempDistances[conductor.id] = distanceResult;
          }
        } else {
          const data = await fetchPedidosCoordenadas(userId);
          if (!data || data.length < 2) return;

          const { origin, destination, waypoints } = prepararRutaDesdePedidos(data);
          const routeResult = await calculateRoute(origin, destination, waypoints);
          const distanceResult = await calculateRouteDistances(origin, destination, waypoints);

          tempRoutes.push({
            directions: routeResult,
            color: "blue",
            conductorId: userId,
            origin,
            destination,
            waypoints,
            pedidos: data
          });

          tempDistances[userId] = distanceResult;
        }

        setRoutes(tempRoutes);
        setRouteDistances(tempDistances);
      } catch (err) {
        console.error("Error al obtener o calcular rutas", err);
      }
    };

    if (isLoaded) fetchAndCalculateRoute();
  }, [isLoaded, userId]);

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;
  console.log(routes)

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full rounded-lg overflow-hidden shadow-lg grid row-span-5 lg:row-span-6"
      zoom={12}
    >
      {routes.map((routeObj, idx) => (
        <React.Fragment key={idx}>
          <DirectionsRenderer
            directions={routeObj.directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: routeObj.color,
                strokeWeight: 4,
                strokeOpacity: 0.8,
              },
            }}
          />

          {/* Origen */}
          <Marker
            position={routeObj.origin}
            icon="https://maps.google.com/mapfiles/ms/icons/green-dot.png"
            onClick={() => setSelectedItem({ routeIdx: idx, type: 'origin', wpIdx: null })}
          />

          {/* Waypoints */}
          {routeObj.waypoints.map((wp, i) => (
            <Marker
              key={i}
              position={wp.location}
              label={`${i + 1}`}
              onClick={() => setSelectedItem({ routeIdx: idx, type: 'waypoint', wpIdx: i })}
            />
          ))}

          {/* Destino */}
          <Marker
            position={routeObj.destination}
            icon="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            onClick={() => setSelectedItem({ routeIdx: idx, type: 'destination', wpIdx: null })}
          />
        </React.Fragment>
      ))}

      {/* InfoWindow dinámico */}
      {selectedItem && (() => {
        const { routeIdx, type, wpIdx } = selectedItem;
        const route = routes[routeIdx];
        let position, content;

        if (type === 'origin') {
          position = route.origin;
          const distances = routeDistances[route.conductorId];
          content = (
            <div className="p-2">
              <strong>Origen</strong><br />
              Cliente: {route.pedidos[0].CLIENTE}<br />
              Dirección: {route.pedidos[0].ORIGEN_DIRECCION}<br />
              {distances && distances.segments[0] && (
                <div className="mt-2 text-sm">
                  <div>Distancia al siguiente punto: {distances.segments[0].distance}</div>
                  <div>Tiempo estimado: {distances.segments[0].duration}</div>
                </div>
              )}
            </div>
          );
        } else if (type === 'waypoint') {
          position = route.waypoints[wpIdx].location;
          const pedido = route.pedidos[wpIdx + 1];
          const distances = routeDistances[route.conductorId];
          content = (
            <div className="p-2">
              <strong>Parada #{wpIdx + 1}</strong><br />
              Cliente: {pedido.CLIENTE}<br />
              Dirección: {pedido.DESTINO_DIRECCION}<br />
              {distances && distances.segments[wpIdx + 1] && (
                <div className="mt-2 text-sm">
                  <div>Distancia al siguiente punto: {distances.segments[wpIdx + 1].distance}</div>
                  <div>Tiempo estimado: {distances.segments[wpIdx + 1].duration}</div>
                </div>
              )}
            </div>
          );
        } else if (type === 'destination') {
          position = route.destination;
          const last = route.pedidos.length - 1;
          const distances = routeDistances[route.conductorId];
          content = (
            <div className="p-2">
              <strong>Destino</strong><br />
              Cliente: {route.pedidos[last].CLIENTE}<br />
              Dirección: {route.pedidos[last].DESTINO_DIRECCION}<br />
              {distances && (
                <div className="mt-2 text-sm">
                  <div>Distancia total recorrida: {distances.total.distance}</div>
                  <div>Tiempo total estimado: {distances.total.duration}</div>
                </div>
              )}
            </div>
          );
        }

        return (
          <InfoWindow
            position={position}
            onCloseClick={() => setSelectedItem(null)}
          >
            {content}
          </InfoWindow>
        );
      })()}

      {/* Marcador en tiempo real */}
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

import { useLoadScript } from "@react-google-maps/api";
import { orderByDistance } from 'geolib'
import { fetchPedidosCoordenadas } from "./apiService";

const libraries = ["places"];

export const useGoogleMapsScript = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  return { isLoaded, loadError };
};

export const calculateDistances = (origin, waypoints) => {
  return new Promise((resolve, reject) => {
    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: waypoints.map((wp) => wp.location),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === window.google.maps.DistanceMatrixStatus.OK) {
          resolve(response);
        } else {
          reject("Error en Distance Matrix Service: " + status);
        }
      }
    );
  });
};

export const calculateRoute = (origin, destination, waypoints) => {
  return new Promise((resolve, reject) => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        optimizeWaypoints: true, // Permite que Google optimice el orden
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          resolve(result);
        } else {
          console.error("Error al calcular la ruta:", status);
          reject(status);
        }
      }
    );
  });
};

export const calculateRouteDistances = (origin, destination, waypoints) => {
  return new Promise((resolve, reject) => {
    const service = new window.google.maps.DistanceMatrixService();
    
    // Create array of all points in order
    const allPoints = [
      origin,
      ...waypoints.map(wp => wp.location),
      destination
    ];
    
    // Calculate distances between consecutive points
    const promises = allPoints.slice(0, -1).map((point, index) => {
      return new Promise((resolveMatrix, rejectMatrix) => {
        service.getDistanceMatrix(
          {
            origins: [point],
            destinations: [allPoints[index + 1]],
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
            if (status === window.google.maps.DistanceMatrixStatus.OK) {
              const element = response.rows[0].elements[0];
              resolveMatrix({
                from: index,
                to: index + 1,
                distance: element.distance,
                duration: element.duration
              });
            } else {
              rejectMatrix(`Error calculating distance for segment ${index}: ${status}`);
            }
          }
        );
      });
    });

    // Wait for all distance calculations
    Promise.all(promises)
      .then(results => {
        const distances = results.map(result => ({
          segment: `${result.from}-${result.to}`,
          distance: result.distance.text,
          duration: result.duration.text,
          meters: result.distance.value,
          seconds: result.duration.value
        }));
        
        // Calculate totals
        const totals = distances.reduce((acc, curr) => ({
          totalDistance: acc.totalDistance + curr.meters,
          totalDuration: acc.totalDuration + curr.seconds
        }), { totalDistance: 0, totalDuration: 0 });

        resolve({
          segments: distances,
          total: {
            distance: `${(totals.totalDistance / 1000).toFixed(1)} km`,
            duration: `${Math.round(totals.totalDuration / 60)} mins`
          }
        });
      })
      .catch(reject);
  });
};

const data = await fetchPedidosCoordenadas(7);
const ruta = prepararRutaDesdePedidos(data);

export function prepararRutaDesdePedidos(data) {
  if (!data || data.length < 2) {
    console.warn("Se requieren al menos 2 pedidos para generar una ruta.");
    return null;
  }

  // Paso 1: Definir el origen (todos los pedidos lo comparten)
  const origin = {
    latitude: data[0].ORIGEN_LNG,  // ⚠️ Invertidos en el JSON
    longitude: data[0].ORIGEN_LAT,
  };

  // Paso 2: Crear lista de destinos con su ID (para tracking)
  const destinos = data.map((pedido) => ({
    id: pedido.ID,
    latitude: pedido.DESTINO_LNG,
    longitude: pedido.DESTINO_LAT,
  }));

  // Paso 3: Ordenar los destinos por distancia al origen
  const destinosOrdenados = orderByDistance(origin, destinos);

  // Paso 4: El destino final será el más lejano (último en la lista)
  const destinoFinal = destinosOrdenados.at(-1);

  // Paso 5: Los demás serán waypoints
  const waypoints = destinosOrdenados.slice(0, -1).map((p) => ({
    location: {
      lat: p.latitude,
      lng: p.longitude,
    },
    stopover: true,
  }));

  // Paso 6: Retornar objeto listo para usar con Google Maps
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
}

import { useLoadScript } from "@react-google-maps/api";

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

import { useState, useEffect } from 'react';
import {
  initSocket,
  sendLocation,
  closeSocket,
  socket,
} from "../api/socketService";

export const useWebSocket = (userId) => {
  const [location, setLocation] = useState(null);

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

  return { location };
}; 
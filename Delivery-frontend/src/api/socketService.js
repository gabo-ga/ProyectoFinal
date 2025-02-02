let socket = null;

export function initSocket(conductorId){
    const wsUrl = `ws://localhost:8080/ws/location/${conductorId}`;
    socket = new WebSocket(wsUrl);

socket.onopen = () => {
    console.log('WebSocket connection established');
    };

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Ubicacion recibida del servidor: ', data);
    };

socket.onclose = () => {
    console.log('WebSocket connection closed');
    };
};

//funcion para enviar la ubicacion
export function sendLocation(lat, lng) {
    if(socket.readyState === WebSocket.OPEN) {
        const payload = { lat, lng};
    socket.send(JSON.stringify(payload));
    } else {
        console.error('socket no esta abierto');
    }
};

export function closeSocket() {
    if (socket){
        socket.close();
        socket = null;
    }
};
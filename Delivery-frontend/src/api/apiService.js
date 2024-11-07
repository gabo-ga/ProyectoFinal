import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const fetchActiveOrders = async () => {
    try{
        const response = await axios.get(`${API_BASE_URL}/pedidos/en-curso/`);
        return response.data;
    } catch(error){
        throw new Error('Error al cargar los pedidos');
    }
};

export const fetchActiveVehicles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehiculos/vehiculos-disponibles/`);
      return response.data;
    } catch (error) {
      throw new Error('Error al cargar los vehículos disponibles');
    }
  };

  export const fetchPedidos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pedidos/detalle-pedidos/`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener los pedidos');
    }
  };
  
  export const deletePedido = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/pedidos/${id}/`);
      return response.status === 204;
    } catch (error) {
      throw new Error('Error al eliminar el pedido');
    }
  };
  
  export const fetchDireccionOrigen = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/configuracion/obtener-origen/`);
      return response.data;
    } catch (error) {
      throw new Error('Error al cargar la configuración');
    }
  };
  
  export const saveDireccionOrigen = async (direccionOrigenData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/configuracion/guardar-origen/`, direccionOrigenData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al guardar la configuración');
    }
  };

import axiosInstance from '../axiosInstance';

const API_URL = "http://localhost:8000/api/vehiculos/";

//funciona para traer los vehiculos
export const fetchActiveVehicles = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al cargar los vehículos disponibles');
    }
  };

//funcion para añadir un vehiculo
export const addVehicle = async (vehicleData) => {
    try {
      const response = await axiosInstance.post(API_URL, vehicleData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  };

//funcion para editar
export const updateVehicle = async(vehicleId, vehicleData) => {
    try{
        const response = await axiosInstance.patch(`${API_URL}${vehicleId}/`, vehicleData);
        return response.data;
    }catch (error){
        throw error.response ? error.response.data : error;
    }
};

//funcion para eliminar
export const deleteVehicle = async (vehicleId) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}${vehicleId}/`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
};


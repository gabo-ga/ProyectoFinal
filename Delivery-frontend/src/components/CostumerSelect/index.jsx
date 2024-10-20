import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

const CustomerSelect = () => {
  const [clientes, setClientes] = useState([]); 
  const [selectedCliente, setSelectedCliente] = useState(''); 

  // Función para obtener los clientes desde el backend
  const fetchClientes = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/clientes/');
      const data = await response.json(); // Parsear los datos a JSON
      setClientes(data);  // Guardar los datos en el estado
    } catch (error) {
      console.error('Error fetching clientes:', error);
    }
  };

  // Ejecuta la función fetchClientes cuando el componente se monta
  useEffect(() => {
    fetchClientes();
  }, []);

  return (
    <Form.Group>
      <Form.Label>CLIENTE:</Form.Label>
      <Form.Select
        value={selectedCliente}
        onChange={(e) => setSelectedCliente(e.target.value)}  // Actualiza el cliente seleccionado
      >
        <option value="">Seleccione un cliente</option>
        {clientes.map((cliente) => (
          <option key={cliente.id} value={cliente.id}>
            {cliente.nombre} {/* Ajusta 'cliente.nombre' al campo adecuado según los datos de tu API */}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default CustomerSelect;

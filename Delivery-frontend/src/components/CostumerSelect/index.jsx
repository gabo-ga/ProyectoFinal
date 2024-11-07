// src/components/CustomerSelect.js
import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { fetchClientes } from "../../api/apiService"; // Importa la función desde apiService

// Función declarada para el componente CustomerSelect
function CustomerSelect({ value, onChange, name }) {
  const [clientes, setClientes] = useState([]);

  // Ejecuta la función fetchClientes cuando el componente se monta
  useEffect(() => {
    const getClientes = async () => {
      try {
        const data = await fetchClientes(); // Usa fetchClientes de apiService
        setClientes(data);
      } catch (error) {
        console.error("Error fetching clientes:", error);
      }
    };

    getClientes();
  }, []);

  return (
    <Form.Group>
      <Form.Label>CLIENTE:</Form.Label>
      <Form.Select value={value} onChange={onChange} name={name} required>
        <option value="">Seleccione un cliente</option>
        {clientes.map((cliente) => (
          <option key={cliente.id} value={cliente.id}>
            {cliente.nombre}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
}

CustomerSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default CustomerSelect;

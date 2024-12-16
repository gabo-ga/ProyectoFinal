import React, { createContext, useState, useContext } from "react";

// Crear el contexto
const FilterContext = createContext();

// Crear un custom hook para simplificar el acceso al contexto
export const useFilter = () => useContext(FilterContext);

// Crear el Provider del contexto
export const FilterProvider = ({ children }) => {
  // Estado inicial: un objeto vacío
  const [filters, setFilters] = useState({ cliente: "", estado: "" });

  // Función para actualizar los filtros
  const updateFilters = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters, // Mantener los valores previos
      ...newFilters, // Sobrescribir con los nuevos valores
    }));
  };

  // Proveer el contexto a los componentes hijos
  return (
    <FilterContext.Provider value={{ filters, updateFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

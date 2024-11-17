// src/components/AddVehicleForm.jsx
import React, { useState, useEffect } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { fetchDrivers } from "../../api/apiService";
import axios from "axios";

function VehicleForm() {
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [assignedDriver, setAssignedDriver] = useState(null); // Cambiado a null
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const obtenerConductores = async () => {
      try {
        const data = await fetchDrivers();
        setDrivers(data);
      } catch (error) {
        console.error("Error al obtener los conductores:", error);
      }
    };

    obtenerConductores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vehicleData = {
      vehiculo_nombre: vehicleModel, // Cambiado
      tipo: vehicleType,
      placa: licensePlate,
      conductor: assignedDriver, // Cambiado
      disponible: true, // Añadido si es necesario
    };

    console.log("Datos enviados al backend:", vehicleData);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/vehiculos/",
        vehicleData
      );

      console.log("Respuesta del backend:", response.data);

      alert("Vehículo añadido con éxito");

      // Restablecer el formulario
      setVehicleModel("");
      setVehicleType("");
      setLicensePlate("");
      setAssignedDriver(null);
    } catch (error) {
      if (error.response) {
        console.error("Error al añadir el vehículo:", error.response.data);
        alert(`Error: ${JSON.stringify(error.response.data)}`);
      } else {
        console.error("Error al añadir el vehículo:", error);
        alert("Ocurrió un error al añadir el vehículo");
      }
    }
  };

  return (
    <div>
      <Header />
      <Container className="my-4">
        <Card>
          <Card.Header as="h5">Añadir Nuevo Vehículo</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="vehicleModel">
                <Form.Label>Modelo del Vehículo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el modelo del vehículo"
                  value={vehicleModel}
                  onChange={(e) => {
                    setVehicleModel(e.target.value);
                    console.log("Modelo del vehículo:", e.target.value);
                  }}
                  required
                />
              </Form.Group>

              <Form.Group controlId="vehicleType" className="mt-3">
                <Form.Label>Tipo del Vehículo</Form.Label>
                <Form.Select
                  value={vehicleType}
                  onChange={(e) => {
                    setVehicleType(e.target.value);
                    console.log("Tipo del vehículo:", e.target.value);
                  }}
                  required
                >
                  <option value="">Seleccione el tipo de vehículo</option>
                  <option value="motocicleta">Motocicleta</option>
                  <option value="van">Van</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="licensePlate" className="mt-3">
                <Form.Label>Placa</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese la placa del vehículo"
                  value={licensePlate}
                  onChange={(e) => {
                    setLicensePlate(e.target.value);
                    console.log("Placa del vehículo:", e.target.value);
                  }}
                  required
                />
              </Form.Group>

              <Form.Group controlId="assignedDriver" className="mt-3">
                <Form.Label>Conductor Designado</Form.Label>
                <Form.Select
                  value={assignedDriver || ""}
                  onChange={(e) => {
                    const driverId = parseInt(e.target.value);
                    setAssignedDriver(driverId);
                    console.log("Conductor asignado:", driverId);
                  }}
                  required
                >
                  <option value="">Seleccione un conductor</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.nombre} {driver.apellido}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-4">
                Añadir Vehículo
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}

export default VehicleForm;

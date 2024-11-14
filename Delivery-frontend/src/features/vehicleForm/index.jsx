// src/components/AddVehicleForm.jsx
import React, { useState, useEffect } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import axios from "axios";

function VehicleForm() {
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [assignedDriver, setAssignedDriver] = useState("");
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    // Obtener la lista de conductores desde el backend
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/conductores/"
        );
        setDrivers(response.data);
      } catch (error) {
        console.error("Error al obtener los conductores:", error);
      }
    };

    fetchDrivers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vehicleData = {
      modelo: vehicleModel,
      tipo: vehicleType,
      placa: licensePlate,
      conductor_id: assignedDriver, // Asumiendo que usas el ID del conductor
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/vehiculos/",
        vehicleData
      );
      alert("Vehículo añadido con éxito");
      // Restablecer el formulario
      setVehicleModel("");
      setVehicleType("");
      setLicensePlate("");
      setAssignedDriver("");
    } catch (error) {
      console.error("Error al añadir el vehículo:", error);
      alert("Ocurrió un error al añadir el vehículo");
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
                  onChange={(e) => setVehicleModel(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="vehicleType" className="mt-3">
                <Form.Label>Tipo del Vehículo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el tipo del vehículo"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="licensePlate" className="mt-3">
                <Form.Label>Placa</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese la placa del vehículo"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="assignedDriver" className="mt-3">
                <Form.Label>Conductor Designado</Form.Label>
                <Form.Select
                  value={assignedDriver}
                  onChange={(e) => setAssignedDriver(e.target.value)}
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

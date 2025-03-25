// src/components/AddVehicleForm.jsx
import React, { useState, useEffect } from "react";
import {useForm} from "react-hook-form";
import { Form, Button, Card } from "react-bootstrap";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { fetchDrivers } from "../../api/apiService";
import { addVehicle } from "../../api/vehicleFormService";

function VehicleForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm();
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

  const onSubmit = async (data) => {
    try{
      await addVehicle({...data, disponible: true});
      alert("Vehiculo añadido con exito");
      reset()
    }catch(error){
      alert("Error al añadir el vehiculo");
      console.error("error al añadir el vehiculo", error)
    }
  }


  return (
    <>
      <Header />
      <main className="bg-[#ecf0f1] h-auto py-24 flex flex-col items-center">
        <div>
          <h4>Añadir Nuevo Vehículo</h4>
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
              {/*vehiculo form*/}
              <Form.Group controlId="vehicleModel">
                <Form.Label>Modelo del Vehículo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el modelo del vehículo"
                  {...register("vehiculo_nombre", {required: "Campo obligatorio"})}
                />
              </Form.Group>
              {/*tipo de vehiculo*/}
              <Form.Group controlId="vehicleType" className="mt-3">
                <Form.Label>Tipo del Vehículo</Form.Label>
                <Form.Select
                  {...register("tipo",{required:"Campo obligatorio"})}
                >
                  <option value="">Seleccione el tipo de vehículo</option>
                  <option value="motocicleta">Motocicleta</option>
                  <option value="van">Van</option>
                </Form.Select>
              </Form.Group>
                  {/*placa */}
              <Form.Group controlId="licensePlate" className="mt-3">
                <Form.Label>Placa</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese la placa del vehículo"
                  {...register("placa", {required: "Campo obligatorio"})}
                />
              </Form.Group>
                  {/**conductor designado */}
              <Form.Group controlId="assignedDriver" className="mt-3">
                <Form.Label>Conductor Designado</Form.Label>
                <Form.Select {...register("conductor", { required: "Seleccione un conductor" })}>
                  <option value="">Seleccione un conductor</option>
                  {drivers.map((driver) => (
                    <option key={driver.id_conductor} value={driver.id_conductor}>
                      {driver.nombre_conductor}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
                  {/**boton de envio */}
              <Button variant="primary" type="submit" className="mt-4">
                Añadir Vehículo
              </Button>
            </Form>
          </Card.Body>
        </Card>
        </div>
        </main>
      <Footer />
    </>
  );
}

export default VehicleForm;

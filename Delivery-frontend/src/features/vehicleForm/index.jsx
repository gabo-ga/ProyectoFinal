// src/components/AddVehicleForm.jsx
import React, { useState, useEffect } from "react";
import {useForm} from "react-hook-form";
import { Form, Button, Card } from "react-bootstrap";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { fetchDrivers } from "../../api/apiService";
import { addVehicle, fetchVehicleById } from "../../api/vehicleFormService";
import { useNavigate, useParams } from "react-router-dom";

function VehicleForm() {
  const {id} = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm();
  const [drivers, setDrivers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

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

    if(id){
      setIsEditing(true);
      const obtenerVehiculo = async() => {
        try{
          const vehicleData = await fetchVehicleById(id);
          reset(vehicleData);
        }catch(error){
          console.error("error al cargar el vehiculo", error)
        }
      };
      obtenerVehiculo();
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await updateVehicle(id, data);
        alert("Vehículo actualizado con éxito");
      } else {
        await addVehicle({ ...data, disponible: true });
        alert("Vehículo añadido con éxito");
      }

      navigate("/vehicles");
    } catch (error) {
      alert("Error al procesar el vehículo");
      console.error("Error:", error);
    }
  };


  return (
    <>
      <Header />
      <main className="bg-[#ecf0f1] h-auto py-24 flex flex-col items-center ">
        <div>
          <h4>{isEditing ? "Editar Vehiculo" : "Añadir nuevo vehículo"}</h4>
        <Card className="lg:w-98">
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
              {isEditing ? "Guardar cambios" : "Añadir vehículo"}
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

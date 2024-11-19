import { Form } from "react-bootstrap";

const DriverField = ({ drivers, value, onChange }) => (
  <Form.Group controlId="formDesignatedDriver">
    <Form.Label>CONDUCTOR DESIGNADO:</Form.Label>
    <Form.Select name="conductor_designado" value={value} onChange={onChange}>
      <option value="">Seleccione un conductor</option>
      {drivers.map((driver) => (
        <option key={driver.id} value={driver.id}>
          {driver.nombre} (Pedidos Activos: {driver.pedidos_activos})
        </option>
      ))}
    </Form.Select>
  </Form.Group>
);

export default DriverField;

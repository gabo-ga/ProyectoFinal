import { Form } from "react-bootstrap";

function NameComponent() {
  return (
    <>
      <Form.Group>
        <Form.Label>Nombre Completo</Form.Label>
        <Form.Control placeholder="Gabriel Gonzales" disabled></Form.Control>
      </Form.Group>
    </>
  );
}

export default NameComponent;

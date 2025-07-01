import { Form } from "react-bootstrap";

const DescriptionField = ({ value, onChange }) => (
  <Form.Group controlId="formDescription">
    <Form.Label>DESCRIPCIÓN:</Form.Label>
    <Form.Control
      as="textarea"
      value={value}
      onChange={onChange}
      name="detalle"
      rows={3}
      required
    />
  </Form.Group>
);

export default DescriptionField;

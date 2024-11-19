import { Form } from "react-bootstrap";

const PriceField = ({ value, onChange }) => (
  <Form.Group controlId="formPrice">
    <Form.Label>PRECIO:</Form.Label>
    <Form.Control
      type="text"
      value={value}
      onChange={onChange}
      name="precio"
      required
    />
  </Form.Group>
);

export default PriceField;

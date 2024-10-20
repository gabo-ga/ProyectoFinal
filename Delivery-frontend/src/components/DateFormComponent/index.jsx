import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

const DateFormComponent = () => {
  const [deliveryDate, setDeliveryDate] = useState('');

  useEffect(() => {
    if (deliveryDate) {
      console.log('Fecha de entrega registrada:', deliveryDate);
    }
  }, [deliveryDate]);  // Se ejecuta cuando `deliveryDate` cambia

  return (
    <Form.Group controlId="formDeliveryDate">
      <Form.Label>Fecha de Entrega</Form.Label>
      <Form.Control
        type="date"
        value={deliveryDate}
        onChange={(e) => setDeliveryDate(e.target.value)}
        required
      />
    </Form.Group>
  );
};

export default DateFormComponent;

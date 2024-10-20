import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

const TimeFormComponent = () => {
  const [deliveryTime, setDeliveryTime] = useState('');

  useEffect(() => {
    if (deliveryTime) {
      console.log('Hora de entrega registrada:', deliveryTime);
    }
  }, [deliveryTime]); 

  return (
    <Form.Group controlId="formDeliveryTime">
      <Form.Label>Hora de Entrega</Form.Label>
      <Form.Control
        type="time"
        value={deliveryTime}
        onChange={(e) => setDeliveryTime(e.target.value)}
        required
      />
    </Form.Group>
  );
};

export default TimeFormComponent;

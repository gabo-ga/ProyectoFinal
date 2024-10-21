import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { Card, Col, Container, Row } from "react-bootstrap";
import styles from "./index.module.css";
import { Form } from "react-bootstrap";
import CancelButton from "../../components/CancelButton";
import AcceptButton from "../../components/AcceptButton";
import AddressSearch from "../../components/AddressSearch";
import CustomerSelect from "../../components/CostumerSelect";
import DateFormComponent from "../../components/DateFormComponent";
import TimeFormComponent from "../../components/TimeFormComponent";
import { useState } from "react";

function addOrder() {
  const [formData, setFormData] = useState({
    address: "",
    customer: "",
    price: "",
    date: "",
    time: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de envío de datos
  };
  return (
    <>
      <Header />
      <Container fluid className={styles.body}>
        <Row className={styles.rowContainer}>
          <h4>Añadir pedido</h4>
        </Row>
        <Row className={styles.rowContainer}>
          <Card className={styles.cardContainer}>
            <Form className={styles.formContainer}>
              <Col xs={12} md={8}>
                <Form.Group controlId="fromdAddress">
                  <Form.Label>DIRECCION:</Form.Label>
                  <AddressSearch
                    value={formData.address}
                    onChange={handleInputChange}
                    name="address"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={8}>
                <CustomerSelect
                  value={formData.customer}
                  onChange={handleInputChange}
                  name="customer"
                />
              </Col>
              <Col xs={12} md={8}>
                <Row>
                  <Col xs={12} md={3}>
                    <Form.Group controlId="formPrice">
                      <Form.Label>PRECIO:</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.price}
                        onChange={handleInputChange}
                        name="price"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={9}>
                    <Form.Group className={styles.datetimeContainer}>
                      <DateFormComponent
                        value={formData.date}
                        onChange={handleInputChange}
                        name="date"
                      />
                      <TimeFormComponent
                        value={formData.time}
                        onChange={handleInputChange}
                        name="time"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={8}>
                <Form.Group>
                  <Form.Label>DESCRIPCION:</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={formData.description}
                    onChange={handleInputChange}
                    name="description"
                    rows={3}
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Form.Group className={styles.buttonsContainer}>
                <CancelButton></CancelButton>
                <AcceptButton></AcceptButton>
              </Form.Group>
            </Form>
          </Card>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default addOrder;

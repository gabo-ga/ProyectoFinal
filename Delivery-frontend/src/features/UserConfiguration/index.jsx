import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { Card, Container } from "react-bootstrap";
import styles from "./index.module.css";
import { PersonCircle } from "react-bootstrap-icons";
import { Form } from "react-bootstrap";
import EmailInput from "../../components/UserConfigurationComponents/EmailInputComponent";
import PasswordInput from "../../components/UserConfigurationComponents/PasswordComponent";
import NameComponent from "../../components/UserConfigurationComponents/NameComponent";

function UserPage() {
  return (
    <>
      <Header></Header>
      <Container fluid className={styles.body}>
        <Card>
          <PersonCircle></PersonCircle>
          <Card.Title>Hola: usuario</Card.Title>
          <Card.Text>
            <EmailInput></EmailInput>
            <PasswordInput></PasswordInput>
            <NameComponent></NameComponent>
            <Form.Group>
              <Form.Label>Direccion Origen</Form.Label>
              <Form.Control
                placeholder="direccion  origen"
                disabled
              ></Form.Control>
            </Form.Group>
          </Card.Text>
        </Card>
      </Container>
      <Footer></Footer>
    </>
  );
}

export default UserPage;

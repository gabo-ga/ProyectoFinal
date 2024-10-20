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


function addOrder(){
    return(
        <>
        <Header></Header>
        <Container fluid className={styles.body}>
            <Row className={styles.rowContainer}>
        <h4>Añadir pedido</h4>
            </Row>
            <Row className={styles.rowContainer}>
                <Card className={styles.cardContainer}>
                <Form className={styles.formContainer}>
                    <Form.Group>
                        <Form.Label>DIRECCION:</Form.Label>
                        <AddressSearch></AddressSearch>
                    </Form.Group>
                    <CustomerSelect></CustomerSelect>
                    <Form.Group>
                        <Form.Label>PRECIO:</Form.Label>
                        <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    <DateFormComponent></DateFormComponent>
                    <TimeFormComponent></TimeFormComponent>
                    <Form.Group>
                        <Form.Label>DESCRIPCION:</Form.Label>
                        <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    <Form.Group className={styles.buttonsContainer}>
                    <CancelButton></CancelButton>
                    <AcceptButton></AcceptButton>
                    </Form.Group>
                </Form>
                </Card>
            </Row>
        </Container>
        <Footer></Footer>
        </>
    );
}

export default addOrder;
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import { Card, Col, Container, Row } from "react-bootstrap";
import styles from "./index.module.css";
import { Form } from "react-bootstrap";
import CancelButton from "../../components/CancelButton";
import AcceptButton from "../../components/AcceptButton";
import AddressSearch from "../../components/AddressSearch";


function addOrder(){
    return(
        <>
        <Header></Header>
        <Container fluid className={styles.body}>
            <Row>
        <h4>Añadir pedido</h4>
            </Row>
            <Row>
                <Card>
                <Form>
                    <AddressSearch></AddressSearch>
                    <Form.Group>
                        <Form.Label>DIRECCION:</Form.Label>
                        <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>CLIENTE:</Form.Label>
                        <Form.Select></Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>PRECIO:</Form.Label>
                        <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>FECHA DE ENTREGA</Form.Label>
                        <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>DESCRIPCION:</Form.Label>
                        <Form.Control type="text"></Form.Control>
                    </Form.Group>
                    <CancelButton></CancelButton>
                    <AcceptButton></AcceptButton>
                </Form>
                </Card>
            </Row>
        </Container>
        <Footer></Footer>
        </>
    );
}

export default addOrder;
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import styles from "./index.module.css";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import AddButton from "../../components/AddButton/button";
import ActionBar from "../../components/ActionsBar/Actions";
import Order from "../../components/OrderListComponent";

function OrdersHistory() {
  return (
    <>
      <Header></Header>
      <Container fluid className={styles.body}>
        <Row className="w-100">
          <Col xs={10} md={11}>
            <h4>GESTION DE PEDIDOS</h4>
          </Col>
          <Col xs={2} md={1}>
            <AddButton></AddButton>
          </Col>
        </Row>
        <Row className={styles.row}>
          <ActionBar></ActionBar>
          <Order></Order>
        </Row>
      </Container>
      <Footer></Footer>
    </>
  );
}

export default OrdersHistory;

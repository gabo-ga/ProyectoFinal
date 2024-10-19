import Card from "react-bootstrap/esm/Card";
import styles from "./logout.module.css";
import { XLg } from "react-bootstrap-icons";

function Logout({ onClose }) {
  return (
    <Card className={styles.cardStyle}>
      <Card.Body>
        <XLg className={styles.closeButton} onClick={onClose}>
          &times;
        </XLg>
        <Card.Title className={styles.textStyle}>Hola usuario</Card.Title>
        <Card.Text className={styles.textStyle}>Configuracion</Card.Text>
        <Card.Text className={styles.textStyle}>Cerrar Sesion</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Logout;

import Card from "react-bootstrap/esm/Card";
import styles from "./logout.module.css";
import { XLg } from "react-bootstrap-icons";
import React, {useEffect, useState} from "react";
import axios from "axios";

function Logout({ onClose }) {
   const [user, setUser] = useState(null);

   useEffect(() => {
     const fetchUserData = async () => {
       try {
         const response = await axios.get("http://localhost:8000/api/v1/users/1");
         setUser(response.data);
       } catch (error) {
         console.error("Error fetching user data:", error);
       }
     };
 
     fetchUserData();
   }, []);

  return (
    <Card className={styles.cardStyle}>
      <Card.Body className={styles.cardContainer}>
        <div className={styles.closeContainer}>
        <XLg className={styles.closeButton} onClick={onClose}>
          &times;
        </XLg>
        </div>
        <Card.Title className={styles.textStyle}>{user ? `Hola ${user.first_name}` : "Cargando..."}</Card.Title>
        <Card.Text className={styles.textStyle}>Configuracion</Card.Text>
        <Card.Text className={styles.textStyle}>Cerrar Sesion</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Logout;

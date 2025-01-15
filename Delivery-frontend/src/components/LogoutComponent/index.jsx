import Card from "react-bootstrap/esm/Card";
import styles from "./logout.module.css";
import { XLg } from "react-bootstrap-icons";
import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../../axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

function Logout({ onClose }) {
  const [user, setUser] = useState(null);
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:8000/api/users/1"
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/logout/"); // Endpoint del backend
      //localStorage.removeItem("access_token"); // Opcional si tienes JWT almacenados
      //localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const userId = 1;
  return (
    <Card className={styles.cardStyle}>
      <Card.Body className={styles.cardContainer}>
        <div className={styles.closeContainer}>
          <XLg className={styles.closeButton} onClick={onClose}>
            &times;
          </XLg>
        </div>
        <Card.Title className={styles.textStyle}>
          {user ? `Hola ${user.first_name}` : "Cargando..."}
        </Card.Title>
        <Card.Text className={styles.textStyle}>
          <Link to="/user">Configuracion</Link>{" "}
        </Card.Text>
        <Card.Text
          className={styles.textStyle}
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          Cerrar Sesión
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Logout;

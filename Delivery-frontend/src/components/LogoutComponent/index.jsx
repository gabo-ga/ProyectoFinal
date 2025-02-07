import Card from "react-bootstrap/esm/Card";
import styles from "./logout.module.css";
import { XLg } from "react-bootstrap-icons";
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

function Logout({ onClose }) {
  const { authTokens, logoutUser, username } = useContext(AuthContext);

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/login";
  };

  const user = authTokens
    ? {
        nombre: authTokens,
      }
    : null;

  return (
    <Card className={styles.cardStyle}>
      <Card.Body className={styles.cardContainer}>
        <div className={styles.closeContainer}>
          <XLg className={styles.closeButton} onClick={onClose}>
            &times;
          </XLg>
        </div>
        <Card.Title className={styles.textStyle}>
          {user ? `Hola ${username}` : "Cargando..."}
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

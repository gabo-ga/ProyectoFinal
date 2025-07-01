import React from "react";
import { Button } from "react-bootstrap";
import styles from "./index.module.css";

function LoginButton() {
  return (
    <Button className={styles.LoginButton} variant="warning" type="submit">
      INICIAR SESIÓN
    </Button>
  );
}

export default LoginButton;

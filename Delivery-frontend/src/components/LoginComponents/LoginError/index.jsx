import React from "react";
import { Alert } from "react-bootstrap";

function LoginError({ message, variant = "danger" }) {
  return <Alert variant={variant}>{message}</Alert>;
}

export default LoginError;

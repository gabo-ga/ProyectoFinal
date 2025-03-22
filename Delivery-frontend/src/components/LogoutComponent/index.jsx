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
    
    <div className="absolute z-50">
      <div className="bg-[#1abc9c] w-38 flex flex-col fixed rounded-lg p-3 lg:w-44">
        <div className="flex flex-col">
        <div className="flex justify-end">
            <XLg 
              className="cursor-pointer" 
              onClick={onClose}
            />
          </div>
          <p className="text-white mb-0 p-1 text-md lg:text-xl">
            <strong>{user ? `Hola ${username}` : "Cargando..."}</strong>
          </p>
          <p className="text-white mb-0 p-1 text-sm lg:text-md">
          <Link to="/user">Configuracion</Link>
        </p>
        <p
          className="text-white mb-0 p-1 cursor-pointer text-sm lg:text-md"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </p>
        </div>
      </div>
      </div>
  );
}

export default Logout;

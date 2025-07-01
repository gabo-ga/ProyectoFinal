import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UsernameInput from "../../components/LoginComponents/userNameInput";
import PasswordInput from "../../components/LoginComponents/PasswordInput";
import LoginButton from "../../components/LoginComponents/LoginButton";
import LoginError from "../../components/LoginComponents/LoginError";
import { useAuth } from "../../AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      await loginUser(username, password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMessage("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            INICIAR SESIÓN
          </h2>
          
          {errorMessage && (
            <div className="mt-4">
              <LoginError message={errorMessage} />
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <UsernameInput value={username} onChange={setUsername} />
              <PasswordInput value={password} onChange={setPassword} />
            </div>

            <div>
              <LoginButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

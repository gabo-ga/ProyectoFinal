import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import UsernameInput from "../../components/LoginComponents/userNameInput";
import PasswordInput from "../../components/LoginComponents/PasswordInput";
import LoginButton from "../../components/LoginComponents/LoginButton";
import LoginError from "../../components/LoginComponents/LoginError";
import { useAuth } from "../../AuthContext";

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const onSubmit = async (data) => {
    try {
      await loginUser(data.username, data.password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("root", {
        type: "manual",
        message: "Usuario o contraseña incorrectos"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#1abc9c] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            INICIAR SESIÓN
          </h2>
          
          {errors.root && (
            <div className="mt-4">
              <LoginError message={errors.root.message} />
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm space-y-4">
              <UsernameInput
                {...register("username", {
                  required: "El usuario es requerido",
                  minLength: {
                    value: 3,
                    message: "El usuario debe tener al menos 3 caracteres"
                  }
                })}
                error={errors.username}
              />
              <PasswordInput
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres"
                  }
                })}
                error={errors.password}
              />
            </div>

            <LoginButton />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

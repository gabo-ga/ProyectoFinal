import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = forwardRef(({ error, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Contraseña
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c]
            ${error ? 'border-red-500' : 'border-[#bdbdbd]'}`}
          placeholder="Ingrese su contraseña"
          ref={ref}
          {...props}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error.message}</p>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;

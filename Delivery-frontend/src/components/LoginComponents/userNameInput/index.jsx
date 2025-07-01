import React, { forwardRef } from "react";

const UsernameInput = forwardRef(({ error, ...props }, ref) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Usuario
      </label>
      <input
        type="text"
        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1abc9c] 
          ${error ? 'border-red-500' : 'border-[#bdbdbd]'}`}
        placeholder="Ingrese su usuario"
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error.message}</p>
      )}
    </div>
  );
});

UsernameInput.displayName = 'UsernameInput';

export default UsernameInput;

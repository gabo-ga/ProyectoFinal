import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function PrivateRoute({ children }) {
  const { authTokens } = useContext(AuthContext);

  return authTokens ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;

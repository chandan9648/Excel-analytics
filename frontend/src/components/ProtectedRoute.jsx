import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';


const ProtectedRoute = ({ children }) => {
  const {user} = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

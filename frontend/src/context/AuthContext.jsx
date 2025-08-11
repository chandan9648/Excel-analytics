/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useMemo } from 'react';
import {jwtDecode} from 'jwt-decode';
import API from '../api';



const API_Base_URL = "http://localhost:5000";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
    const [loading] = useState(true); 

      // Logout = Remove token + reset user
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expiryTime");
    setUser(null);
    window.location.href = "/login"; // Redirect to login page
  };

  
    // Login = Save token + set user
  const login = (token) => {
    const decoded = jwtDecode(token);
    const expiryTime =  decoded.exp*1000;

    sessionStorage.setItem("expiryTime", expiryTime);
    sessionStorage.setItem("token", token);
    setUser(decoded);

    // auto logout
    const timeout = expiryTime - Date.now();
    setTimeout(logout, timeout);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const expiryTime = Number(sessionStorage.getItem("expiryTime"));

    if (token && expiryTime) {
      if (Date.now() >= expiryTime) {
        logout();
      } else {
        setUser(jwtDecode(token));
        const timeout = expiryTime - Date.now();
        setTimeout(logout, timeout);
      }
    }

    // Logout on tab/browser close
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("expiryTime");
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  
  const contextValue = useMemo(() => ({ user, login, logout, loading }), [user, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useMemo } from 'react';
import {jwtDecode} from 'jwt-decode';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.log('Invalid token:', err);
        localStorage.removeItem('token');
      }
    }
  }, []);

    // Login = Save token + set user
  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  
  // Logout = Remove token + reset user
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const contextValue = useMemo(() => ({ user, login, logout, }), [user]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

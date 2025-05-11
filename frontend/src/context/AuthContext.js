import { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens'))
      : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem('authTokens')
      ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access)
      : null
  );

  const loginUser = async (email, password) => {
    try {
      const res = await axios.post('auth/token/', { email, password });

      const tokens = res.data.data;
      setAuthTokens(tokens);
      setUser(jwtDecode(tokens.access));
      localStorage.setItem('authTokens', JSON.stringify(tokens));

      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    toast.success('Logout successful');
  };

  const contextData = {
    user,
    loginUser,
    logoutUser,
    authTokens,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};

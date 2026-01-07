import { createContext, useContext, useState, useEffect } from "react";
import { getDecodedUser, clearDecodedUser } from "../utils/jwtUtils";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  // ✅ Restore user from localStorage on load
  const [auth, setAuth] = useState(() => getDecodedUser());

  const logout = () => {
    clearDecodedUser();
    setAuth(null);
  };

  // ✅ Safety: resync auth if localStorage changes
  useEffect(() => {
    setAuth(getDecodedUser());
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

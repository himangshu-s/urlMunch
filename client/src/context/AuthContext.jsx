import { createContext, useContext, useEffect, useState } from "react";
import { refreshAccessToken, getCurrentUser } from "../services/auth.service";
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const data = await refreshAccessToken();

        const newAccessToken = data.data.accessToken;

        setAccessToken(newAccessToken);

        const userData = await getCurrentUser(newAccessToken);

        setUser(userData.data);
      } catch (error) {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = (data) => {
    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };

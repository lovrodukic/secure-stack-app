import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [oauthToken, setOauthToken] = useState(null);

  const handleLogin = async (token) => {
    document.cookie = `token=${token}`;
    setToken(token);
    navigate("/landing");
  };

  const handleLogout = () => {
    document.cookie = `token=${null}`;
    setToken(null);
  };

  const getJWT = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token) setToken(token);
  };

  const setOauthContext = async (oauth_token) => {
    document.cookie = `oauth_token=${oauth_token}`;
    setOauthToken(oauth_token);
  };

  const auth = {
    token,
    oauthToken,
    onLogin: handleLogin,
    onLogout: handleLogout,
    getToken: getJWT,
    setOauthContext: setOauthContext,
  };

  return (
    <AuthContext.Provider value={{ auth }}>{children}</AuthContext.Provider>
  );
};

// give callers access to the context
export const useAuth = () => useContext(AuthContext);

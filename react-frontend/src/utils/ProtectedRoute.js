import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  //   const token = document.cookie
  //     .split("; ")
  //     .find((row) => row.startsWith("oauth_token="))
  //     ?.split("=")[1];
  //   console.log(token);
  console.log(auth);

  //   if (!auth.token && !token) {
  //     return <Navigate to="/home" replace />;
  //   }

  if (!auth.token || auth.token === "null") {
    return <Navigate to="/home" replace />;
  }
  return children;
};

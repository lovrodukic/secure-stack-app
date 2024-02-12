import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  const token = localStorage.getItem("access_token");

  if (!auth.token && token !== "access_token") {
    return <Navigate to="/home" replace />;
  }

  if (!auth.token) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

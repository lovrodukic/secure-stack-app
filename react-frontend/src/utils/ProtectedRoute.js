import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if ((!auth.token || auth.token === "null") && (!token || token === "null")) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

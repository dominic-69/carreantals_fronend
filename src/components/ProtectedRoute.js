import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("access");

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    } else {
      localStorage.removeItem("user");
    }
  } catch (err) {
    console.log("Invalid user");
    localStorage.removeItem("user");
  }

  if (!token) return <Navigate to="/login" />;

  if (role && user?.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
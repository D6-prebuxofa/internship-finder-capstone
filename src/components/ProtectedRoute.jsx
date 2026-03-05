import { Navigate } from "react-router-dom";

const getDashboardPath = (role) => {
  if (role === "company") return "/company/dashboard";
  if (role === "admin") return "/admin/dashboard";
  return "/dashboard";
};

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.isActive === false) {
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;

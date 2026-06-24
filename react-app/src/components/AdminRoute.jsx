import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AdminRoute({ children }) {

  const token =
    localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

let decoded;

try {

  decoded =
    jwtDecode(token);

} catch {

  localStorage.removeItem(
    "token"
  );

  return (
    <Navigate
      to="/login"
    />
  );
}

  console.log(decoded);

  if (
    decoded.role !== "admin"
  ) {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;
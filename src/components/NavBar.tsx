import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <nav
      className="d-flex justify-content-between align-items-center px-4 py-3"
      style={{ backgroundColor: "#2b1d12", borderBottom: "1px solid #4e342e" }}
    >
      <div className="d-flex align-items-center gap-4">
        <Link to="/" className="text-decoration-none fw-bold" style={{ color: "#d7ccc8" }}>
          <i className="bi bi-music-note-beamed me-2"></i>
          Studio Track Manager
        </Link>
        {user.role === "ADMIN" && (
          <Link to="/admin/usuarios" className="text-decoration-none" style={{ color: "#a1887f" }}>
            Administración
          </Link>
        )}
      </div>
      <div className="d-flex align-items-center gap-3">
        <span style={{ color: "#a1887f" }}>
          {user.username} ({user.role})
        </span>
        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default NavBar;

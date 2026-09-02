import { useAuth } from "../auth/AuthContext";
import FilaUsuario from "../components/FilaUsuario";
import { useUsuarios } from "./hooks/useUsuarios";

function AdminUsersPage() {
  const { usuarios, cargando, error, actualizarUsuario, borrarUsuario } = useUsuarios();
  const { user } = useAuth();

  if (cargando) {
    return (
      <div className="container mt-5">
        <h1 className="text-white">Cargando usuarios...</h1>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 card-estudio p-4">
          <div
            className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3"
            style={{ borderColor: "#4e342e" }}
          >
            <h2 className="fw-bold mb-0" style={{ color: "#d7ccc8" }}>
              Administración de usuarios
            </h2>
            <span className="badge rounded-pill" style={{ backgroundColor: "#4e342e" }}>
              {usuarios.length} usuarios
            </span>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <div className="table-responsive">
            <table className="table table-hover align-middle table-estudio">
              <thead>
                <tr className="text-uppercase small">
                  <th className="py-3">Usuario</th>
                  <th className="py-3">Rol</th>
                  <th className="py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <FilaUsuario
                    key={usuario.idUsuario}
                    usuario={usuario}
                    esUsuarioActual={usuario.username === user?.username}
                    onGuardar={(cambios) => actualizarUsuario(usuario.idUsuario, cambios)}
                    onBorrar={() => borrarUsuario(usuario.idUsuario)}
                  />
                ))}
              </tbody>
            </table>
            {usuarios.length === 0 && (
              <p className="text-center text-muted my-4">No hay usuarios para mostrar.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsersPage;

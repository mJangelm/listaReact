import { useState } from "react";
import type { Role } from "../auth/AuthContext";
import type { Usuario } from "../pages/hooks/useUsuarios";

interface FilaUsuarioProps {
  usuario: Usuario;
  esUsuarioActual: boolean;
  onGuardar: (cambios: { username: string; role: Role }) => void;
  onBorrar: () => void;
}

function FilaUsuario({ usuario, esUsuarioActual, onGuardar, onBorrar }: FilaUsuarioProps) {
  const [username, setUsername] = useState(usuario.username);
  const [role, setRole] = useState<Role>(usuario.role);

  const hayCambios = username !== usuario.username || role !== usuario.role;

  return (
    <tr>
      <td>
        <input
          className="form-control form-control-sm"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </td>
      <td>
        <select
          className="form-select form-select-sm"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </td>
      <td className="text-center">
        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn btn-success btn-sm"
            disabled={!hayCambios}
            onClick={() => onGuardar({ username, role })}
          >
            Guardar
          </button>
          <button
            className="btn btn-danger btn-sm"
            disabled={esUsuarioActual}
            title={esUsuarioActual ? "No puedes eliminar tu propia cuenta" : undefined}
            onClick={onBorrar}
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}

export default FilaUsuario;

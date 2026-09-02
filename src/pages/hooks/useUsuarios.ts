import { useEffect, useState } from "react";
import { apiFetch } from "../../api/http";
import type { Role } from "../../auth/AuthContext";

export interface Usuario {
  idUsuario: number;
  username: string;
  role: Role;
}

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    setCargando(true);
    apiFetch("/admin/usuarios")
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error cargando usuarios:", err);
        setCargando(false);
      });
  };

  const actualizarUsuario = (id: number, cambios: { username: string; role: Role }) => {
    setError(null);
    return apiFetch(`/admin/usuarios/${id}`, {
      method: "PUT",
      body: JSON.stringify(cambios),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((mensaje) => {
            throw new Error(mensaje);
          });
        }
        return res.json();
      })
      .then((actualizado: Usuario) => {
        setUsuarios((prev) =>
          prev.map((u) => (u.idUsuario === id ? actualizado : u)),
        );
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const borrarUsuario = (id: number) => {
    setError(null);
    return apiFetch(`/admin/usuarios/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((mensaje) => {
            throw new Error(mensaje);
          });
        }
        setUsuarios((prev) => prev.filter((u) => u.idUsuario !== id));
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return { usuarios, cargando, error, actualizarUsuario, borrarUsuario };
}

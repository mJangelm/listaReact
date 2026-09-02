import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { API_BASE_URL, limpiarSesion } from "../api/http";

export type Role = "USER" | "ADMIN";

export interface AuthUser {
  username: string;
  role: Role;
}

interface AuthResponse {
  token: string;
  username: string;
  role: Role;
}

interface AuthContextValue {
  user: AuthUser | null;
  cargando: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function extraerMensajeError(res: Response): Promise<string> {
  const texto = await res.text();
  return texto || "No se pudo completar la operación";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setCargando(false);
  }, []);

  const guardarSesion = (data: AuthResponse) => {
    const nuevoUsuario: AuthUser = { username: data.username, role: data.role };
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(nuevoUsuario));
    setUser(nuevoUsuario);
  };

  const autenticar = async (path: string, username: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      throw new Error(await extraerMensajeError(res));
    }

    guardarSesion(await res.json());
  };

  const login = (username: string, password: string) =>
    autenticar("/auth/login", username, password);

  const register = (username: string, password: string) =>
    autenticar("/auth/register", username, password);

  const logout = () => {
    limpiarSesion();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, cargando, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return contexto;
}

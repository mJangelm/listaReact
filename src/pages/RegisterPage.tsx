import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setEnviando(true);
    try {
      await register(username, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <div className="card-estudio p-4">
        <h2 className="fw-bold mb-4 text-center" style={{ color: "#d7ccc8" }}>
          Crear cuenta
        </h2>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-white-50">Usuario</label>
            <input
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-white-50">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-white-50">Confirmar contraseña</label>
            <input
              type="password"
              className="form-control"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary w-100" type="submit" disabled={enviando}>
            {enviando ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <p className="text-center mt-3 mb-0 text-white-50">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

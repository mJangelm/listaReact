import { useState, useEffect } from "react";
import ItemTrack from "./itemTrack";
import ContadorFrutas from "./ContadorFrutas";

// 1. Interfaz de TypeScript actualizada con el nuevo campo
interface Track {
  idTrack: number;
  title: string;
  bpm: number;
  genero: string;
}

function ListasTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [title, setTitulo] = useState("");
  const [edit, setEdit] = useState<number | null>(null);
  const [bpm, setBpm] = useState(120);

  // Estados añadidos para la gestión del género
  const [genero, setGenero] = useState("");
  const [generoFiltro, setGeneroFiltro] = useState<string>("TODOS");

  const [cargando, setCargando] = useState(true);

  // Hook useEffect que reacciona de forma automática cada vez que cambia el filtro
  useEffect(() => {
    const url =
      generoFiltro === "TODOS"
        ? "http://localhost:8087/"
        : `http://localhost:8087/genero/${generoFiltro}`;

    setCargando(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setTracks(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error conectando con Java:", err);
        setCargando(false);
      });
  }, [generoFiltro]);

  const añadirTrack = () => {
    if (title.trim() === "") {
      alert("El título no puede estar vacío");
      return;
    }

    // Enviamos el objeto mapeado exactamente igual que la entidad de Java
    const nuevoTrack = {
      title: title,
      bpm: bpm,
      genero: genero.trim() === "" ? "Por definir" : genero,
    };

    fetch("http://localhost:8087/alta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoTrack),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error en el servidor al añadir el track");
        return res.json();
      })
      .then((trackGuardado) => {
        // Añadimos a la vista solo si encaja en el filtro activo actual
        if (
          generoFiltro === "TODOS" ||
          generoFiltro.toLowerCase() === trackGuardado.genero.toLowerCase()
        ) {
          setTracks([...tracks, trackGuardado]);
        }

        // Limpieza de inputs
        setTitulo("");
        setBpm(120);
        setGenero("");
      })
      .catch((err) => {
        console.error("Hubo un problema con la operación fetch:", err);
        alert(
          "No se pudo conectar con el servidor. Revisa si Java está corriendo.",
        );
      });
  };

  const borrarTrack = (idABorrar: number) => {
    fetch(`http://localhost:8087/${idABorrar}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setTracks(tracks.filter((track) => track.idTrack !== idABorrar));
        } else {
          alert("No se pudo borrar el track en el servidor");
        }
      })
      .catch((err) => console.error("Error al borrar:", err));
  };

  const prepararEdicion = (track: Track) => {
    setTitulo(track.title);
    setBpm(track.bpm);
    setGenero(track.genero);
    setEdit(track.idTrack);
  };

  const cancelar = () => {
    setEdit(null);
    setTitulo("");
    setBpm(120);
    setGenero("");
  };

  const guardarCambios = () => {
    const tracksActualizados = tracks.map((t) => {
      if (t.idTrack === edit) {
        return { ...t, title: title, bpm: bpm, genero: genero };
      }
      return t;
    });

    setTracks(tracksActualizados);
    setEdit(null);
    setTitulo("");
    setBpm(120);
    setGenero("");
  };

  if (cargando)
    return (
      <div className="container mt-5">
        <h1 className="text-white">Cargando estudio...</h1>
      </div>
    );

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 card-estudio p-4">
          {/* Header */}
          <div
            className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3"
            style={{ borderColor: "#4e342e" }}
          >
            <h2 className="fw-bold mb-0" style={{ color: "#d7ccc8" }}>
              <i className="bi bi-music-note-beamed me-2"></i>
              Studio Track Manager
            </h2>
            <span
              className="badge rounded-pill"
              style={{ backgroundColor: "#4e342e" }}
            >
              {tracks.length} Tracks mostrados
            </span>
          </div>

          {/* BOTONES DE FILTRADO RÁPIDO */}
          <div className="mb-4 d-flex gap-2">
            <button
              className={`btn btn-sm ${generoFiltro === "TODOS" ? "btn-light" : "btn-outline-light"}`}
              onClick={() => setGeneroFiltro("TODOS")}
            >
              Todos
            </button>
            <button
              className={`btn btn-sm ${generoFiltro === "Death Metal" ? "btn-light" : "btn-outline-light"}`}
              onClick={() => setGeneroFiltro("Death Metal")}
            >
              Death Metal
            </button>
            <button
              className={`btn btn-sm ${generoFiltro === "Thrash" ? "btn-light" : "btn-outline-light"}`}
              onClick={() => setGeneroFiltro("Thrash")}
            >
              Thrash
            </button>
          </div>

          {/* Formulario de entrada */}
          <div className="row g-2 mb-5 bg-dark bg-opacity-25 p-3 rounded shadow-sm">
            <div className="col-md-5">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Nombre del track..."
                value={title}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            {/* INPUT NUEVO PARA EL GÉNERO */}
            <div className="col-md-3">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Género (Ej: Death Metal)..."
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <div className="input-group">
                <span className="input-group-text bg-transparent text-white border-secondary">
                  BPM
                </span>
                <input
                  className="form-control form-control-lg"
                  type="number"
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="col-md-2 d-grid">
              <button
                className={
                  edit ? "btn btn-success btn-lg" : "btn btn-primary btn-lg"
                }
                onClick={edit ? guardarCambios : añadirTrack}
              >
                {edit ? "Actualizar" : "Añadir"}
              </button>
            </div>
            {edit && (
              <div className="col-12 mt-2">
                <button
                  className="btn btn-link text-white-50 btn-sm"
                  onClick={cancelar}
                >
                  Cancelar edición
                </button>
              </div>
            )}
          </div>

          {/* Tabla de Datos */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead style={{ borderBottom: "2px solid #8d6e63" }}>
                <tr className="text-uppercase small ls-wide">
                  <th className="py-3">ID</th>
                  <th className="py-3">Título de la Canción</th>
                  <th className="py-3">Género</th>
                  <th className="py-3 text-center">BPM</th>
                  <th className="py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tracks.map((track) => (
                  <ItemTrack
                    key={track.idTrack}
                    id={track.idTrack}
                    titulo={track.title}
                    genero={track.genero}
                    bpm={track.bpm}
                    onBorrar={() => borrarTrack(track.idTrack)}
                    onEditar={() => prepararEdicion(track)}
                  />
                ))}
              </tbody>
            </table>
            {tracks.length === 0 && (
              <p className="text-center text-muted my-4">
                No hay tracks para mostrar con este filtro.
              </p>
            )}
          </div>

          {/* Footer */}
          <div
            className="mt-4 pt-3 border-top d-flex justify-content-between"
            style={{ borderColor: "#4e342e" }}
          >
            <ContadorFrutas numero={tracks.length} />
            <small className="text-muted">
              v1.1 Powered by Java Streams & React
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListasTracks;

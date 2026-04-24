import { useState, useEffect } from "react";
import ItemTrack from "./itemTrack";
import ContadorFrutas from "./ContadorFrutas";

interface Track {
  idTrack: number;
  title: string;
  bpm: number;
}

function ListasTracks() {
  const [tracks, setTracks] = useState<Track[]>(() => {
    const guardado = localStorage.getItem("mis_tracks");
    return guardado ? JSON.parse(guardado) : [];
  });
  const [title, setTitulo] = useState("");
  const [edit, setEdit] = useState<number | null>(null);
  const [bpm, setBpm] = useState(120);
  const [cargando, setCargando] = useState(true);

  // Solo necesitamos este para guardar cada vez que cambie la lista
  /*   useEffect(() => {
    localStorage.setItem("mis_tracks", JSON.stringify(tracks));
  }, [tracks]); */

  useEffect(() => {
    fetch("http://localhost:8087")
      .then((res) => res.json())
      .then((data) => {
        setTracks(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error conectando con Java:", err);
        setCargando(false);
      });
  }, []);

  // Tu useEffect del "Cargando" ahora solo sirve para el efecto visual
  useEffect(() => {
    setTimeout(() => {
      setCargando(false);
    }, 800);
  }, []);

  const añadirTrack = () => {
    // 1. Validación simple para no enviar campos vacíos
    if (title.trim() === "") {
      alert("El título no puede estar vacío");
      return;
    }

    // 2. Creamos el objeto con los nombres exactos que espera Java
    const nuevoTrack = {
      title: title,
      bpm: bpm,
    };

    // 3. Petición POST al servidor
    fetch("http://localhost:8087/alta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoTrack),
    })
      .then((res) => {
        if (!res.ok) {
          // Si el servidor responde con error (ej. 409 o 400)
          throw new Error("Error en el servidor al añadir el track");
        }
        return res.json();
      })
      .then((trackGuardado) => {
        // 4. Actualizamos el estado de React con el objeto que viene de la DB
        // Este objeto ya incluye el idTrack real generado por MySQL
        setTracks([...tracks, trackGuardado]);

        // 5. Limpiamos los inputs
        setTitulo("");
        setBpm(120);
      })
      .catch((err) => {
        console.error("Hubo un problema con la operación fetch:", err);
        alert(
          "No se pudo conectar con el servidor. Revisa si Java está corriendo.",
        );
      });
  };
  const borrarTrack = (idABorrar: number) => {
    // 1. Llamada a la API
    fetch(`http://localhost:8087/${idABorrar}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          // 2. Si Java dice OK, lo quitamos de la vista de React
          setTracks(tracks.filter((track) => track.idTrack !== idABorrar));
        } else {
          alert("No se pudo borrar el track en el servidor");
        }
      })
      .catch((err) => console.error("Error al borrar:", err));
  };
  const prepararEdicion = (track: Track) => {
    setTitulo(track.title); // El nombre de la canción sube al input
    setBpm(track.bpm); // El BPM sube al input
    setEdit(track.idTrack); // Guardamos el ID para saber que ESTAMOS EDITANDO
  };

  const cancelar = () => {
    setEdit(null); // Salimos del modo edición
    setTitulo(""); // Limpiamos
    setBpm(120);
  };
  const guardarCambios = () => {
    // 1. Buscamos en la lista y actualizamos el que coincida
    const tracksActualizados = tracks.map((t) => {
      if (t.idTrack === edit) {
        // Si este es el que estamos editando, devolvemos los datos nuevos de los inputs
        return { ...t, titulo: title, bpm: bpm };
      }
      return t; // Si no es el que editamos, lo dejamos tal cual
    });

    setTracks(tracksActualizados); // Guardamos la lista nueva
    setEdit(null); // Salimos del modo edición
    setTitulo(""); // Limpiamos
    setBpm(120);
  };

  if (cargando)
    return (
      <div className="container mt-5">
        <h1>Cargando estudio...</h1>
      </div>
    );

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 card-estudio p-4">
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
              {tracks.length} Tracks en total
            </span>
          </div>

          {/* Formulario de entrada */}
          <div className="row g-2 mb-5 bg-dark bg-opacity-25 p-3 rounded shadow-sm">
            <div className="col-md-7">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Nombre del track..."
                value={title}
                onChange={(e) => setTitulo(e.target.value)}
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
            <div className="col-md-3 d-grid">
              <button
                className={
                  edit ? "btn btn-success btn-lg" : "btn btn-primary btn-lg"
                }
                onClick={edit ? guardarCambios : añadirTrack}
              >
                {edit ? "Actualizar" : "Añadir Track"}
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
                    bpm={track.bpm}
                    onBorrar={() => borrarTrack(track.idTrack)}
                    onEditar={() => prepararEdicion(track)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div
            className="mt-4 pt-3 border-top d-flex justify-content-between"
            style={{ borderColor: "#4e342e" }}
          >
            <ContadorFrutas numero={tracks.length} />
            <small className="text-muted">v1.0 Powered by Java & React</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListasTracks;

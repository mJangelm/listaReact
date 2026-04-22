import { useState, useEffect } from "react";
import ItemTrack from "./itemTrack";
import ContadorFrutas from "./ContadorFrutas";

interface Track {
  id: number;
  titulo: string;
  bpm: number;
}

function ListasTracks() {
  const [tracks, setTracks] = useState<Track[]>(() => {
    const guardado = localStorage.getItem("mis_tracks");
    return guardado ? JSON.parse(guardado) : [];
  });
  const [titulo, setTitulo] = useState("");
  const [edit, setEdit] = useState<number | null>(null);
  const [bpm, setBpm] = useState(120);
  const [cargando, setCargando] = useState(true);

  // Solo necesitamos este para guardar cada vez que cambie la lista
  useEffect(() => {
    localStorage.setItem("mis_tracks", JSON.stringify(tracks));
  }, [tracks]);

  // Tu useEffect del "Cargando" ahora solo sirve para el efecto visual
  useEffect(() => {
    setTimeout(() => {
      setCargando(false);
    }, 800);
  }, []);

  const añadirTrack = () => {
    if (titulo.trim() === "") return;

    const nuevoTrack: Track = {
      id: Date.now(),
      titulo: titulo,
      bpm: bpm,
    };

    setTracks([...tracks, nuevoTrack]);
    setTitulo("");
    setBpm(120);
  };

  const borrarTrack = (idABorrar: number) => {
    setTracks(tracks.filter((track) => track.id !== idABorrar));
  };

  const prepararEdicion = (track: Track) => {
    setTitulo(track.titulo); // El nombre de la canción sube al input
    setBpm(track.bpm); // El BPM sube al input
    setEdit(track.id); // Guardamos el ID para saber que ESTAMOS EDITANDO
  };

  const cancelar = () => {
    setEdit(null); // Salimos del modo edición
    setTitulo(""); // Limpiamos
    setBpm(120);
  };
  const guardarCambios = () => {
    // 1. Buscamos en la lista y actualizamos el que coincida
    const tracksActualizados = tracks.map((t) => {
      if (t.id === edit) {
        // Si este es el que estamos editando, devolvemos los datos nuevos de los inputs
        return { ...t, titulo: titulo, bpm: bpm };
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
    <div className="container mt-5">
      <h2 className="mb-4">Studio Track Manager</h2>

      {/* Formulario de entrada con Bootstrap */}
      <div className="input-group mb-4">
        <input
          className="form-control"
          type="text"
          placeholder="Nombre del track"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          onKeyDown={
            edit
              ? (e) => e.key === "Enter" && guardarCambios()
              : (e) => e.key === "Enter" && añadirTrack()
          }
        />
        <input
          className="form-control"
          style={{ maxWidth: "100px" }}
          type="number"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
        />
        <button
          className={edit ? "btn btn-success" : "btn btn-primary"}
          onClick={edit ? guardarCambios : añadirTrack}
        >
          {edit ? "Guardar Cambios" : "Añadir Track"}
        </button>
        {edit && <button onClick={cancelar}>Cancelar</button>}
      </div>

      {/* La Tabla de Datos */}
      <table className="table table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Título de la Canción</th>
            <th>BPM</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track) => (
            <ItemTrack
              key={track.id}
              id={track.id}
              titulo={track.titulo}
              bpm={track.bpm}
              onBorrar={() => borrarTrack(track.id)}
              onEditar={() => prepararEdicion(track)}
            />
          ))}
        </tbody>
      </table>

      <div className="mt-3 text-muted">
        <ContadorFrutas numero={tracks.length} />
      </div>
    </div>
  );
}

export default ListasTracks;

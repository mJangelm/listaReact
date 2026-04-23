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
    <div className="container mt-5">
      <h2 className="mb-4">Studio Track Manager</h2>

      {/* Formulario de entrada con Bootstrap */}
      <div className="input-group mb-4">
        <input
          className="form-control"
          type="text"
          placeholder="Nombre del track"
          value={title}
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

      <div className="mt-3 text-muted">
        <ContadorFrutas numero={tracks.length} />
      </div>
    </div>
  );
}

export default ListasTracks;

import { useState, useEffect } from "react";
import FiltrosGeneros from "../components/FiltroGeneros";
import FormularioTrack from "../components/TrackForm";
import TablaTracks from "./TablaTracks";
import FooterStudio from "./FooterStudio";

export interface Track {
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
  const [genero, setGenero] = useState("");
  const [generoFiltro, setGeneroFiltro] = useState<string>("TODOS");
  const [cargando, setCargando] = useState(true);

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

    const nuevoTrack = {
      title: title,
      bpm: bpm,
      genero: genero.trim() === "" ? "Por definir" : genero,
    };

    fetch("http://localhost:8087/alta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoTrack),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error en el servidor al añadir el track");
        return res.json();
      })
      .then((trackGuardado) => {
        if (
          generoFiltro === "TODOS" ||
          generoFiltro.toLowerCase() === trackGuardado.genero.toLowerCase()
        ) {
          setTracks([...tracks, trackGuardado]);
        }
        resetFormulario();
      })
      .catch((err) => {
        console.error("Hubo un problema con la operación fetch:", err);
        alert("No se pudo conectar con el servidor.");
      });
  };

  const borrarTrack = (idABorrar: number) => {
    fetch(`http://localhost:8087/${idABorrar}`, { method: "DELETE" })
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

  const resetFormulario = () => {
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
    resetFormulario();
  };

  if (cargando) {
    return (
      <div className="container mt-5">
        <h1 className="text-white">Cargando estudio...</h1>
      </div>
    );
  }

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

          <FiltrosGeneros
            generoFiltro={generoFiltro}
            setGeneroFiltro={setGeneroFiltro}
          />

          <FormularioTrack
            title={title}
            setTitulo={setTitulo}
            genero={genero}
            setGenero={setGenero}
            bpm={bpm}
            setBpm={setBpm}
            edit={edit}
            onGuardar={guardarCambios}
            onAñadir={añadirTrack}
            onCancelar={resetFormulario}
          />

          <TablaTracks
            tracks={tracks}
            onBorrar={borrarTrack}
            onEditar={prepararEdicion}
          />

          <FooterStudio totalTracks={tracks.length} />
        </div>
      </div>
    </div>
  );
}

export default ListasTracks;

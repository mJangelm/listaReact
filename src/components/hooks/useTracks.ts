import { useState, useEffect } from "react";

export interface Track {
  idTrack: number;
  title: string;
  bpm: number;
  genero: string;
}

export function useTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [title, setTitulo] = useState("");
  const [bpm, setBpm] = useState(120);
  const [genero, setGenero] = useState("");
  const [generoFiltro, setGeneroFiltro] = useState<string>("TODOS");
  const [edit, setEdit] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);

  // Cargar tracks por filtro
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
        if (!res.ok) throw new Error("Error en el servidor");
        return res.json();
      })
      .then((trackGuardado) => {
        if (
          generoFiltro === "TODOS" ||
          generoFiltro.toLowerCase() === trackGuardado.genero.toLowerCase()
        ) {
          setTracks([...tracks, trackGuardado]);
        }
        limpiarFormulario();
      })
      .catch((err) => console.error("Error al añadir:", err));
  };

  const borrarTrack = (idABorrar: number) => {
    fetch(`http://localhost:8087/${idABorrar}`, { method: "DELETE" })
      .then((res) => {
        if (res.ok) {
          setTracks(tracks.filter((track) => track.idTrack !== idABorrar));
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

  const guardarCambios = () => {
    const tracksActualizados = tracks.map((t) => {
      if (t.idTrack === edit) {
        return { ...t, title, bpm, genero };
      }
      return t;
    });

    setTracks(tracksActualizados);
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setEdit(null);
    setTitulo("");
    setBpm(120);
    setGenero("");
  };

  return {
    tracks,
    cargando,
    generoFiltro,
    setGeneroFiltro,
    form: { title, setTitulo, bpm, setBpm, genero, setGenero, edit },
    acciones: {
      añadirTrack,
      borrarTrack,
      prepararEdicion,
      guardarCambios,
      cancelarEdicion: limpiarFormulario,
    },
  };
}

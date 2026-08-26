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
  const [buscaGenero, setBuscaGenero] = useState("");
  const [edit, setEdit] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);

  // Cargar todos los tracks una vez al montar; el filtrado por género
  // se hace en memoria más abajo con tracksFiltrados
  useEffect(() => {
    setCargando(true);
    fetch("http://localhost:8087/")
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

  const añadirTrack = () => {
    if (title.trim() === "") {
      alert("El título no puede estar vacío");
      return;
    }

    const existeDuplicado = tracks.some(
      (t) => t.title.toLowerCase() === title.toLowerCase(),
    );
    if (existeDuplicado) {
      alert("Ese título ya existe");
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
        setTracks((prev) => [...prev, trackGuardado]);
        limpiarFormulario();
      })
      .catch((err) => console.error("Error al añadir:", err));
  };

  const borrarTrack = (idABorrar: number) => {
    fetch(`http://localhost:8087/${idABorrar}`, { method: "DELETE" })
      .then((res) => {
        if (res.ok) {
          setTracks((prev) =>
            prev.filter((track) => track.idTrack !== idABorrar),
          );
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
    if (edit === null) return;

    const trackActualizado = { idTrack: edit, title, bpm, genero };

    fetch(`http://localhost:8087/${edit}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trackActualizado),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error en el servidor al actualizar");
        return res.json();
      })
      .then((trackGuardado) => {
        setTracks((prev) =>
          prev.map((t) => (t.idTrack === edit ? trackGuardado : t)),
        );
        limpiarFormulario();
      })
      .catch((err) => console.error("Error al actualizar:", err));
  };

  const limpiarFormulario = () => {
    setEdit(null);
    setTitulo("");
    setBpm(120);
    setGenero("");
  };

  // Filtrado en memoria sobre lo que ya tenemos cargado (sin tocar el backend)
  const tracksFiltrados = tracks.filter((t) =>
    t.genero.toLowerCase().includes(buscaGenero.toLowerCase()),
  );

  return {
    tracks: tracksFiltrados,
    cargando,
    buscaGenero,
    setBuscaGenero,
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

import { useState, useEffect } from "react";
import { apiFetch } from "../../api/http";

export interface Track {
  idTrack: number;
  title: string;
  bpm: number;
  genero: string;
  usuarioUsername?: string;
}

export function useTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [title, setTitulo] = useState("");
  const [bpm, setBpm] = useState(120);
  const [genero, setGenero] = useState("");
  const [buscaGenero, setBuscaGenero] = useState("");
  const [edit, setEdit] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    apiFetch("/")
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

    apiFetch("/alta", {
      method: "POST",
      body: JSON.stringify(nuevoTrack),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((mensaje) => {
            throw new Error(mensaje);
          });
        }
        return res.json();
      })
      .then((trackGuardado) => {
        setTracks((prev) => [...prev, trackGuardado]);
        limpiarFormulario();
      })
      .catch((err) => {
        console.error("Error al añadir:", err);
        alert(err.message);
      });
  };

  const borrarTrack = (idABorrar: number) => {
    apiFetch(`/${idABorrar}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((mensaje) => {
            throw new Error(mensaje);
          });
        }
        setTracks((prev) =>
          prev.filter((track) => track.idTrack !== idABorrar),
        );
      })
      .catch((err) => {
        console.error("Error al borrar:", err);
        alert(err.message);
      });
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

    apiFetch(`/${edit}`, {
      method: "PUT",
      body: JSON.stringify(trackActualizado),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((mensaje) => {
            throw new Error(mensaje);
          });
        }
        return res.json();
      })
      .then((trackGuardado) => {
        setTracks((prev) =>
          prev.map((t) => (t.idTrack === edit ? trackGuardado : t)),
        );
        limpiarFormulario();
      })
      .catch((err) => {
        console.error("Error al actualizar:", err);
        alert(err.message);
      });
  };

  const limpiarFormulario = () => {
    setEdit(null);
    setTitulo("");
    setBpm(120);
    setGenero("");
  };

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

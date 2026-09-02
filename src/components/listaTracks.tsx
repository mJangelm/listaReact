import { useAuth } from "../auth/AuthContext";
import FiltrosGeneros from "./FiltroGeneros";
import FormularioTrack from "./TrackForm";
import TablaTracks from "./TablaTracks";
import { useTracks } from "./hooks/useTracks";

export type { Track } from "./hooks/useTracks";

function ListasTracks() {
  const { tracks, cargando, buscaGenero, setBuscaGenero, form, acciones } =
    useTracks();
  const { user } = useAuth();

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
            buscaGenero={buscaGenero}
            setBuscaGenero={setBuscaGenero}
          />

          <FormularioTrack
            title={form.title}
            setTitulo={form.setTitulo}
            genero={form.genero}
            setGenero={form.setGenero}
            bpm={form.bpm}
            setBpm={form.setBpm}
            edit={form.edit}
            onGuardar={acciones.guardarCambios}
            onAñadir={acciones.añadirTrack}
            onCancelar={acciones.cancelarEdicion}
          />

          <TablaTracks
            tracks={tracks}
            onBorrar={acciones.borrarTrack}
            onEditar={acciones.prepararEdicion}
            mostrarPropietario={user?.role === "ADMIN"}
          />
        </div>
      </div>
    </div>
  );
}

export default ListasTracks;

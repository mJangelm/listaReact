import ItemTrack from "./itemTrack";
import { Track } from "./listaTracks";
interface TablaTracksProps {
  tracks: Track[];
  onBorrar: (id: number) => void;
  onEditar: (track: Track) => void;
}

function TablaTracks({ tracks, onBorrar, onEditar }: TablaTracksProps) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead style={{ borderBottom: "2px solid #8d6e63" }}>
          <tr className="text-uppercase small ls-wide">
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
              onBorrar={() => onBorrar(track.idTrack)}
              onEditar={() => onEditar(track)}
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
  );
}

export default TablaTracks;

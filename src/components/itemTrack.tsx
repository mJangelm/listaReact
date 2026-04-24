interface ItemTrackProps {
  id: number;
  titulo: string;
  bpm: number;
  onBorrar: () => void; // Una función que no devuelve nada
  onEditar: () => void;
}

function ItemTrack({ id, titulo, bpm, onBorrar, onEditar }: ItemTrackProps) {
  return (
    <tr>
      <td className="text-center">{id}</td>
      <td className="fw-bold">{titulo}</td>
      <td className="text-center">{bpm}</td>
      <td>
        {/* Usamos d-flex para alinear y gap para separar */}
        <div className="d-flex justify-content-center gap-2">
          <button className="btn btn-danger btn-sm" onClick={onBorrar}>
            Eliminar
          </button>
          <button className="btn btn-warning btn-sm" onClick={onEditar}>
            Editar
          </button>
        </div>
      </td>
    </tr>
  );
}
export default ItemTrack;

interface ItemTrackProps {
  id: number;
  titulo: string;
  bpm: number;
  genero: string;
  onBorrar: () => void; // Una función que no devuelve nada
  onEditar: () => void;
}

function ItemTrack(props: ItemTrackProps) {
  return (
    <tr>
      <td className="fw-bold">{props.titulo}</td>
      <td className="fw-bold">{props.genero}</td>
      <td className="text-center">{props.bpm}</td>
      <td>
        {/* Usamos d-flex para alinear y gap para separar */}
        <div className="d-flex justify-content-center gap-2">
          <button className="btn btn-danger btn-sm" onClick={props.onBorrar}>
            Eliminar
          </button>
          <button className="btn btn-warning btn-sm" onClick={props.onEditar}>
            Editar
          </button>
        </div>
      </td>
    </tr>
  );
}
export default ItemTrack;

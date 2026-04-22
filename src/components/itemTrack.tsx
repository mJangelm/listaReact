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
      <td>{id}</td>
      <td>{titulo}</td>
      <td>{bpm}</td>
      <td>
        <button className="btn btn-danger btn-sm" onClick={onBorrar}>
          Eliminar
        </button>
        <br></br>
        <button className="btn btn-warning btn-sm mt-3" onClick={onEditar}>
          Editar
        </button>
      </td>
    </tr>
  );
}
export default ItemTrack;

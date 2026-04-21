interface ItemFrutaProps {
  nombre: string;
  onBorrar: () => void; // Una función que no devuelve nada
}

function ItemFruta({ nombre, onBorrar }: ItemFrutaProps) {
  return (
    <li>
      {nombre}
      <button onClick={onBorrar}>Eliminar</button>
    </li>
  );
}
export default ItemFruta;

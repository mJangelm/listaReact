interface ContadorCancionesProps {
  numero: number;
}

function ContadorCanciones({ numero }: ContadorCancionesProps) {
  const renderMensaje = () => {
    if (numero > 0) {
      return <p>Hay {numero} canciones</p>;
    }
    return <p>No hay canciones</p>;
  };
  return <p>{renderMensaje()}</p>;
}
export default ContadorCanciones;

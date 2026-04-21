interface ContadorFrutasProps {
  numero: number;
}

function ContadorFrutas({ numero }: ContadorFrutasProps) {
  const renderMensaje = () => {
    if (numero > 0) {
      return <p>Hay {numero} frutas</p>;
    }
    return <p>Cesta vacía</p>;
  };
  return <p>{renderMensaje()}</p>;
}
export default ContadorFrutas;

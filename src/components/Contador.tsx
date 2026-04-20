import { useState } from "react";

function Contador() {
  const [contador, SetContador] = useState(0);

  return (
    <div>
      <h1 style={{ color: contador > 0 ? "green" : "red" }}>{contador}</h1>
      <br></br>
      <button onClick={() => SetContador(contador + 1)}>Aumentar</button>
      <br></br>
      <button onClick={() => SetContador(contador - 1)}> Disminuir</button>
      <br></br>
      <button onClick={() => SetContador(0)}> Reiniciar</button>
    </div>
  );
}
export default Contador;

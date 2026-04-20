import { useState } from "react";

function Formulario() {
  const [nombre, setNombre] = useState("");

  return (
    <div>
      <input type="text" onChange={(e) => setNombre(e.target.value)}></input>
      <h1>Hola {nombre}</h1>
    </div>
  );
}
export default Formulario;

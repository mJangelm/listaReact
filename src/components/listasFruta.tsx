import { useState, useEffect } from "react";

function ListasFruta() {
  const [frutas, setFrutas] = useState<string[]>([]);
  const [nombre, setNombre] = useState("");
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setFrutas(["Piña", "Mango", "Coco"]);
      setCargando(false);
    }, 2000);
  }, []);
  //los corchetes vacíos indican que el temporizador o el useEffect sólo se utilizará una sola vez. Si ponemos en él,
  //la variable de nombre, pues se ejecutará cuadno detecte que haya cambios en el componente nombre.

  if (cargando) {
    return <h1>Cargando...</h1>;
  }

  return (
    <div>
      <ul>
        {frutas.map((fruta, index) => (
          <li key={index}> {fruta} </li>
        ))}
      </ul>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      ></input>
      <button
        onClick={() => {
          setFrutas([...frutas, nombre]);
          setNombre("");
        }}
      >
        {" "}
        Añadir
      </button>
    </div>
  );
}
export default ListasFruta;

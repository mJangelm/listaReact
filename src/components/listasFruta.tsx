import { useState, useEffect } from "react";
import ItemFruta from "./itemFruta";
import ContadorFrutas from "./ContadorFrutas";

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

  const borrarFruta = (indiceABorrar: number) => {
    // Filtramos el array de frutas
    const nuevasFrutas = frutas.filter((_, index) => {
      // "Solo deja pasar a las frutas cuyo índice NO sea el que quiero borrar"
      return index !== indiceABorrar;
    });

    // Actualizamos el estado con el nuevo array
    setFrutas(nuevasFrutas);
  };

  const añadirFruta = () => {
    const nombreLimpio = nombre.trim();
    if (nombreLimpio.length === 0) {
      alert("Nombre vacío");
    } else {
      const yaExiste = frutas.some(
        (f) => f.toLowerCase() === nombreLimpio.toLowerCase(),
      );
      if (frutas.includes(nombreLimpio)) {
        alert("Esa fruta ya existe");
      } else if (yaExiste) {
        alert("Ya existe (aunque lo escribas distinto)");
      }
      setFrutas([...frutas, nombreLimpio]);
    }
  };

  return (
    <div>
      <ul>
        {frutas.map((fruta, index) => (
          <ItemFruta
            key={index}
            nombre={fruta}
            onBorrar={() => borrarFruta(index)} // <--- Aquí pasamos la función
          />
        ))}
      </ul>
      <input
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            añadirFruta();
          }
        }}
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      ></input>
      <button
        onClick={() => {
          añadirFruta();
        }}
      >
        {" "}
        Añadir
      </button>
      <ContadorFrutas numero={frutas.length} />
    </div>
  );
}
export default ListasFruta;

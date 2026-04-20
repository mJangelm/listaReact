import { useState } from "react";

function Toggle() {
  const [booleano, setBooleano] = useState(false);

  function setear() {
    setBooleano(!booleano);
  }

  return (
    <div>
      {booleano && <p>Texto</p>}

      <button onClick={setear}>PULSAME</button>
    </div>
  );
}

export default Toggle;

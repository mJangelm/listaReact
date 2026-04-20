import { useState } from "react";

function Todo() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);

  function addTask() {
    setTasks([...tasks, input]);
    //copia el array y añade algo al final
    setInput("");
    //limpia el input
  }

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />

      <button onClick={addTask}>Enviar</button>

      {tasks.map((task) => (
        <p key={task}>{task}</p>
      ))}
    </div>
  );
}

export default Todo;

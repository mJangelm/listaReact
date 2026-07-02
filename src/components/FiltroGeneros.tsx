interface FiltrosGenerosProps {
  generoFiltro: string;
  setGeneroFiltro: (genero: string) => void;
}

function FiltrosGeneros({
  generoFiltro,
  setGeneroFiltro,
}: FiltrosGenerosProps) {
  const generos = ["TODOS", "Death Metal", "Thrash"];

  return (
    <div className="mb-4 d-flex gap-2">
      {generos.map((g) => (
        <button
          key={g}
          className={`btn btn-sm ${generoFiltro === g ? "btn-light" : "btn-outline-light"}`}
          onClick={() => setGeneroFiltro(g)}
        >
          {g === "TODOS" ? "Todos" : g}
        </button>
      ))}
    </div>
  );
}

export default FiltrosGeneros;

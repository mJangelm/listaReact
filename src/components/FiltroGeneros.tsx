interface FiltrosGenerosProps {
  generoFiltro: string;
  setGeneroFiltro: (genero: string) => void;
  buscaGenero: string;
  setBuscaGenero: (texto: string) => void;
}

function FiltrosGeneros({
  generoFiltro,
  setGeneroFiltro,
  buscaGenero,
  setBuscaGenero,
}: FiltrosGenerosProps) {
  const generos = ["TODOS", "Death Metal", "Thrash"];

  return (
    <div className="mb-4">
      <div className="d-flex gap-2 mb-2">
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

      <input
        type="text"
        className="form-control form-control-sm"
        placeholder="Buscar por género (ej: death)..."
        value={buscaGenero}
        onChange={(e) => setBuscaGenero(e.target.value)}
      />
    </div>
  );
}

export default FiltrosGeneros;

interface FiltrosGenerosProps {
  buscaGenero: string;
  setBuscaGenero: (texto: string) => void;
}

function FiltrosGeneros({ buscaGenero, setBuscaGenero }: FiltrosGenerosProps) {
  return (
    <div className="mb-4">
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

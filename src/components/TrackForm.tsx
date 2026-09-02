interface FormularioTrackProps {
  title: string;
  setTitulo: (val: string) => void;
  genero: string;
  setGenero: (val: string) => void;
  bpm: number;
  setBpm: (val: number) => void;
  edit: number | null;
  onGuardar: () => void;
  onAñadir: () => void;
  onCancelar: () => void;
}

function FormularioTrack({
  title,
  setTitulo,
  genero,
  setGenero,
  bpm,
  setBpm,
  edit,
  onGuardar,
  onAñadir,
  onCancelar,
}: FormularioTrackProps) {
  return (
    <div className="row g-2 mb-5 bg-dark bg-opacity-25 p-3 rounded shadow-sm">
      <div className="col-md-5">
        <input
          data-testid="input-titulo"
          className="form-control form-control-lg"
          type="text"
          placeholder="Nombre del track..."
          value={title}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </div>

      <div className="col-md-3">
        <input
          data-testid="input-genero"
          className="form-control form-control-lg"
          type="text"
          placeholder="Género (Ej: Death Metal)..."
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
        />
      </div>

      <div className="col-md-2">
        <div className="input-group">
          <span className="input-group-text bg-transparent text-white border-secondary">
            BPM
          </span>
          <input
            data-testid="input-bpm"
            className="form-control form-control-lg"
            type="number"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="col-md-2 d-grid">
        <button
          className={edit ? "btn btn-success btn-lg" : "btn btn-primary btn-lg"}
          onClick={edit ? onGuardar : onAñadir}
        >
          {edit ? "Actualizar" : "Añadir"}
        </button>
      </div>

      {edit && (
        <div className="col-12 mt-2">
          <button
            className="btn btn-link text-white-50 btn-sm"
            onClick={onCancelar}
          >
            Cancelar edición
          </button>
        </div>
      )}
    </div>
  );
}

export default FormularioTrack;

// Filtro por tipo: seletor + contagem + botão de voltar.
// É um componente "burro": não busca nada, só mostra o que recebe por props
// e avisa o App quando o usuário muda o tipo.
function TypeFilter({ types, typesError, type, onTypeChange, total, shown }) {
  return (
    <div className="flex flex-wrap items-center gap-4 px-6 pt-6">
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white capitalize"
      >
        <option value="">Todos os tipos</option>
        {types.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {typesError && <span className="text-sm text-red-400">{typesError}</span>}

      {/* Só aparece quando há um tipo escolhido */}
      {type && (
        <>
          {total > 0 && (
            <span className="text-slate-300">
              <strong className="capitalize">{type}</strong>: mostrando {shown}{" "}
              de {total} Pokémon
            </span>
          )}
          <button
            type="button"
            onClick={() => onTypeChange("")}
            className="text-sm text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
          >
            ← Voltar para a lista completa
          </button>
        </>
      )}
    </div>
  );
}

export default TypeFilter;
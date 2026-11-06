// Filtro por tipo: seletor + contagem + botão de voltar.
// É um componente "burro": não busca nada, só mostra o que recebe por props
// e avisa o App quando o usuário muda o tipo.
function TypeFilter({ types, typesError, type, onTypeChange, total, shown }) {
  return (
    <div className="flex flex-wrap items-center gap-4 px-6 pt-6">
      <select
        value={type}    // value do select é o tipo selecionado atualmente, vindo da prop type de app.jsx
        onChange={(e) => onTypeChange(e.target.value)}    //  onChange chama a função onTypeChange com o novo valor do select, atualizando o tipo selecionado
        className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white capitalize"
      >
        <option value="">Todos os tipos</option>
        {types.map((t) => (   // percorre a lista de tipos recebida por props e cria uma option para cada tipo
          <option key={t} value={t}>  {/* key é necessário para o React identificar cada option de forma única */}
            {t}
          </option>
        ))}
      </select>

      {typesError && <span className="text-sm text-red-400">{typesError}</span>}  {/*mostra a mensagem de erro de useTypes se houver algum erro na requisição dos tipos */}

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
            onClick={() => onTypeChange("")}    // onClick chama a função onTypeChange com uma string vazia, desmarcando o filtro de tipo
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
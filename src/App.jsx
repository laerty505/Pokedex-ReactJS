import { useState } from "react";
import Header from "./components/Header";
import usePokemonList from "./hooks/usePokemonList";
import PokemonList from "./components/PokemonList";
import useTypes from "./hooks/useTypes";
import usePokemonByType from "./hooks/usePokemonByType";
import PokemonModal from "./components/PokemonModal";
import TypeFilter from "./components/TypeFilter";

function App() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  // Dados vindos da API (cada hook cuida de sua própria requisição)
  const { types, error: typesError } = useTypes();
  const allPokemon = usePokemonList();
  const typePokemon = usePokemonByType(type);

  // Hooks não podem ficar dentro de if, então chamamos os dois sempre
  // e só escolhemos qual usar conforme o filtro de tipo.
  const { pokemonList, hasMore, loading, error, loadMore } = type
    ? typePokemon
    : allPokemon;

  // Busca client-side: ignora maiúsculas/minúsculas e aceita parte do nome.
  // Só enxerga os Pokémon já carregados.
  const term = search.trim().toLowerCase();
  const pokemons = term
    ? pokemonList.filter((p) => p.name.includes(term))
    : pokemonList;

  // Mensagem de status (erro, carregando ou nenhum resultado)
  let message = null;
  if (error) message = error;
  else if (loading && pokemonList.length === 0) message = "Carregando...";
  else if (term && pokemons.length === 0)
    message = `Nenhum Pokémon encontrado com "${search.trim()}".`;

  return (
    <div className="min-h-screen bg-slate-900">
      <Header search={search} onSearchChange={setSearch} />

      <TypeFilter
        types={types}
        typesError={typesError}
        type={type}
        onTypeChange={setType}
        total={typePokemon.total}
        shown={pokemonList.length}
      />

      {message && (
        <p className={`p-6 ${error ? "text-red-400" : "text-slate-300"}`}>
          {message}
        </p>
      )}

      <PokemonList pokemons={pokemons} onSelect={setSelected} />

      {hasMore && pokemonList.length > 0 && (
        <div className="flex justify-center pb-8">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-900 hover:bg-cyan-400 disabled:opacity-50"
          >
            {loading ? "Carregando..." : "Carregar mais Pokémon"}
          </button>
        </div>
      )}

      <PokemonModal pokemon={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default App;

import { useState } from "react";
import Header from "./components/Header";
import usePokemonList from "./hooks/usePokemonList";
import PokemonList from "./components/PokemonList";
import useTypes from "./hooks/useTypes";
import usePokemonByType from "./hooks/usePokemonByType";
import PokemonModal from "./components/PokemonModal";
import TypeFilter from "./components/TypeFilter";

function App() {
  const [selected, setSelected] = useState(null);   // Guarda o pokemon selecionado para o modal
  const [search, setSearch] = useState("");       // Guarda o termo de busca
  const [type, setType] = useState("");         // Guarda o tipo selecionado para o filtro

  // Dados vindos da API (cada hook cuida de sua própria requisição)
  const { types, error: typesError } = useTypes(); // renomeia o erro para evitar conflito com o erro do hook de pokemon
  const allPokemon = usePokemonList();    // executa o hook que busca todos os pokemons, independente do tipo selecionado
  const typePokemon = usePokemonByType(type);   // executa o hook que busca os pokemons do tipo selecionado, se houver algum., quando o tipo muda, o hook é reexecutado e busca os pokemons do novo tipo selecionado.

  // Hooks não podem ficar dentro de if, então chamo os dois sempre
  // e só escolhemos qual usar conforme o filtro de tipo.
  const {
    pokemonList,
    hasMore,
    loading,
    error,
    incrementOffset,
    offset,
    decrementOffset,
  } = type ? typePokemon : allPokemon;    // se type estiver preenchido, usamos o hook de tipo, senão usamos o hook de todos os pokemons.

  // Busca client-side: ignora maiúsculas/minúsculas e aceita parte do nome.
  // Só enxerga os Pokémon já carregados.
  const term = search.trim().toLowerCase();   // remove espaços e converte para minúsculas
  const pokemons = term
    ? pokemonList.filter((p) => p.name.includes(term))    // se tiver termo de busca, filtra a lista de pokemons carregados, retornando apenas os que contém o termo no nome.
    : pokemonList;                                      // se não tiver termo de busca, retorna a lista completa de pokemons carregados.

  // Mensagem de status (erro, carregando ou nenhum resultado)
  let message = null;
  if (error) message = error;
  else if (loading && pokemonList.length === 0) message = "Carregando...";    // se estiver carregando e não tiver nenhum pokemon carregado ainda, mostra "carregando".
  else if (term && pokemons.length === 0)   // se tiver termo de busca e não tiver nenhum pokemon encontrado, mostra a mensagem de nenhum resultado encontrado.
    message = `Nenhum Pokémon encontrado com "${search.trim()}".`;

  return (
    <div className="min-h-screen bg-slate-900">
      <Header search={search} onSearchChange={setSearch} />  {/* search = termo de busca, onSearchChange = função que atualiza o termo de busca */}

      <TypeFilter
        types={types} // lista de tipos carregados do hook useTypes
        typesError={typesError}
        type={type}   // tipo selecionado atualmente
        onTypeChange={setType}    // função que atualiza o tipo selecionado
        total={typePokemon.total}   // total de pokemons do tipo selecionado, vindo do hook usePokemonByType
        shown={pokemonList.length}    // quantidade de pokemons carregados atualmente, vindo do hook usePokemonByType ou usePokemonList
      />

      {message && (   // mostra a mensagem de status se houver alguma, seja erro, carregando ou nenhum resultado encontrado. */}
        <p className={`p-6 ${error ? "text-red-400" : "text-slate-300"}`}>
          {message}
        </p>
      )}

      <PokemonList pokemons={pokemons} onSelect={setSelected} />    {/* pokemons = lista de pokemons a serem exibidos, onSelect = função que é chamada quando um pokemon é selecionado (para o modal) */}

      <div className="flex justify-center gap-4">
        {offset > 1 && (                   // BOTAO DE DIMINUIR O OFFSET, NAO APARECE NA PRIMEIRA PAGINA 
          <div className="flex  pb-8">
            <button
              type="button"
              onClick={decrementOffset}
              disabled={loading}    // desabilita o botão enquanto estiver carregando
              className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-900 hover:bg-cyan-400 disabled:opacity-50"
            >
              {loading ? "Carregando..." : "Página Anterior"}
            </button>
          </div>
        )}

        {hasMore && pokemonList.length > 0 && ( //  / BOTAO DE AUMENTAR O OFFSET, NAO APARECE SE NAO TIVER MAIS PAGINAS
          <div className="flex  pb-8">          
            <button
              type="button"
              onClick={incrementOffset}
              disabled={loading}
              className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-900 hover:bg-cyan-400 disabled:opacity-50"
            >
              {loading ? "Carregando..." : "Próxima Página"}
            </button>
          </div>
        )}
      </div>

      <PokemonModal pokemon={selected} onClose={() => setSelected(null)} />   {/* pokemon = pokemon selecionado para o modal, onClose = função que fecha o modal, pois é chamada quando o usuário clica no botão de fechar, e seta selected como null */}
    </div>
  );
}

export default App;

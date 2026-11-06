import { getPokemonImage } from "../services/api";

function PokemonCard({ pokemon, onSelect }) {   // pokemon = objeto com os detalhes do Pokémon, onSelect = função que é chamada quando o card é clicado (para abrir o modal)
  return (
    <li className="group bg-slate-800 rounded-2xl p-4 border border-slate-700 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-cyan-400">
      <button   // cada card é um botão, para que seja clicável e abra o modal com os detalhes do Pokémon
        type="button"
        onClick={() => onSelect(pokemon)}   // ao clicar no card, chama a função onSelect com o Pokémon atual, para abrir o modal com os detalhes do Pokémon
        className="w-full flex flex-col items-center cursor-pointer"
      >
        <span className="self-end text-xs text-slate-400 font-semibold">
          #{String(pokemon.id).padStart(3, "0")}    {/* exibe o ID do Pokémon com 3 dígitos, preenchendo com zeros à esquerda se necessário */}
        </span>

        <div className="bg-slate-700 rounded-full p-3 mt-2 mb-3 group-hover:bg-slate-600 transition-colors">
          <img
            src={getPokemonImage(pokemon)}
            alt={pokemon.name}
            loading="lazy"  // carrega a imagem só quando estiver visível na tela
            className="w-28 h-28 object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <h2 className="text-white text-lg font-bold capitalize">{pokemon.name}</h2>

        <span className="mt-2 text-xs text-cyan-400 font-medium">
          {pokemon.types.map((t) => t.type.name).join(", ")}  {/*transforma o array de tipos e exibe os tipos do Pokémon, separados por vírgula */}
        </span>
      </button>
    </li>
  );
}

export default PokemonCard;

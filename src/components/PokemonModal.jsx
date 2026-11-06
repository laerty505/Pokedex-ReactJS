import { getPokemonImage } from "../services/api";

function PokemonModal({ pokemon, onClose }) {   // pokemon = objeto com os detalhes do Pokémon, onClose = função que é chamada quando o modal é fechado (para fechar o modal)
  if (!pokemon) return null;    //se nao houver pokemon selecionado, nao renderiza o modal, pois é null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">  {/* modal ocupa toda a tela, com fundo preto semi-transparente, e centraliza o conteúdo do modal */}
      <div className="bg-slate-900 text-white p-6 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"> {/* modal com fundo escuro,, largura máxima de 90% da tela e altura máxima de 90% da tela, com scroll vertical se o conteúdo ultrapassar a altura máxima */}
        <button onClick={onClose} className="float-right text-xl cursor-pointer">   {/* botão de fechar o modal, chama a função onClose quando clicado */}
          X
        </button>

        <h2 className="text-2xl font-bold capitalize">
          #{pokemon.id} - {pokemon.name}
        </h2>

        <img
          src={getPokemonImage(pokemon)}
          alt={pokemon.name}
          className="w-32 h-32 mx-auto"
        />

        <p>Experiência base: {pokemon.base_experience ?? "N/A"}</p>
        <p>Altura: {pokemon.height / 10} m</p>
        <p>Peso: {pokemon.weight / 10} kg</p>

        <h3 className="font-bold mt-4">Tipos</h3>
        <p>{pokemon.types.map((t) => t.type.name).join(", ")}</p>

        <h3 className="font-bold mt-4">Habilidades</h3>
        <p>{pokemon.abilities.map((a) => a.ability.name).join(", ")}</p>

        <h3 className="font-bold mt-4">Estatísticas</h3>
        {pokemon.stats.map((s) => (   // percorre o array de estatísticas do Pokémon e exibe o nome da estatística e o valor base da estatística
          <p key={s.stat.name}>
            {s.stat.name}: {s.base_stat}   {/* um paragrafo pra cada estatistica */}
          </p>
        ))}
      </div>
    </div>
  );
}

export default PokemonModal;

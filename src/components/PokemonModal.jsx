import { getPokemonImage } from "../services/api";

function PokemonModal({ pokemon, onClose }) {
  if (!pokemon) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white p-6 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="float-right text-xl cursor-pointer">
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
        {pokemon.stats.map((s) => (
          <p key={s.stat.name}>
            {s.stat.name}: {s.base_stat}
          </p>
        ))}
      </div>
    </div>
  );
}

export default PokemonModal;

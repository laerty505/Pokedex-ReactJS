import PokemonCard from "./PokemonCard";

// Grid responsivo de cards: 2 colunas no celular até 5 no desktop.
// Recebe a lista já filtrada e só se preocupa em desenhá-la.
function PokemonList({ pokemons, onSelect }) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 p-6">
      {pokemons.map((p) => (
        <PokemonCard key={p.id} pokemon={p} onSelect={onSelect} />
      ))}
    </ul>
  );
}

export default PokemonList;
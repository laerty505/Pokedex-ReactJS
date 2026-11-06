import PokemonCard from "./PokemonCard";

// Grid responsivo de cards: 2 colunas no celular até 5 no desktop.
// Recebe a lista já filtrada e só se preocupa em desenhá-la.
function PokemonList({ pokemons, onSelect }) {  // pokemons = lista de pokemons a serem exibidos, onSelect = função que é chamada quando um pokemon é selecionado (para o modal)
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 p-6"> {/*grid responsivo de acordo com o tamanho da tela com gap de 5 e padding de 6*/}
      {pokemons.map((p) => (  // percorre a lista de pokemons recebida por props e cria um componente para cada pokemon, passando o pokemon e a função onSelect como props para o card
        <PokemonCard key={p.id} pokemon={p} onSelect={onSelect} />    
      ))}
    </ul>
  );
}

export default PokemonList;
import { useState } from 'react'
import Header from './components/Header'
import usePokemonList from './hooks/usePokemonList'
import PokemonList from './components/PokemonList'


function App() {
  const [search, setSearch] = useState("")


  const allPokemon = usePokemonList()



  // Busca client-side: ignora maiúsculas/minúsculas e aceita parte do nome.
  // Só enxerga os Pokémon já carregados.
  const term = search.trim().toLowerCase();
  const pokemons = term
    ? okemonList.filter((p) => p.name.includes(term))
    : pokemonList;


  
  

  return (
    <div className='min-h-screen bg-slate-900'>
      <Header search={search} onSearchChange={setSearch}/>




      <PokemonList pokemons={pokemons}/>

    </div>
  )
} 

export default App

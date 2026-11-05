import { useEffect, useState } from "react";
import { getPokemon, getPokemonPage } from "../services/api";

const PAGE_SIZE = 20;
                                                  //Esse Hook controla a busca dos Pokémon quando nenhum filtro de tipo está selecionado.
export default function usePokemonList() {
  const [pokemonList, setPokemonList] = useState([]); // Pokémons da página atual
  const [hasMore, setHasMore] = useState(true);       // Informa se existem mais páginas
  const [loading, setLoading] = useState(false);      // Informa se há uma requisição em andamento
  const [offset , setOffset] = useState(0);           // Posição inicial da consulta
  const [error, setError] = useState(null);           // Mensagem de erro, caso ocorra

  function incrementOffset() {
    setOffset(offset + 20);
  }

  function decrementOffset() {
    setOffset(offset - 20);
  }

  async function loadList() {
    setLoading(true);
    setError(null);
    try {
      const page = await getPokemonPage(PAGE_SIZE, offset);  //Busca as referencias (nome e URL)
      const details = await Promise.all(              //Busca os detalhes de cada pokemon
        page.results.map((p) => getPokemon(p.url)), //percorre cada Pokémon presente na resposta e chama getPokemon utilizando a URL de cada um. resulta num array de promises
      );
      setPokemonList(details.filter(Boolean)); //atualiza o estado com os detalhes recebidos. filter(boolean) remover qualquer valor falsy
      setHasMore(page.next !== null);  //verifica se há uma próxima página de resultados. Se page.next for null, significa que não há mais páginas.
    } catch {
      setError("Não foi possível carregar os Pokémon.");  // se uma das operações falhar, exibe uma mensagem de erro
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList(); // chama a função loadList sempre que o offset mudar, garantindo que a lista de Pokémon seja atualizada conforme a paginação.
  }, [offset]);

  return { pokemonList, hasMore, loading, error, offset, incrementOffset, decrementOffset, loadList }; // retorna um objeto, disponibilizando os estados e funções para o componente que utilizar esse Hook
}

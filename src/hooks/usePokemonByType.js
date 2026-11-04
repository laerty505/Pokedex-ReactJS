
import { useEffect, useState } from "react";
import { getPokemon, getPokemonByType } from "../services/api";

const PAGE_SIZE = 20;

export default function usePokemonByType(type) {
  const [refs, setRefs] = useState([]);
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState(null);

  function incrementOffset() {
    setOffset(offset + 20);
  }

  function decrementOffset() {
    setOffset(offset - 20);
  }

  // Reseta a paginação quando o tipo muda
  useEffect(() => {
    setOffset(0);
  }, [type]);

  // Carrega os Pokémon sempre que o tipo ou offset mudar
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!type) {
        setRefs([]);
        setPokemonList([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const all = await getPokemonByType(type);

        if (cancelled) return;

        setRefs(all);

        const currentPage = all.slice(
          offset,
          offset + PAGE_SIZE
        );

        const details = await Promise.all(
          currentPage.map((pokemon) => getPokemon(pokemon.url))
        );

        if (cancelled) return;

        setPokemonList(details.filter(Boolean));

      } catch {
        if (!cancelled) {
          setError("Não foi possível carregar os Pokémon desse tipo.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };

  }, [type, offset]);

  // Avança para a próxima página
  function loadMore() {
    setOffset(offset + PAGE_SIZE);
  }

  return {
    total: refs.length,
    pokemonList,
    hasMore: offset + PAGE_SIZE < refs.length,
    loading,
    error,
    loadMore,
    incrementOffset,
    decrementOffset,
    offset
  };
}

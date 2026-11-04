import { useEffect, useState } from "react";
import { getPokemon, getPokemonPage } from "../services/api";

const PAGE_SIZE = 20;

export default function usePokemonList() {
  const [pokemonList, setPokemonList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [offset , setOffset] = useState(0);
  const [error, setError] = useState(null);

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
      const page = await getPokemonPage(PAGE_SIZE, offset);
      const details = await Promise.all(
        page.results.map((p) => getPokemon(p.url)),
      );
      setPokemonList(() => details.filter(Boolean));
      setHasMore(page.next !== null);
    } catch {
      setError("Não foi possível carregar os Pokémon.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList();
  }, [offset]);

  return { pokemonList, hasMore, loading, error, offset, incrementOffset, decrementOffset, loadList };
}

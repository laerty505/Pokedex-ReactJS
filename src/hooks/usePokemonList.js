import { useEffect, useState } from "react";
import { getPokemon, getPokemonPage } from "../services/api";

const PAGE_SIZE = 20;

export default function usePokemonList() {
  const [pokemonList, setPokemonList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadMore() {
    setLoading(true);
    setError(null);
    try {
      const page = await getPokemonPage(PAGE_SIZE, pokemonList.length);
      const details = await Promise.all(
        page.results.map((p) => getPokemon(p.url)),
      );
      setPokemonList((prev) => [...prev, ...details.filter(Boolean)]);
      setHasMore(page.next !== null);
    } catch {
      setError("Não foi possível carregar os Pokémon.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMore();
  }, []);

  return { pokemonList, hasMore, loading, error, loadMore };
}

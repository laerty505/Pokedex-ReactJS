import { useEffect, useState } from "react";
import { getPokemon, getPokemonByType } from "../services/api";

const PAGE_SIZE = 20;

export default function usePokemonByType(type) {
  const [refs, setRefs] = useState([]); // todos {name, url} do tipo
  const [pokemonList, setPokemonList] = useState([]); // só os já detalhados
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Roda sempre que o tipo muda
  useEffect(() => {
    setRefs([]);
    setPokemonList([]);
    setError(null);
    if (!type) return;

    // Flag de cancelamento: se o usuário trocar de tipo antes da resposta
    // chegar, o cleanup abaixo marca como cancelada e ela é ignorada.
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const all = await getPokemonByType(type);
        const first = await Promise.all(
          all.slice(0, PAGE_SIZE).map((p) => getPokemon(p.url)),
        );
        if (cancelled) return;
        setRefs(all);
        setPokemonList(first.filter(Boolean));
      } catch {
        if (!cancelled)
          setError("Não foi possível carregar os Pokémon desse tipo.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [type]);

  // Carrega o próximo lote usando a lista de refs já guardada
  async function loadMore() {
    setLoading(true);
    setError(null);
    try {
      const next = await Promise.all(
        refs
          .slice(pokemonList.length, pokemonList.length + PAGE_SIZE)
          .map((p) => getPokemon(p.url)),
      );
      setPokemonList((prev) => [...prev, ...next.filter(Boolean)]);
    } catch {
      setError("Não foi possível carregar mais Pokémon.");
    } finally {
      setLoading(false);
    }
  }

  return {
    total: refs.length, // total de Pokémon do tipo (para mostrar na tela)
    pokemonList,
    hasMore: pokemonList.length < refs.length,
    loading,
    error,
    loadMore,
  };
}


import { useEffect, useState } from "react";
import { getPokemon, getPokemonByType } from "../services/api";

const PAGE_SIZE = 20;

export default function usePokemonByType(type) {
  const [refs, setRefs] = useState([]);
  const [refsType, setRefsType] = useState("");

  const [pokemonList, setPokemonList] = useState([]);

  const [loadingRefs, setLoadingRefs] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [offset, setOffset] = useState(0);
  const [error, setError] = useState(null);

  // 1. Busca todos os Pokémon do tipo selecionado
  useEffect(() => {
    let cancelled = false;

    setOffset(0);
    setRefs([]);
    setRefsType("");
    setPokemonList([]);
    setError(null);

    if (!type) {
      setLoadingRefs(false);
      return;
    }

    async function loadReferences() {
      setLoadingRefs(true);

      try {
        const all = await getPokemonByType(type);

        if (cancelled) return;

        setRefs(all);
        setRefsType(type);

      } catch {
        if (!cancelled) {
          setError("Não foi possível carregar os Pokémon desse tipo.");
        }
      } finally {
        if (!cancelled) {
          setLoadingRefs(false);
        }
      }
    }

    loadReferences();

    return () => {
      cancelled = true;
    };
  }, [type]);

  // 2. Busca os detalhes somente da página atual
  useEffect(() => {
    let cancelled = false;

    if (!type || refsType !== type) {
      setPokemonList([]);
      setLoadingDetails(false);
      return;
    }

    const currentPage = refs.slice(
      offset,
      offset + PAGE_SIZE
    );

    if (currentPage.length === 0) {
      setPokemonList([]);
      setLoadingDetails(false);
      return;
    }

    async function loadDetails() {
      setLoadingDetails(true);
      setError(null);
      setPokemonList([]);

      try {
        const details = await Promise.all(
          currentPage.map((pokemon) =>
            getPokemon(pokemon.url)
          )
        );

        if (cancelled) return;

        setPokemonList(details.filter(Boolean));

      } catch {
        if (!cancelled) {
          setError("Não foi possível carregar os detalhes dos Pokémon.");
        }
      } finally {
        if (!cancelled) {
          setLoadingDetails(false);
        }
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [type, refsType, refs, offset]);

  // 3. Controle da paginação
  function incrementOffset() {
    if (hasMore && !loading) {
      setOffset((prev) => prev + PAGE_SIZE);
    }
  }

  function decrementOffset() {
    if (offset > 0 && !loading) {
      setOffset((prev) => Math.max(0, prev - PAGE_SIZE));
    }
  }

  const loading = loadingRefs || loadingDetails;

  const hasMore = offset + PAGE_SIZE < refs.length;

  return {
    total: refsType === type ? refs.length : 0,
    pokemonList,
    hasMore,
    loading,
    error,
    loadMore: incrementOffset,
    incrementOffset,
    decrementOffset,
    offset
  };
}


import { useEffect, useState } from "react";
import { getPokemon, getPokemonByType } from "../services/api";

const PAGE_SIZE = 20;

export default function usePokemonByType(type) {
  const [refs, setRefs] = useState([]);                   // Armazena todas as referências do tipo
  const [refsType, setRefsType] = useState("");           // Identifica a qual tipo pertencem as referências

  const [pokemonList, setPokemonList] = useState([]);     // 	Armazena os detalhes da página atual

  const [loadingRefs, setLoadingRefs] = useState(false);    // 	Controla a busca das referências
  const [loadingDetails, setLoadingDetails] = useState(false);    // Controla a busca dos detalhes

  const [offset, setOffset] = useState(0);    
  const [error, setError] = useState(null);  

  // 1. Busca todos os Pokémon do tipo selecionado
  useEffect(() => {
    let cancelled = false;    //variável que indica se a operação ainda pode atualizar os estados.

    setOffset(0);     //limpa os estados, pra evitar que a tela continue exibindo referencias antigas
    setRefs([]);
    setRefsType("");
    setPokemonList([]);
    setError(null);

    if (!type) {    //verifica se nenhum tipo foi selecionado. Se for o caso, limpa os estados e retorna, evitando fazer uma requisição desnecessária.
      setLoadingRefs(false);
      return;
    }

    async function loadReferences() {
      setLoadingRefs(true);

      try {
        const all = await getPokemonByType(type); // busca todas as referencias, retorna um objeto com nome e URL de cada Pokémon do tipo selecionado.

        if (cancelled) return;    //evita atualizar os estados se o tipo mudou durante a requisição.

        setRefs(all);   //salva os dados recebidos no estado refs, que armazena todas as referências do tipo selecionado.
        setRefsType(type);  // salva o tipo atual no estado refsType, que identifica a qual tipo pertencem as referências.

      } catch { //registra erro se a requisição falhar, mas só atualiza o estado se a operação não tiver sido cancelada.
        if (!cancelled) {
          setError("Não foi possível carregar os Pokémon desse tipo.");
        }
      } finally {
        if (!cancelled) {
          setLoadingRefs(false);
        }
      }
    }

    loadReferences();   //inicia a operação.

    return () => {  // define uma função de limpeza que será executada quando o tipo mudar. Isso garante que, se a operação ainda estiver em andamento, ela seja marcada como cancelada para evitar atualizações de estado desnecessárias.
      cancelled = true; //  Marca a operação como cancelada.
    };
  }, [type]);

  // 2. Busca os detalhes somente da página atual
  useEffect(() => {
    let cancelled = false;

    if (!type || refsType !== type) { //se os tipos das referencias nao forem iguais ao tipo atual, significa que o usuário mudou de tipo antes da conclusão da requisição. Nesse caso, limpa a lista de detalhes e retorna, evitando exibir dados desatualizados.
      setPokemonList([]);
      setLoadingDetails(false);
      return;
    }

    const currentPage = refs.slice(  // Pega apenas as referencias da página atual, com base no offset e no tamanho da página (PAGE_SIZE). A função slice() retorna uma cópia rasa de uma parte do array refs, começando no índice offset e terminando antes do índice offset + PAGE_SIZE.
      offset,
      offset + PAGE_SIZE
    );

    if (currentPage.length === 0) { // verifica se a página atual está vazia. Se estiver, limpa a lista de detalhes e retorna.
      setPokemonList([]);
      setLoadingDetails(false);
      return;
    }

    async function loadDetails() {  // essa função é responsável por buscar os detalhes dos Pokémon da página atual. Ela é chamada sempre que o tipo, as referências ou o offset mudam.
      setLoadingDetails(true);
      setError(null);
      setPokemonList([]);

      try {
        const details = await Promise.all( 
          currentPage.map((pokemon) =>  // percorre o array currentPage, que contem as referencias, para cada referencia, chama a função getPokemon() passando a URL
            getPokemon(pokemon.url)  //percorre cada referência da página atual e chama a função getPokemon() para buscar os detalhes de cada Pokémon, utilizando a URL de cada um. A função Promise.all() é usada para aguardar que todas as promessas sejam resolvidas antes de continuar.
          )
        );

        if (cancelled) return;  // se o usuario troca o tipo, o efeito antigo ativa o cancelled, e evita atualizar o estado com dados desatualizados.

        setPokemonList(details.filter(Boolean)); // atualiza o estado com os detalhes recebidos.

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

    return () => { // função de limpeza que é executada quando uma dependência muda
      cancelled = true; // marca a operação como cancelada
    };
  }, [type, refsType, refs, offset]); // dependencias, esse useEffect depende do tipo selecionado, do tipo das referências, das referências e do offset. Sempre que qualquer uma dessas variáveis mudar, o efeito será executado novamente para buscar os detalhes dos Pokémon da página atual.

  //  Controle da paginação
  function incrementOffset() {
      setOffset(offset + 20);
    
  }

  function decrementOffset() {
      setOffset(offset - 20);
    
  }

  const loading = loadingRefs || loadingDetails;  // loading será verdadeiro se pelo menos um dos dois carregamentos estiver ativo

  const hasMore = offset + PAGE_SIZE < refs.length; // verifica se tem  mais páginas 

  return {
    total: refsType === type ? refs.length : 0, // somente mostra o total quando as referências pertencem ao tipo selecionado, caso contrário, retorna 0.
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

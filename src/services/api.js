const API = "https://pokeapi.co/api/v2";

async function get(url) {               //Essa é uma função genérica que centraliza a comunicação HTTP. Ela recebe uma URL, faz uma requisição e trata a resposta.
  const response = await fetch(url); 
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Erro ${response.status} ao buscar ${url}`);
  return response.json();               //Converte o corpo da resposta para um objeto JavaScript. (apenas nome e URL do Pokémon, não todos os detalhes)
}

export const getPokemonPage = (limit, offset) =>   //Busca uma página de Pokémon, com limite e deslocamento (offset) para paginação. Retorna um objeto com a lista de Pokémon e informações de paginação.
  get(`${API}/pokemon?limit=${limit}&offset=${offset}`);

export const getPokemon = (urlOrName) =>          //Essa função busca os detalhes de um Pokémon. 
  get(
    urlOrName.startsWith("http")
      ? urlOrName
      : `${API}/pokemon/${encodeURIComponent(urlOrName.toLowerCase())}`,
  );

// limit=100 porque o padrão (20) pode cortar tipos da lista
export async function getTypes() {              // Essa função busca os tipos existentes na PokéAPI.
  const data = await get(`${API}/type?limit=100`);
  return data.results.map((t) => t.name).filter((name) => name !== "unknown" && name !== "shadow" && name !== "stellar");//Percorre o array e cria outro array contendo somente o nome de cada tipo. // tipos sem Pokémon jogáveis  
}

export async function getPokemonByType(type) {    //Essa função é responsável por buscar todas as referencias (nome e URL) Pokémon pertencentes a um tipo.
  const data = await get(`${API}/type/${type}`);
  if (!data) return []; // get() devolve null em 404
  return data.pokemon.map((p) => p.pokemon); // [{ name, url }, ...] O método map percorre a lista e extrai o objeto pokemon de cada registro.
}

// Escolhe a melhor imagem disponível: sprite pequena, ou arte oficial se não houver.
// Retorna null se o Pokémon não tiver nenhuma das duas.
export const getPokemonImage = (pokemon) =>
  pokemon.sprites.other?.["official-artwork"]?.front_default ??  // ?? => retorna o valor à esquerda se não for null ou undefined, caso contrário retorna o valor à direita.
  pokemon.sprites.front_default ??
  null;

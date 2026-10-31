const API = "https://pokeapi.co/api/v2";

async function get(url) {
  const response = await fetch(url);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Erro ${response.status} ao buscar ${url}`);
  return response.json();
}

export const getPokemonPage = (limit, offset) =>
  get(`${API}/pokemon?limit=${limit}&offset=${offset}`);

export const getPokemon = (urlOrName) =>
  get(
    urlOrName.startsWith("http")
      ? urlOrName
      : `${API}/pokemon/${encodeURIComponent(urlOrName.toLowerCase())}`,
  );

// limit=100 porque o padrão (20) pode cortar tipos da lista
export async function getTypes() {
  const data = await get(`${API}/type?limit=100`);
  return data.results
    .map((t) => t.name)
    .filter((name) => name !== "unknown" && name !== "shadow"); // tipos sem Pokémon jogáveis
}

export async function getPokemonByType(type) {
  const data = await get(`${API}/type/${type}`);
  if (!data) return []; // get() devolve null em 404
  return data.pokemon.map((p) => p.pokemon); // [{ name, url }, ...]
}

// Escolhe a melhor imagem disponível: sprite pequena, ou arte oficial se não houver.
// Retorna null se o Pokémon não tiver nenhuma das duas.
export const getPokemonImage = (pokemon) =>
  pokemon.sprites.front_default ??
  pokemon.sprites.other?.["official-artwork"]?.front_default ??
  null;

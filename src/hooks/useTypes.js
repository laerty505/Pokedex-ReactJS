import { useEffect, useState } from "react";
import { getTypes } from "../services/api";

// Carrega os tipos uma única vez, quando o app abre
export default function useTypes() {    // Carrega a lista de tipos de Pokémon da API e retorna os tipos e qualquer erro que possa ter ocorrido durante a requisição.
  const [types, setTypes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTypes()
      .then(setTypes)   // .then executa a função setTypes com o resultado da requisição, atualizando o estado types com a lista de tipos recebida da API.
      .catch(() => setError("Não foi possível carregar os tipos."));
  }, []);  // Array de dependencias vazio significa que o efeito será executado apenas uma vez, quando o componente for montado.

  return { types, error };
}
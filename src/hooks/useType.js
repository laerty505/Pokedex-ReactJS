import { useEffect, useState } from "react";
import { getTypes } from "../services/api";

// Carrega os tipos uma única vez, quando o app abre
export default function useTypes() {
  const [types, setTypes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTypes()
      .then(setTypes)
      .catch(() => setError("Não foi possível carregar os tipos."));
  }, []);

  return { types, error };
}
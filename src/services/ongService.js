// ONGs (RF20/RF23): lista para o mapa, com contato e links. Importador: tela Ongs.
//
// Cache: 6h — catálogo estável. lat/lng entram na chave do cache, então
// coords diferentes (GPS real vs fallback Campinas) geram entradas separadas,
// sem uma poluir a outra. A revalidação em segundo plano corrige a lista
// quando a rede responde, mesmo dentro do TTL.
import { getComCache } from './cache';

const ongService = {
  /**
   * Passando lat/lng o backend calcula `distancia_km` e ordena da mais próxima.
   * Sem coordenadas devolve na ordem do banco, sem distância.
   */
  listar: async ({ lat, lng } = {}) => {
    const params = lat != null && lng != null ? { lat, lng } : undefined;
    const { dados } = await getComCache('/ongs', { ttlSegundos: 6 * 3600, params });
    return dados;
  },
};

export default ongService;
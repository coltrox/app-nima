// ONGs (RF20/RF23): lista para o mapa, com contato e links. Importador: tela Ongs.
import http from './http';

const ongService = {
  /**
   * Passando lat/lng o backend calcula `distancia_km` e ordena da mais próxima.
   * Sem coordenadas devolve na ordem do banco, sem distância.
   */
  listar: async ({ lat, lng } = {}) => {
    const params = lat != null && lng != null ? { lat, lng } : undefined;
    const { data } = await http.get('/ongs', { params });
    return data;
  },
};

export default ongService;

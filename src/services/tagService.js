// Leitura da Patinha (RF14/RF17). Importador: tela SmartTag.
// A rota é PÚBLICA de propósito: quem acha o animal escaneia sem ter conta.
import http from './http';

const tagService = {
  /**
   * GET registra a leitura simples. Devolve a ficha do pet e o contato
   * (dono se houver, senão a ONG) — ou 404 se a Patinha não estiver vinculada.
   */
  ler: async (codigo) => {
    const { data } = await http.get(`/tag/${encodeURIComponent(codigo)}`);
    return data;
  },

  /** POST registra a leitura COM geolocalização (RF18). */
  lerComLocal: async (codigo, { latitude, longitude }) => {
    const { data } = await http.post(`/tag/${encodeURIComponent(codigo)}/leitura`, { latitude, longitude });
    return data;
  },
};

export default tagService;

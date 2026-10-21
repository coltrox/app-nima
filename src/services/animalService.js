// Animais: feed recomendado, vitrine, ficha e mural de desaparecidos.
// Importadores: telas Home, Match, PetDetails, Desaparecidos e MyPet.
import http, { mensagemDoErro, statusDoErro } from './http';
import { getComCache, limparChave } from './cache';

// O backend devolve `fotos` como array de URLs (pode vir vazio).
export const primeiraFoto = (animal) =>
  Array.isArray(animal?.fotos) && animal.fotos.length ? animal.fotos[0] : null;

const animalService = {
  /**
   * Feed recomendado (RF06). Exige questionário respondido: sem ele o backend
   * devolve 400 — a tela usa isso para convidar o tutor a responder.
   * Cache: 5 min. `todos`/`raio` entram na chave do cache.
   */
  recomendados: async (opcoes = {}) => {
    const params = {};
    if (opcoes.todos) params.todos = '1';
    if (opcoes.raio) params.raio = String(opcoes.raio);
    const { dados } = await getComCache('/animais/recomendados', {
      ttlSegundos: 5 * 60,
      params,
    });
    return dados;
  },

  /** Vitrine completa (não depende de questionário). Cache: 5 min. */
  listarTodos: async () => {
    const { dados } = await getComCache('/animais', { ttlSegundos: 5 * 60 });
    return dados;
  },

  /**
   * Recomendados com queda suave para a vitrine geral.
   * O 400 do recomendados NÃO é cacheado (o cache só grava sucesso), então o
   * fallback continua funcionando igual.
   */
  feed: async (opcoes = {}) => {
    try {
      const lista = await animalService.recomendados(opcoes);
      return { lista, personalizado: true, aviso: null };
    } catch (erro) {
      if (statusDoErro(erro) === 400) {
        const lista = await animalService.listarTodos();
        return { lista, personalizado: false, aviso: mensagemDoErro(erro) };
      }
      throw erro;
    }
  },

  /** Ficha do pet. Cache: 5 min. */
  buscarPorId: async (id) => {
    const { dados } = await getComCache(`/animais/${id}`, { ttlSegundos: 5 * 60 });
    return dados;
  },

  /** Mural de desaparecidos. Cache curto (2 min): urgência — dado velho engana. */
  desaparecidos: async () => {
    const { dados } = await getComCache('/animais/desaparecidos', { ttlSegundos: 2 * 60 });
    return dados;
  },

  // ------------------------------------------------------------ PET DO TUTOR
  // Sem cache: dados do próprio usuário, mudam no ato do cadastro/edição.

  meus: async () => {
    const { data } = await http.get('/animais/meus');
    return data;
  },

  cadastrarMeu: async (pet) => {
    const { data } = await http.post('/animais/meus', pet);
    return data;
  },

  atualizarMeu: async (id, patch) => {
    const { data } = await http.put(`/animais/meus/${id}`, patch);
    return data;
  },

  removerMeu: async (id) => {
    const { data } = await http.delete(`/animais/meus/${id}`);
    return data;
  },

  leituras: async (animalId) => {
    const { data } = await http.get(`/animais/${animalId}/leituras`);
    return data;
  },

  // ------------------------------------------------------------ MATCH SOB DEMANDA
  // Sem cache: verMatch CALCULA no servidor; obterMatch reflete o estado salvo.

  obterMatch: async (id) => {
    const { data } = await http.get(`/animais/${id}/match`);
    return data;
  },

  verMatch: async (id) => {
    const { data } = await http.post(`/animais/${id}/match`);
    return data;
  },

  atualizarVacinasMeu: async (id, prontuario_vacinas) => {
    const { data } = await http.put(`/animais/meus/${id}/vacinas`, { prontuario_vacinas });
    return data;
  },

  adicionarFotoMeu: async (id, asset) => {
    const form = new FormData();
    form.append('foto', {
      uri: asset.uri,
      name: asset.fileName || `pet-${id}.jpg`,
      type: asset.mimeType || 'image/jpeg',
    });
    const { data } = await http.post(`/animais/meus/${id}/fotos`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    // A ficha do pet mudou (nova foto) → invalida o cache dela.
    await limparChave(`/animais/${id}`);
    return data;
  },
};

export default animalService;
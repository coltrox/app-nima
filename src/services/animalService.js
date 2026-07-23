// Animais: feed recomendado, vitrine, ficha e mural de desaparecidos.
// Importadores: telas Home, Match, PetDetails, Desaparecidos e MyPet.
import http, { mensagemDoErro, statusDoErro } from './http';

// O backend devolve `fotos` como array de URLs (pode vir vazio).
export const primeiraFoto = (animal) =>
  Array.isArray(animal?.fotos) && animal.fotos.length ? animal.fotos[0] : null;

const animalService = {
  /**
   * Feed recomendado (RF06). Exige questionário respondido: sem ele o backend
   * devolve 400 — a tela usa isso para convidar o tutor a responder.
   */
  recomendados: async () => {
    const { data } = await http.get('/animais/recomendados');
    return data;
  },

  /** Vitrine completa (não depende de questionário). */
  listarTodos: async () => {
    const { data } = await http.get('/animais');
    return data;
  },

  /**
   * Recomendados com queda suave para a vitrine geral.
   * Retorna { lista, personalizado, aviso } — `personalizado: false` significa
   * que veio da vitrine porque o questionário ainda não foi respondido.
   */
  feed: async () => {
    try {
      const lista = await animalService.recomendados();
      return { lista, personalizado: true, aviso: null };
    } catch (erro) {
      if (statusDoErro(erro) === 400) {
        const lista = await animalService.listarTodos();
        return { lista, personalizado: false, aviso: mensagemDoErro(erro) };
      }
      throw erro;
    }
  },

  buscarPorId: async (id) => {
    const { data } = await http.get(`/animais/${id}`);
    return data;
  },

  desaparecidos: async () => {
    const { data } = await http.get('/animais/desaparecidos');
    return data;
  },

  // ------------------------------------------------------------ PET DO TUTOR
  // Animal que o próprio tutor registrou (tutor_id = dono). Não entra na
  // vitrine de adoção — é pet particular.

  /** Pets registrados pelo tutor. Os ADOTADOS vêm por solicitacaoService.meusPets(). */
  meus: async () => {
    const { data } = await http.get('/animais/meus');
    return data;
  },

  /** Só nome e espécie são obrigatórios; o resto o backend preenche com 'Não informado'. */
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

  /**
   * Histórico de leituras da Patinha (RF18).
   * ATENÇÃO: hoje a rota é restrita a ONG/desenvolvedor — um tutor recebe 403.
   * A tela MyPet trata isso e mostra o aviso em vez de quebrar.
   * Ver docs/ALINHAMENTO-BACKEND.md, item "leituras da Patinha".
   */
  leituras: async (animalId) => {
    const { data } = await http.get(`/animais/${animalId}/leituras`);
    return data;
  },
};

export default animalService;

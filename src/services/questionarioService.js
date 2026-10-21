// Questionário de afinidade (RF05/RF06/RF09). Rotas sob /auth por design do backend.
import http, { statusDoErro } from './http';
import { getComCache, limparCache } from './cache';

const questionarioService = {
  /**
   * Envia as respostas. Responde com { data, analise, recomendados }.
   * IMPORTANTE: reenviar o questionário muda o feed recomendado E o parecer —
   * limpa o cache inteiro para o tutor não ver recomendações antigas.
   */
  enviar: async (respostas) => {
    const { data } = await http.post('/auth/complete-profile', respostas);
    await limparCache();
    return data;
  },

  /** Parecer já gerado. Cache: 10 min. */
  relatorio: async () => {
    const { dados } = await getComCache('/auth/relatorio', { ttlSegundos: 10 * 60 });
    return dados;
  },

  /** true/false sem estourar erro — decide se a Home mostra o convite. */
  jaRespondeu: async () => {
    try {
      await questionarioService.relatorio();
      return true;
    } catch (erro) {
      if (statusDoErro(erro) === 404) return false;
      throw erro;
    }
  },
};

export default questionarioService;
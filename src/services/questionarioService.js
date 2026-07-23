// Questionário de afinidade (RF05/RF06/RF09).
// Importadores: componente Questionario e telas Home / Match.
//
// As rotas ficam sob /auth porque o backend monta questionario.rotas.js em
// '/api/auth' (ver src/app.js do nima-backend) — não é engano de prefixo.
import http, { statusDoErro } from './http';

const questionarioService = {
  /**
   * Envia as respostas. O backend espera as chaves '1'..'20' (strings),
   * exatamente na ordem das perguntas do componente Questionario.
   * Responde com { data, analise: { status, relatorio, score }, recomendados }.
   */
  enviar: async (respostas) => {
    const { data } = await http.post('/auth/complete-profile', respostas);
    return data;
  },

  /** Parecer já gerado. 404 quando o tutor ainda não respondeu. */
  relatorio: async () => {
    const { data } = await http.get('/auth/relatorio');
    return data;
  },

  /** true/false sem estourar erro — usado para decidir se mostra o convite na Home. */
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

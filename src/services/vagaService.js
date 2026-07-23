// Voluntariado (RF22). Importador: tela Vagas.
// O backend já devolve `preenchidas` e `cheia` prontos — o app não recalcula.
import http from './http';

/** "2/10" quando há limite, "2 aceitos" quando total_vagas é null (sem limite). */
export const contadorDeVagas = (vaga) =>
  vaga?.total_vagas != null
    ? `${vaga.preenchidas ?? 0}/${vaga.total_vagas}`
    : `${vaga?.preenchidas ?? 0} aceitos`;

const vagaService = {
  /** Vagas ativas de todas as ONGs, com `ong: { id, nome, whatsapp, instagram }`. */
  listar: async () => {
    const { data } = await http.get('/vagas');
    return data;
  },

  /** 400 se a vaga estiver cheia, inativa, ou se já houver inscrição do usuário. */
  inscrever: async (vagaId, mensagem) => {
    const { data } = await http.post(`/vagas/${vagaId}/inscricoes`, { mensagem: mensagem || null });
    return data;
  },
};

export default vagaService;

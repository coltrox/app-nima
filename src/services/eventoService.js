// Eventos das ONGs (migração 018). Importadores: telas Patinha e Apoiar.
//
// Evento é PONTUAL e datado (feira de adoção, mutirão); vaga de voluntariado é
// trabalho contínuo. As duas existem e aparecem em Apoiar.
//
// O que só existe aqui: PRESENÇA. Depois do evento a ONG marca quem apareceu,
// e é essa marcação que libera o pedido de uma Patinha. Candidatar-se sozinho
// não libera nada — foi por não haver prova assim que a doação saiu do modelo.
import http from './http';

const eventoService = {
  /**
   * Agenda pública: eventos ativos que ainda não terminaram.
   * Cada item traz `minha_participacao` (null se eu não me candidatei), os
   * contadores `candidatos`/`aceitos`/`presentes` e `cheio`.
   */
  listar: async () => {
    const { data } = await http.get('/eventos');
    return data;
  },

  /**
   * Meus eventos, com o que cada um libera:
   *   patinha_disponivel → presença confirmada e ainda não usada
   *   patinha_ja_pedida  → já virou pedido
   */
  minhas: async () => {
    const { data } = await http.get('/eventos/minhas-participacoes');
    return data;
  },

  /** 400 se o evento já aconteceu, está lotado ou eu já me candidatei. */
  participar: async (eventoId, mensagem) => {
    const { data } = await http.post(`/eventos/${eventoId}/participacoes`, {
      mensagem: mensagem || null,
    });
    return data;
  },

  /** Só enquanto a ONG não decidiu (status 'pendente'). */
  sair: async (participacaoId) => {
    const { data } = await http.delete(`/eventos/participacoes/${participacaoId}/sair`);
    return data;
  },
};

export default eventoService;

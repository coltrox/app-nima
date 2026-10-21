// Eventos das ONGs (migração 018). Importadores: telas Patinha e Apoiar.
//
// Evento é PONTUAL e datado (feira de adoção, mutirão); vaga de voluntariado é
// trabalho contínuo. As duas existem e aparecem em Apoiar.
//
// O que só existe aqui: PRESENÇA. Depois do evento a ONG marca quem apareceu,
// e é essa marcação que libera o pedido de uma Patinha.
import http from './http';
import { getComCache, limparChave } from './cache';

const eventoService = {
  /**
   * Agenda pública. Cache: 5 min — contadores (candidatos/cheio) mudam rápido,
   * então nem pense em subir esse TTL.
   */
  listar: async () => {
    const { dados } = await getComCache('/eventos', { ttlSegundos: 5 * 60 });
    return dados;
  },

  /**
   * Meus eventos (participações e o que cada uma libera).
   * Cache curto: 1 min — `patinha_disponivel` é estado que muda quando a ONG
   * confirma presença e quando eu uso a patinha.
   */
  minhas: async () => {
    const { dados } = await getComCache('/eventos/minhas-participacoes', {
      ttlSegundos: 60,
    });
    return dados;
  },

  /** 400 se o evento já aconteceu, está lotado ou eu já me candidatei. */
  participar: async (eventoId, mensagem) => {
    const { data } = await http.post(`/eventos/${eventoId}/participacoes`, {
      mensagem: mensagem || null,
    });
    // A agenda (minha_participacao, contadores) e a lista minhas mudaram.
    await Promise.all([
      limparChave('/eventos'),
      limparChave('/eventos/minhas-participacoes'),
    ]);
    return data;
  },

  /** Só enquanto a ONG não decidiu (status 'pendente'). */
  sair: async (participacaoId) => {
    const { data } = await http.delete(`/eventos/participacoes/${participacaoId}/sair`);
    await Promise.all([
      limparChave('/eventos'),
      limparChave('/eventos/minhas-participacoes'),
    ]);
    return data;
  },
};

export default eventoService;
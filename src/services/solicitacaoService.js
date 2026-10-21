// Solicitações de adoção (RF07/RF08/RF10) do lado do tutor.
import http from './http';
import { getComCache, limparChave } from './cache';

export const STATUS_ROTULO = {
  pendente: 'Em análise',
  aprovada: 'Aceita — combine a entrega',
  entregue: 'Concluída',
  recusada: 'Não aprovada',
};

const solicitacaoService = {
  criar: async (animalId, mensagem) => {
    const { data } = await http.post('/solicitacoes', { animal_id: animalId, mensagem: mensagem || null });
    await limparChave('/solicitacoes/minhas'); // a lista mudou
    return data;
  },

  /** Cache: 1 min — o status anda por decisão da ONG. */
  minhas: async () => {
    const { dados } = await getComCache('/solicitacoes/minhas', { ttlSegundos: 60 });
    return dados;
  },

  meusPets: async () => {
    const lista = await solicitacaoService.minhas();
    return (lista || []).filter((s) => s.status === 'entregue' && s.animal).map((s) => s.animal);
  },
};

export default solicitacaoService;
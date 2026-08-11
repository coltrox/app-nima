// Solicitações de adoção (RF07/RF08/RF10) do lado do tutor.
// Importadores: telas PetDetails (criar) e Solicitacoes/MyPet (listar).
import http from './http';

export const STATUS_ROTULO = {
  pendente: 'Em análise',
  aprovada: 'Aceita — combine a entrega',
  entregue: 'Concluída',
  recusada: 'Não aprovada',
};

const solicitacaoService = {
  /** O dossiê (questionário + parecer da IA) é anexado pelo backend via tutor_id. */
  criar: async (animalId, mensagem) => {
    const { data } = await http.post('/solicitacoes', { animal_id: animalId, mensagem: mensagem || null });
    return data;
  },

  /** Vem com `animal: { id, nome, especie, raca, porte, idade, status_posse, fotos }`. */
  minhas: async () => {
    const { data } = await http.get('/solicitacoes/minhas');
    return data;
  },

  /**
   * Pets que o tutor efetivamente adotou = candidaturas ENTREGUES. A posse
   * (tutor_id) só passa ao tutor quando a ONG marca "entregue" (migração 022),
   * então antes disso o pet ainda é da ONG e não entra em "Meu Pet". Os
   * entregues também aparecem em /animais/meus (tutor_id); MyPet desduplica.
   */
  meusPets: async () => {
    const lista = await solicitacaoService.minhas();
    return (lista || []).filter((s) => s.status === 'entregue' && s.animal).map((s) => s.animal);
  },
};

export default solicitacaoService;

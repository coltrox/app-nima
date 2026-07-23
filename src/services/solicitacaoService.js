// Solicitações de adoção (RF07/RF08/RF10) do lado do tutor.
// Importadores: telas PetDetails (criar) e Solicitacoes/MyPet (listar).
import http from './http';

export const STATUS_ROTULO = {
  pendente: 'Em análise',
  aprovada: 'Aprovada',
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
   * Pets que o tutor efetivamente adotou.
   * Hoje não existe vínculo tutor→animal no banco (`animais.dono_*` é texto livre
   * preenchido pela ONG), então a adoção aprovada é a única fonte de verdade.
   * Ver docs/ALINHAMENTO-BACKEND.md, item "meus pets".
   */
  meusPets: async () => {
    const lista = await solicitacaoService.minhas();
    return (lista || []).filter((s) => s.status === 'aprovada' && s.animal).map((s) => s.animal);
  },
};

export default solicitacaoService;

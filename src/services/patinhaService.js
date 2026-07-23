// Pedidos de Patinha. Importador: src/screens/App/Patinha/index.jsx.
//
// O tutor pede por uma das três origens; quem despacha é a ONG (doação e
// voluntariado) ou a Nima (compra). Só o voluntariado é verificado pelo
// backend — a doação depende da ONG conferir o extrato dela.
import http from './http';

export const ORIGENS = {
  compra: 'Compra',
  doacao: 'Doação',
  voluntariado: 'Voluntariado',
};

// Rótulo e tom por status, na ordem em que o pedido anda.
export const STATUS = {
  pendente: { rotulo: 'Aguardando resposta', tom: 'ambar', icone: 'time-outline' },
  aprovado: { rotulo: 'Aprovado', tom: 'azul', icone: 'checkmark-circle-outline' },
  enviado: { rotulo: 'A caminho', tom: 'azul', icone: 'send-outline' },
  entregue: { rotulo: 'Entregue', tom: 'verde', icone: 'gift-outline' },
  recusado: { rotulo: 'Não aprovado', tom: 'vermelho', icone: 'close-circle-outline' },
};

/** Pedido ainda em andamento — bloqueia abrir outro no mesmo destino. */
export const estaAberto = (p) => ['pendente', 'aprovado', 'enviado'].includes(p?.status);

const patinhaService = {
  /**
   * @param {object} dados
   *   origem      'compra' | 'doacao' | 'voluntariado'
   *   ong_id      obrigatório em doacao/voluntariado
   *   animal_id   opcional — dá para pedir antes de cadastrar o pet
   *   observacao  recado para quem vai atender
   *   entrega_*   obrigatórios em compra
   *
   * 409 = já existe pedido aberto neste destino.
   * 400 em voluntariado = não há inscrição aceita nessa ONG.
   */
  criar: async (dados) => {
    const { data } = await http.post('/patinhas/pedidos', dados);
    return data;
  },

  meus: async () => {
    const { data } = await http.get('/patinhas/pedidos/meus');
    return data;
  },

  /** Só enquanto ninguém despachou (status 'pendente'). */
  cancelar: async (id) => {
    const { data } = await http.delete(`/patinhas/pedidos/${id}`);
    return data;
  },
};

export default patinhaService;

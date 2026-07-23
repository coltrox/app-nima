// Pedidos de Patinha + posse da tag. Importador: src/screens/App/Patinha/index.jsx.
//
// O tutor pede por uma das três origens; quem despacha é a ONG (evento e
// voluntariado) ou a Nima (compra). AS TRÊS SÃO VERIFICÁVEIS desde a migração
// 018 — 'doacao' saiu porque o Pix cai fora do app e ninguém conseguia conferir.
//
// Despachar NÃO transfere a posse: reserva. A Patinha vira do tutor quando ele
// digita o código no app (`resgatar`) — é assim que ele confirma que o objeto
// físico chegou às mãos dele.
import http from './http';

export const ORIGENS = {
  compra: 'Compra',
  evento: 'Evento',
  voluntariado: 'Voluntariado',
  // Só para não mostrar vazio num pedido criado antes da 018.
  doacao: 'Doação',
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
   *   origem      'compra' | 'evento' | 'voluntariado'
   *   ong_id      obrigatório em evento/voluntariado
   *   evento_id   obrigatório em evento
   *   animal_id   opcional — dá para pedir antes de cadastrar o pet
   *   observacao  recado para quem vai atender
   *   entrega_*   obrigatórios em compra
   *
   * 409 = já existe pedido aberto neste destino (ou já usei este evento).
   * 400 em voluntariado = não há inscrição aceita nessa ONG.
   * 400 em evento       = a ONG ainda não confirmou minha presença.
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

  // --------------------------------------------------------- POSSE (018)

  /** Patinhas que já são minhas, com `url_publica` para o QR. */
  minhas: async () => {
    const { data } = await http.get('/patinhas/minhas');
    return data;
  },

  /**
   * Digita o código da Patinha recebida e ela passa para a minha posse.
   *
   * Só funciona se a ONG tiver reservado no meu nome: os códigos são
   * sequenciais, então saber o código, sozinho, não prova nada.
   *   403 = não está reservada para mim
   *   404 = código não existe
   *   409 = já tem dono, ou o código existe em mais de uma ONG (mande ongSlug)
   */
  resgatar: async (codigo, ongSlug) => {
    const { data } = await http.post('/patinhas/resgatar', {
      codigo,
      ongSlug: ongSlug || undefined,
    });
    return data;
  },
};

export default patinhaService;

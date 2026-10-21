// Vaquinhas (RF21): a ONG cadastra o PRÓPRIO PIX; o app só divulga.
// Importadores: telas Donation e Home (campanha em destaque).
//
// Cache: 1h — campanhas mudam devagar (a ONG edita pelo painel web, não o
// tutor). O `detalhe` tem a mesma validade; a Home pega a em destaque da lista.
import { getComCache } from './cache';

/** Formata um número como "R$ 1.234". Aceita null. */
export const emReais = (valor) => {
  if (valor == null || valor === '') return null;
  const n = Number(valor);
  if (Number.isNaN(n)) return null;
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
};

/**
 * Percentual da meta.
 * O backend NÃO guarda quanto já foi arrecadado (não há integração de pagamento —
 * a doação acontece fora do app, no banco do doador). Sem `arrecadado` não há
 * como calcular progresso real, então isto devolve null e a tela omite a barra.
 * Ver docs/ALINHAMENTO-BACKEND.md, item "progresso da vaquinha".
 */
export const percentualDaMeta = (vaquinha) => {
  const meta = Number(vaquinha?.meta);
  const arrecadado = Number(vaquinha?.arrecadado);
  if (!meta || Number.isNaN(meta) || Number.isNaN(arrecadado)) return null;
  return Math.min(100, Math.round((arrecadado / meta) * 100));
};

const vaquinhaService = {
  /** Vaquinhas ativas de todas as ONGs, já com `ong: { id, nome, whatsapp, instagram }`. */
  listar: async () => {
    const { dados } = await getComCache('/vaquinhas', { ttlSegundos: 3600 });
    return dados;
  },

  detalhe: async (id) => {
    const { dados } = await getComCache(`/vaquinhas/${id}`, { ttlSegundos: 3600 });
    return dados;
  },
};

export default vaquinhaService;
// Guias de cuidado (tela Guia). Conteúdo cadastrado pelo dev no painel web.
// Cache: 24h — só muda quando o dev edita; e mesmo assim a revalidação
// em segundo plano corrige na próxima abertura.
import { getComCache } from './cache';

export function porCategoria(guias) {
  const mapa = {};
  for (const g of guias || []) {
    const chave = g.categoria || 'Geral';
    if (!mapa[chave]) mapa[chave] = [];
    mapa[chave].push(g);
  }
  return mapa;
}

const guiaService = {
  listar: async () => {
    const { dados } = await getComCache('/guias', { ttlSegundos: 24 * 3600 });
    return dados;
  },
};

export default guiaService;
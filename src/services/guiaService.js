// Guias de cuidado (tela Guia). Importador: src/screens/App/Guide/index.jsx.
//
// O conteúdo é cadastrado pelo dev no painel web; o app só lê os ativos,
// já ordenados por categoria e `ordem`.
import http from './http';

/** Agrupa a lista plana em { categoria: [guias] }, preservando a ordem da API. */
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
    const { data } = await http.get('/guias');
    return data;
  },
};

export default guiaService;

// MODO DEMONSTRAÇÃO — o app continua inteiro quando não há servidor nenhum.
//
// Para que serve: na feira do TCC, se o Wi-Fi cair, o Render hibernar ou o
// Supabase ficar fora, o app precisa continuar navegável. Em vez de telas
// vazias e "Sem conexão com o servidor", ele passa a responder a partir de um
// snapshot das respostas REAIS da API, capturado com a produção no ar
// (src/demo/snapshotDemo.json). O formato é idêntico ao do backend porque foi
// gravado dele — não é mock escrito à mão.
//
// A regra que não pode ser quebrada:
//
//   servidor NO AR     → credencial é validada pelo backend, sempre. Senha
//                        errada é senha errada. O modo demo não entra.
//   servidor FORA      → aí sim o app oferece a demonstração.
//
// É por isso que o backend ganhou o 503 `SERVIDOR_INDISPONIVEL` (ver
// nima-backend/src/servicos/falhaDeInfra.js): antes, banco fora de ar voltava
// como 401 "Credenciais inválidas" e era impossível distinguir os dois casos
// aqui no app.
//
// Isto também é a materialização do RNF01 (degradação graciosa) que já estava
// no escopo do projeto — e vale ser dito na banca como decisão de arquitetura,
// não como gambiarra de apresentação.

import AsyncStorage from '@react-native-async-storage/async-storage';
import snapshot from './snapshotDemo.json';

const CHAVE_DEMO = '@nima_modo_demo';

/** Conta de tutor da demonstração (existe de verdade no banco de produção). */
export const CREDENCIAIS_DEMO = {
  email: snapshot?.tutorDemo?.email || 'tutor-demo@nima.app',
  senha: 'Nima123*',
  nome: snapshot?.tutorDemo?.nome || 'Ana Demonstração'
};

export const TOKEN_DEMO = 'demo.sem-servidor.nao-e-um-jwt';

let ativo = false;
const ouvintes = new Set();

// Escritas feitas durante a demonstração. Ficam só em memória: favoritar um pet
// e depois abrir a lista de favoritos tem que ser coerente, senão a demo
// desmonta na mão de quem está testando no estande.
let sobreposicao = { favoritos: [], solicitacoes: [], participacoes: [], pedidosPatinha: [] };

// ------------------------------------------------------------------ estado

export const demoAtivo = () => ativo;

function avisar() {
  for (const fn of ouvintes) {
    try { fn(ativo); } catch { /* um ouvinte quebrado não derruba os outros */ }
  }
}

/** Observa a entrada/saída do modo demo (usado pelo selo no topo da tela). */
export function aoMudarDemo(fn) {
  ouvintes.add(fn);
  return () => ouvintes.delete(fn);
}

export async function ativarDemo() {
  if (ativo) return;
  ativo = true;
  sobreposicao = { favoritos: [], solicitacoes: [], participacoes: [], pedidosPatinha: [] };
  try { await AsyncStorage.setItem(CHAVE_DEMO, '1'); } catch { /* sem storage, vale só nesta sessão */ }
  avisar();
}

export async function desativarDemo() {
  if (!ativo) return;
  ativo = false;
  try { await AsyncStorage.removeItem(CHAVE_DEMO); } catch { /* idem */ }
  avisar();
}

/**
 * Relê o modo demo ao abrir o app. Chamado pelo App.js antes de montar as
 * telas: quem fechou o app em demonstração reabre em demonstração, sem precisar
 * descobrir de novo que o servidor está fora.
 */
export async function restaurarDemo() {
  try {
    if ((await AsyncStorage.getItem(CHAVE_DEMO)) === '1') {
      ativo = true;
      avisar();
    }
  } catch { /* sem storage, começa desligado */ }
  return ativo;
}

// ------------------------------------------------------------------ rotas

/** "https://host/api/animais/123?x=1" → "/animais/123" */
function normalizar(url = '', baseURL = '') {
  let caminho = String(url);
  if (baseURL && caminho.startsWith(baseURL)) caminho = caminho.slice(baseURL.length);
  caminho = caminho.replace(/^https?:\/\/[^/]+/i, '');   // tira host, se veio absoluto
  caminho = caminho.replace(/^\/api(?=\/|$)/, '');        // tira o prefixo /api
  caminho = caminho.split('?')[0].split('#')[0];          // tira query e hash
  if (!caminho.startsWith('/')) caminho = `/${caminho}`;
  return caminho.length > 1 ? caminho.replace(/\/+$/, '') : caminho;
}

const doSnapshot = (metodo, caminho) => snapshot?.respostas?.[`${metodo.toUpperCase()} ${caminho}`];

const COM_SOBREPOSICAO = ['/favoritos', '/solicitacoes/minhas', '/eventos/minhas-participacoes', '/patinhas/pedidos/meus'];

/** Lista do snapshot já com as escritas da sessão por cima. */
function listaComSobreposicao(caminho) {
  const base = doSnapshot('GET', caminho);
  const original = Array.isArray(base) ? base : [];
  if (caminho === '/favoritos') return [...sobreposicao.favoritos, ...original];
  if (caminho === '/solicitacoes/minhas') return [...sobreposicao.solicitacoes, ...original];
  if (caminho === '/eventos/minhas-participacoes') return [...sobreposicao.participacoes, ...original];
  if (caminho === '/patinhas/pedidos/meus') return [...sobreposicao.pedidosPatinha, ...original];
  return original;
}

const animalPorId = (id) =>
  (doSnapshot('GET', '/animais') || []).find((a) => String(a.id) === String(id))
  || (doSnapshot('GET', '/animais/desaparecidos') || []).find((a) => String(a.id) === String(id))
  || null;

const idDaRota = (caminho, padrao) => caminho.match(padrao)?.[1] ?? null;

/**
 * Resolve uma requisição contra o snapshot.
 * Devolve { status, data } — nunca lança, porque em demonstração nada pode
 * derrubar uma tela.
 */
export function resolverDemo(metodo, caminho, corpo) {
  const m = String(metodo || 'GET').toUpperCase();
  const agora = new Date().toISOString();

  // ---- leituras
  if (m === 'GET') {
    const direto = doSnapshot('GET', caminho);
    if (direto !== undefined) {
      return { status: 200, data: COM_SOBREPOSICAO.includes(caminho) ? listaComSobreposicao(caminho) : direto };
    }
    if (COM_SOBREPOSICAO.includes(caminho)) {
      return { status: 200, data: listaComSobreposicao(caminho) };
    }

    // Ficha de um animal que não foi capturada individualmente: monta do feed.
    const idAnimal = idDaRota(caminho, /^\/animais\/([^/]+)$/);
    if (idAnimal) {
      const achado = animalPorId(idAnimal);
      if (achado) return { status: 200, data: achado };
    }

    // Histórico de leituras da Smart Tag: sem servidor, mostramos vazio em vez
    // de erro — a tela já sabe exibir "nenhuma leitura ainda".
    if (/^\/animais\/[^/]+\/leituras$/.test(caminho)) return { status: 200, data: [] };

    // Qualquer outro GET: lista vazia é mais seguro que exceção. As telas do app
    // tratam lista vazia; nenhuma trata um throw do adapter.
    return { status: 200, data: [] };
  }

  // ---- escritas: a demonstração tem que responder "deu certo", senão o
  //      avaliador aperta um botão e o app parece quebrado.

  if (m === 'POST' && caminho === '/favoritos') {
    const id = corpo?.animal_id ?? corpo?.animalId ?? corpo?.id;
    const animal = animalPorId(id);
    if (animal && !sobreposicao.favoritos.some((f) => String(f.id) === String(animal.id))) {
      sobreposicao.favoritos = [{ ...animal, favoritado_em: agora }, ...sobreposicao.favoritos];
    }
    return { status: 201, data: { ok: true, animal_id: id } };
  }

  if (m === 'DELETE' && /^\/favoritos\/[^/]+$/.test(caminho)) {
    const id = idDaRota(caminho, /^\/favoritos\/([^/]+)$/);
    sobreposicao.favoritos = sobreposicao.favoritos.filter((f) => String(f.id) !== String(id));
    return { status: 200, data: { ok: true } };
  }

  if (m === 'POST' && caminho === '/solicitacoes') {
    const id = corpo?.animal_id ?? corpo?.animalId;
    const animal = animalPorId(id);
    sobreposicao.solicitacoes = [{
      id: `demo-${Date.now()}`,
      animal_id: id,
      animal: animal ? { id: animal.id, nome: animal.nome, fotos: animal.fotos } : null,
      nome_animal: animal?.nome ?? null,
      status: 'pendente',
      created_at: agora
    }, ...sobreposicao.solicitacoes];
    return { status: 201, data: { ok: true, message: 'Candidatura enviada!' } };
  }

  if (m === 'POST' && /^\/eventos\/[^/]+\/participacoes$/.test(caminho)) {
    const idEvento = idDaRota(caminho, /^\/eventos\/([^/]+)\/participacoes$/);
    const evento = (doSnapshot('GET', '/eventos') || []).find((e) => String(e.id) === String(idEvento));
    sobreposicao.participacoes = [{
      id: `demo-${Date.now()}`,
      evento_id: idEvento,
      evento: evento ?? null,
      titulo: evento?.titulo ?? null,
      status: 'pendente',
      created_at: agora
    }, ...sobreposicao.participacoes];
    return { status: 201, data: { ok: true } };
  }

  if (m === 'POST' && caminho === '/patinhas/pedidos') {
    sobreposicao.pedidosPatinha = [{
      id: `demo-${Date.now()}`,
      origem: corpo?.origem ?? 'compra',
      status: 'pendente',
      created_at: agora
    }, ...sobreposicao.pedidosPatinha];
    return { status: 201, data: { ok: true } };
  }

  // Match sob demanda: o snapshot tem o parecer de cada animal do feed.
  if (m === 'POST' && /^\/animais\/[^/]+\/match$/.test(caminho)) {
    const guardado = doSnapshot('POST', caminho);
    if (guardado !== undefined) return { status: 200, data: guardado };
    return { status: 200, data: { compatibilidade: null, parecer: 'Parecer indisponível no modo demonstração.' } };
  }

  // Demais escritas: sucesso genérico.
  return { status: 200, data: { ok: true, demo: true } };
}

// ------------------------------------------------------------------ adapter

/**
 * Adapter do axios. Trocar o adapter é o ponto mais limpo de intervenção: as
 * telas e os services continuam chamando `http.get(...)` como sempre, e
 * nenhuma requisição sai do aparelho.
 */
export function adaptadorDemo(config = {}) {
  const caminho = normalizar(config.url, config.baseURL);

  let corpo = config.data;
  if (typeof corpo === 'string') {
    try { corpo = JSON.parse(corpo); } catch { /* FormData ou texto: segue cru */ }
  }

  const { status, data } = resolverDemo(config.method, caminho, corpo);

  // Pequeno atraso de propósito: resposta instantânea faz o app parecer
  // congelado (os spinners piscam e somem). 180ms dá a sensação de rede.
  return new Promise((resolve) => {
    setTimeout(() => resolve({
      data,
      status,
      statusText: 'OK (demonstracao)',
      headers: {},
      config,
      request: { demo: true }
    }), 180);
  });
}

/**
 * true quando o erro significa "não falei com servidor nenhum" — e não
 * "o servidor respondeu e recusou". É o gatilho para oferecer a demonstração.
 */
export function ehServidorInacessivel(erro) {
  if (!erro) return false;
  if (!erro.response) return true;                                  // rede, DNS, timeout
  if (erro.response.status === 503) return true;                    // SERVIDOR_INDISPONIVEL
  return erro.response?.data?.codigo === 'SERVIDOR_INDISPONIVEL';
}

export default { demoAtivo, ativarDemo, desativarDemo, restaurarDemo, adaptadorDemo, ehServidorInacessivel };

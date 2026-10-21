// Cliente HTTP único do app.
//
// Importadores: todos os services em src/services/*.js (animalService,
// vaquinhaService, solicitacaoService, vagaService, ongService, perfilService,
// questionarioService, tagService). Nenhuma tela usa axios direto.
//
// Responsabilidades:
//  1. baseURL vinda de src/config/api.js (fonte única — nunca hardcodar URL);
//  2. anexar o Bearer token salvo em @nima_token a cada requisição;
//  3. transformar erro do axios numa mensagem em português já pronta pra tela;
//  4. encerrar a sessão quando o token do Supabase expirar.
//
// O app conversa SOMENTE com o Render — o antigo fallback que reenviava ao
// Render quando o backend local não respondia saiu daqui junto com o local.
//
// O backend não tem um formato de erro único: uns controladores devolvem
// { error }, outros { message }. `mensagemDoErro` cobre os dois.
//
// Cache (services/cache.js): quando a sessão cai, o cache de leitura vai junto —
// dados de perfis/vagas/favoritos de um usuário não podem aparecer pro próximo.
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';
import { irParaLogin } from './navegacao';
import { limparCache } from './cache';
import { demoAtivo, adaptadorDemo } from '../demo/modoDemo';

export const TOKEN_KEY = '@nima_token';

const CHAVES_SESSAO = ['@nima_token', '@nima_user_role', '@nima_user_name', '@nima_profile_completed'];

// O token do Supabase expira (~1h) e o app não o renova. Com "Lembrar-me" a Home
// abria com um token vencido e toda chamada voltava 403. O backend responde
// "Token inválido ou expirado." nesse caso — olhamos a mensagem, não só o status,
// porque 403 também significa "sem permissão" em outras rotas (ex.: MyPet).
const sessaoExpirou = (erro) => {
  const status = erro?.response?.status;
  const texto = String(erro?.response?.data?.message || erro?.response?.data?.error || '');
  const rotaDeLogin = /\/auth\//.test(erro?.config?.url || '');
  return !rotaDeLogin && (status === 401 || (status === 403 && /token inv[aá]lido ou expirado/i.test(texto)));
};

let saindo = false;
async function encerrarSessao() {
  if (saindo) return;
  saindo = true;
  try {
    // Cache de leitura é por usuário: sai junto com a sessão.
    await limparCache();
    await AsyncStorage.multiRemove(CHAVES_SESSAO);
  } finally {
    irParaLogin();
    saindo = false;
  }
}

const http = axios.create({
  baseURL: API_URL,
  // O Render free hiberna: o primeiro request depois de ocioso leva ~50s.
  timeout: 60000,
});

http.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Modo demonstração: troca o adapter do axios, então a requisição é resolvida
  // pelo snapshot local e NADA sai do aparelho. Feito aqui, no cliente único,
  // para que nenhuma tela nem service precise saber que a demonstração existe.
  if (demoAtivo()) config.adapter = adaptadorDemo;

  return config;
});

http.interceptors.response.use(
  (resp) => resp,
  async (erro) => {
    if (sessaoExpirou(erro)) await encerrarSessao();
    return Promise.reject(erro);
  }
);

/** Extrai a mensagem legível de um erro do axios. */
export function mensagemDoErro(erro, fallback = 'Não foi possível concluir. Tente de novo.') {
  const corpo = erro?.response?.data;
  if (typeof corpo === 'string' && corpo.trim()) return corpo;
  const texto = corpo?.error || corpo?.message;
  if (texto) return texto;
  if (erro?.code === 'ECONNABORTED') return 'O servidor demorou demais para responder. Tente de novo.';
  if (!erro?.response) return 'Sem conexão com o servidor.';
  return fallback;
}

/** Status HTTP da resposta (ou null se a requisição nem chegou no servidor). */
export const statusDoErro = (erro) => erro?.response?.status ?? null;

/** true quando a sessão caiu (token expirado/ausente). */
export const ehSessaoExpirada = (erro) => statusDoErro(erro) === 401;

export default http;
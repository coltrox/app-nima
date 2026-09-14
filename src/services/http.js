// Cliente HTTP único do app.
//
// Importadores: todos os services em src/services/*.js (animalService,
// vaquinhaService, solicitacaoService, vagaService, ongService, perfilService,
// questionarioService, tagService). Nenhuma tela usa axios direto.
//
// Responsabilidades:
//  1. baseURL vinda de src/config/api.js (fonte única — nunca hardcodar URL);
//  2. anexar o Bearer token salvo em @nima_token a cada requisição;
//  3. transformar erro do axios numa mensagem em português já pronta pra tela.
//
// O backend não tem um formato de erro único: uns controladores devolvem
// { error }, outros { message }. `mensagemDoErro` cobre os dois.
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, RENDER_URL } from '../config/api';
import { irParaLogin } from './navegacao';

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
  return config;
});

// Fallback automático: se o backend LOCAL (dev) não responder (erro de rede/
// conexão recusada), a requisição é reenviada ao Render. Assim o app funciona em
// qualquer máquina SEM precisar do backend/n8n locais rodando (ex.: outro PC).
// Em produção API_URL já é o Render, então este caminho nem é acionado.
http.interceptors.response.use(
  (resp) => resp,
  async (erro) => {
    const cfg = erro?.config;
    const semResposta = !erro?.response; // erro de rede, não uma resposta HTTP
    const usandoLocal = API_URL !== RENDER_URL;
    if (semResposta && usandoLocal && cfg && !cfg.__tentouRender) {
      cfg.__tentouRender = true;
      cfg.baseURL = RENDER_URL;
      return http(cfg);
    }
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

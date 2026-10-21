// src/services/cache.js
//
// Cache de leitura (GET) em AsyncStorage com padrão stale-while-revalidate:
// a tela recebe os dados guardados NA HORA e a rede atualiza em paralelo.
// Usado só em endpoints de leitura; POST/PUT/DELETE continuam indo direto.
//
// Regras:
//  - ttlSegundos: 0 = sem validade (mostra cache sempre que a rede falhar);
//  - cada service define o TTL que fizer sentido (ex.: ONGs = 6h);
//  - Modo demo: o adaptadorDemo já resolve no http.js, cache nem é consultado.
import AsyncStorage from '@react-native-async-storage/async-storage';
import http from './http';

const PREFIXO = '@nima_cache_';
const MARCA = '__ts';

const chave = (url, params) => {
  const qs = params ? JSON.stringify(params) : '';
  return `${PREFIXO}${url}${qs}`;
};

/** Dados da entrada (qualquer idade se ttl=0) ou null se não existe/corrompido. */
async function fresco(key, ttlSegundos) {
  const cru = await AsyncStorage.getItem(key);
  if (!cru) return null;
  try {
    const pacote = JSON.parse(cru);
    if (!ttlSegundos) return pacote.dados;
    const idade = (Date.now() - pacote[MARCA]) / 1000;
    return idade <= ttlSegundos ? pacote.dados : null;
  } catch {
    return null;
  }
}

/**
 * GET com cache (stale-while-revalidate).
 * 1. Cache fresco → devolve na hora + revalida em segundo plano;
 * 2. Sem cache → rede; se a rede falhar, devolve o cache vencido;
 * 3. Nada em lugar nenhum → o erro sobe pra tela tratar.
 *
 * @returns {Promise<{dados: any, doCache: boolean}>}
 */
export async function getComCache(url, { ttlSegundos = 300, params } = {}) {
  const key = chave(url, params);

  const salvo = await fresco(key, ttlSegundos);
  if (salvo !== null) {
    http.get(url, { params })
      .then((resp) => AsyncStorage.setItem(
        key,
        JSON.stringify({ [MARCA]: Date.now(), dados: resp.data })
      ))
      .catch(() => {});
    return { dados: salvo, doCache: true };
  }

  try {
    const resp = await http.get(url, { params });
    AsyncStorage.setItem(key, JSON.stringify({ [MARCA]: Date.now(), dados: resp.data }))
      .catch(() => {});
    return { dados: resp.data, doCache: false };
  } catch (erro) {
    const vencido = await fresco(key, 0);
    if (vencido !== null) return { dados: vencido, doCache: true };
    throw erro;
  }
}

/** Invalida UMA rota (ex.: depois de um POST que muda a lista). */
export async function limparChave(url, params) {
  try {
    await AsyncStorage.removeItem(chave(url, params));
  } catch {}
}

/** Invalida tudo (logout / troca de usuário / questionário reenviado). */
export async function limparCache() {
  const chaves = await AsyncStorage.getAllKeys();
  const doApp = chaves.filter((k) => k.startsWith(PREFIXO));
  if (doApp.length) await AsyncStorage.multiRemove(doApp);
}
// Fonte única da URL do backend. TODO service novo importa daqui —
// nunca hardcodar URL em tela/service (foi assim que o app ficou meses
// apontando pro Render antigo e morto).
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Porta do backend Express local (src/server.js → PORT || 3000).
const PORTA_BACKEND_LOCAL = 3000;

// Backend de produção (ver nima-backend/docs/AMBIENTES.md).
export const RENDER_URL = 'https://nima-backend-ofc.onrender.com/api';

// Variable global mutável para armazenar a URL ativa em tempo de execução
export let API_URL = RENDER_URL;

function hostDoExpo() {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    return window.location.hostname;
  }
  const uri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    Constants.manifest?.debuggerHost ||
    '';
  const host = String(uri).split(':')[0].trim();
  return host || null;
}

// Testa se o backend local responde a requisições curtas (timeout de 1.5s)
async function verificarBackendLocal(urlLocal) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    // Tenta bater na raiz da API ou no endpoint de healthcheck
    await fetch(urlLocal, { method: 'GET', signal: controller.signal });
    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    return false;
  }
}

async function resolverBaseURL() {
  if (__DEV__) {
    const host = hostDoExpo();
    if (host) {
      const urlLocal = `http://${host}:${PORTA_BACKEND_LOCAL}/api`;
      const localAtivo = await verificarBackendLocal(urlLocal);
      
      if (localAtivo) {
        API_URL = urlLocal;
        return urlLocal;
      }
    }
  }
  
  API_URL = RENDER_URL;
  return RENDER_URL;
}

// Executa a checagem no carregamento do módulo
resolverBaseURL();

// Fonte única da URL do backend. TODO service novo importa daqui —
// nunca hardcodar URL em tela/service (foi assim que o app ficou meses
// apontando pro Render antigo e morto).
//
// EM DESENVOLVIMENTO (__DEV__), aponta para o backend LOCAL rodando na sua
// máquina, derivando o IP do próprio host do Expo (Constants.expoConfig.hostUri,
// ex.: "192.168.0.174:8081"). Assim funciona no celular físico (Expo Go), no
// emulador e no web sem precisar chumbar IP — o backend escuta em 0.0.0.0:3000.
// Isso é o que permite o app conversar com o n8n local (o backend local alcança
// http://localhost:5678). EM PRODUÇÃO (build publicado), usa o Render.
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Porta do backend Express local (src/server.js → PORT || 3000).
const PORTA_BACKEND_LOCAL = 3000;

const RENDER_URL = 'https://nima-backend-ofc.onrender.com/api';

// "192.168.0.174:8081" | "localhost:8081" → só o host, sem a porta do Metro.
function hostDoExpo() {
  // Web (Expo web): Constants.hostUri costuma vir vazio no navegador — usa o
  // host da própria página. Sem isto, o app caía no fallback do Render (que não
  // tem as rotas novas, ex.: POST /animais/:id/match → "Cannot POST").
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

function resolverBaseURL() {
  if (__DEV__) {
    const host = hostDoExpo();
    if (host) return `http://${host}:${PORTA_BACKEND_LOCAL}/api`;
  }
  return RENDER_URL;
}

export const API_URL = resolverBaseURL();

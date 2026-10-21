// Fonte única da URL do backend. TODO service novo importa daqui —
// nunca hardcodar URL em tela/service.
//
// O app conversa SOMENTE com o Render, inclusive em desenvolvimento. O backend
// LOCAL (porta 3000) foi desativado — se um dia voltar, recupere pelo Git.
//
// EXPO_PUBLIC_API_URL continua válido para apontar a outro ambiente sem trocar
// código (ex.: homologação), definido no .env ou no comando do Expo.
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://nima-backend-ofc.onrender.com/api';
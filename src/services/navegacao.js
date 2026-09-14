// Navegação fora de componentes (ex.: interceptor do http.js).
//
// Importadores: App.js (liga o ref no NavigationContainer) e services/http.js
// (manda para o Login quando a sessão expira).
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/** Zera a pilha e abre o Login. Sem navegação pronta (app iniciando), não faz nada. */
export function irParaLogin() {
  if (!navigationRef.isReady()) return;
  if (navigationRef.getCurrentRoute()?.name === 'Login') return;
  navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
}

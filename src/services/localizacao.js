// Localização do tutor para o feed por raio (Vitrine Inteligente).
//
// Lê o GPS do aparelho e grava no perfil (profiles.latitude/longitude), que o
// backend usa para filtrar/ranquear os pets por proximidade. Se a permissão
// for negada ou o GPS falhar (comum no preview web), cai no DEFAULT de
// Campinas — o raio nunca quebra.
//
// Importador: tela Home (sincroniza uma vez por execução do app).
import * as Location from 'expo-location';
import perfilService from './perfilService';

export const CAMPINAS = { latitude: -22.9099, longitude: -47.0626 };

// Em memória, não AsyncStorage: cada abertura do app relê o GPS (mais fresco).
let jaSincronizou = false;

async function obterCoords() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return CAMPINAS;
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const { latitude, longitude } = pos.coords || {};
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) return { latitude, longitude };
    return CAMPINAS;
  } catch {
    return CAMPINAS;
  }
}

const localizacao = {
  CAMPINAS,

  /**
   * Garante que o perfil tem coordenadas. Envia GPS (ou Campinas) uma vez por
   * execução — passe { forcar: true } para reenviar. Devolve as coords usadas
   * (ou null se não deu para enviar), para a Home recarregar o feed.
   */
  sincronizar: async ({ forcar = false } = {}) => {
    if (!forcar && jaSincronizou) return null;
    try {
      const coords = await obterCoords();
      await perfilService.atualizar(coords);
      jaSincronizou = true;
      return coords;
    } catch {
      return null;
    }
  },
};

export default localizacao;

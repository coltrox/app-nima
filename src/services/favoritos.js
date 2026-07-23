// Favoritos do tutor.
//
// Mora só no aparelho (AsyncStorage): o backend não tem tabela de favoritos, e
// favoritar é uma intenção privada — não gera solicitação nem avisa a ONG.
// Consequência assumida: trocar de celular perde a lista.
// Ver docs/ALINHAMENTO-BACKEND.md, item "favoritos".
//
// Importadores: telas Match, PetDetails, Desaparecidos e Profile.
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = '@nima_favoritos';

// Os ids de `animais` são bigint; guardamos como string para o filtro não
// tropeçar em 12 !== '12' vindo de rotas diferentes.
const normalizar = (id) => String(id);

async function ler() {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE);
    const lista = bruto ? JSON.parse(bruto) : [];
    return Array.isArray(lista) ? lista.map(normalizar) : [];
  } catch {
    return [];
  }
}

const favoritos = {
  listar: ler,

  ehFavorito: async (id) => (await ler()).includes(normalizar(id)),

  /** Alterna e devolve o estado novo (true = agora é favorito). */
  alternar: async (id) => {
    const alvo = normalizar(id);
    const atuais = await ler();
    const jaEstava = atuais.includes(alvo);
    const novos = jaEstava ? atuais.filter((x) => x !== alvo) : [...atuais, alvo];
    await AsyncStorage.setItem(CHAVE, JSON.stringify(novos));
    return !jaEstava;
  },

  limpar: () => AsyncStorage.removeItem(CHAVE),
};

export default favoritos;

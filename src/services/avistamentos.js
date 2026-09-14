// Histórico local de avistamentos (RF01).
//
// Tudo fica no AsyncStorage do aparelho: dá para registrar e consultar sem
// internet. Não há tabela no backend para isso — é um registro pessoal do
// tutor que viu um animal do Mural de Desaparecidos.
//
// Formato de cada item:
//   { id, criadoEm (ISO), descricao, foto (uri|null), observacao,
//     coords ({ latitude, longitude }|null), precisao (m|null) }
//
// Importadores: App/Avistamento (salvar), App/MeusAvistamentos (listar/remover).
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = '@nima_avistamentos';

async function gravar(lista) {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(lista));
}

const avistamentos = {
  /** Mais recentes primeiro. Dado corrompido vira lista vazia, nunca crash. */
  listar: async () => {
    try {
      const bruto = await AsyncStorage.getItem(CHAVE);
      const lista = bruto ? JSON.parse(bruto) : [];
      return Array.isArray(lista) ? lista : [];
    } catch {
      return [];
    }
  },

  /** Salva e devolve o registro com id e data. Lança erro se o disco falhar. */
  salvar: async (dados) => {
    const lista = await avistamentos.listar();
    const novo = { id: String(Date.now()), criadoEm: new Date().toISOString(), ...dados };
    await gravar([novo, ...lista]);
    return novo;
  },

  remover: async (id) => {
    const lista = await avistamentos.listar();
    const restante = lista.filter((a) => a.id !== id);
    await gravar(restante);
    return restante;
  },
};

export default avistamentos;

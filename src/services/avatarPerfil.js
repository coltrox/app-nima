// Foto de perfil do tutor = foto de um pet dele (o app não guarda foto do tutor).
// A escolha (quando ele tem mais de um pet) fica no aparelho; assim outras telas
// (ex.: header da Home) mostram o mesmo avatar sem precisar recarregar os pets.
//
// Importadores: telas Profile (escolhe) e Home (exibe).
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = '@nima_foto_perfil';

const avatarPerfil = {
  /** URI da foto escolhida como avatar, ou null. */
  obter: async () => {
    try {
      return (await AsyncStorage.getItem(CHAVE)) || null;
    } catch {
      return null;
    }
  },

  /** Salva a URI escolhida (ou remove, se null). */
  definir: async (uri) => {
    try {
      if (uri) await AsyncStorage.setItem(CHAVE, uri);
      else await AsyncStorage.removeItem(CHAVE);
    } catch {
      // silencioso: é só preferência de exibição
    }
  },
};

export default avatarPerfil;

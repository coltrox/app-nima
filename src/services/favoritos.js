// Favoritos do tutor — agora no BACKEND (migração 019), não mais no aparelho.
//
// Antes moravam no AsyncStorage e trocar de celular perdia a lista. Agora ficam
// por conta, no servidor, e aparecem em qualquer login. A interface antiga foi
// preservada (`listar`, `ehFavorito`, `alternar`, `limpar`) para as telas Match
// e PetDetails não precisarem mudar; `listarPets` é novo, para o Perfil mostrar
// os cards direto (inclusive pets já adotados, que saíram da vitrine).
//
// Importadores: telas Match, PetDetails e Profile.
import http from './http';

// Os ids de `animais` são bigint; guardamos/comparamos como string para o
// filtro não tropeçar em 12 !== '12' vindo de rotas diferentes.
const normalizar = (id) => String(id);

const favoritos = {
  /** Os pets favoritados, completos. Rede indisponível → lista vazia. */
  listarPets: async () => {
    try {
      const { data } = await http.get('/favoritos');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  /** Só os ids (string), para marcar o coração nas listas. */
  listar: async () => {
    const pets = await favoritos.listarPets();
    return pets.map((p) => normalizar(p.id));
  },

  ehFavorito: async (id) => (await favoritos.listar()).includes(normalizar(id)),

  /**
   * Alterna e devolve o estado novo (true = agora é favorito).
   * Idempotente no servidor; em falha de rede devolve o estado atual para o
   * botão não travar nem mentir.
   */
  alternar: async (id) => {
    try {
      const jaEra = await favoritos.ehFavorito(id);
      if (jaEra) {
        await http.delete(`/favoritos/${normalizar(id)}`);
        return false;
      }
      await http.post('/favoritos', { animal_id: id });
      return true;
    } catch {
      return favoritos.ehFavorito(id).catch(() => false);
    }
  },

  // A lista vive por conta no servidor; sair da conta já a deixa inacessível.
  // Mantido só para não quebrar quem ainda chama.
  limpar: async () => {},
};

export default favoritos;

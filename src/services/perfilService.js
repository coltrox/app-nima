// Perfil do usuário logado. Importadores: telas Profile e Settings.
import http from './http';

// O backend só aceita estes campos no PUT (email/cpf/cargo são imutáveis).
export const CAMPOS_EDITAVEIS = [
  'nome', 'telefone', 'cnpj', 'endereco', 'latitude', 'longitude',
  'pix_key', 'whatsapp', 'instagram',
];

const perfilService = {
  obter: async () => {
    const { data } = await http.get('/auth/profile');
    return data;
  },

  /** Envia só os campos que o backend aceita; o resto é descartado silenciosamente. */
  atualizar: async (patch) => {
    const corpo = {};
    for (const campo of CAMPOS_EDITAVEIS) {
      if (patch[campo] !== undefined) corpo[campo] = patch[campo];
    }
    const { data } = await http.put('/auth/profile', corpo);
    return data;
  },
};

export default perfilService;

// Perfil do usuário logado. Importadores: telas Profile, Settings, PetDetails
// (dossiê de adoção).
import http from './http';

// O backend só aceita estes campos no PUT (email/cpf/cargo são imutáveis).
export const CAMPOS_EDITAVEIS = [
  'nome', 'telefone', 'cnpj', 'endereco', 'latitude', 'longitude',
  'pix_key', 'whatsapp', 'instagram', 'documento_tipo',
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

  /**
   * Sobe um documento do dossiê (RG/CNH ou comprovante) para o bucket privado.
   * `tipo` = 'documento' | 'comprovante'. `asset` vem do expo-image-picker
   * ({ uri, fileName?, mimeType? }). O backend guarda o path e devolve signed URL.
   */
  enviarDocumento: async (tipo, asset) => {
    const form = new FormData();
    form.append('tipo', tipo);
    form.append('arquivo', {
      uri: asset.uri,
      name: asset.fileName || `${tipo}.jpg`,
      type: asset.mimeType || 'image/jpeg',
    });
    // Em RN, deixamos o boundary por conta do fetch nativo — só marcamos multipart.
    const { data } = await http.post('/auth/documentos', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};

export default perfilService;

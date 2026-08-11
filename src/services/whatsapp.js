// Link de contato direto por WhatsApp (wa.me) com mensagem pré-preenchida.
// Importadores: PetDetails e Solicitacoes (contato tutor ↔ ONG na adoção).
import { Linking } from 'react-native';

/** Monta o link wa.me a partir de um número (assume Brasil se vier sem DDI). */
export function linkWhatsapp(numero, texto = '') {
  const limpo = String(numero || '').replace(/\D/g, '');
  if (!limpo) return null;
  const comDDI = limpo.length <= 11 ? `55${limpo}` : limpo;
  const q = texto ? `?text=${encodeURIComponent(texto)}` : '';
  return `https://wa.me/${comDDI}${q}`;
}

/** Abre o WhatsApp no número informado. Retorna false se não houver número. */
export async function abrirWhatsapp(numero, texto) {
  const url = linkWhatsapp(numero, texto);
  if (!url) return false;
  await Linking.openURL(url);
  return true;
}

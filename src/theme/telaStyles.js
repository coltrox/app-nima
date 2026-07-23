// Folha compartilhada das telas novas (Match, PetDetails, SmartTag,
// Solicitacoes, Vagas, Ongs, Desaparecidos).
//
// As telas antigas continuam com o styles.js próprio; estas nasceram juntas e
// dividem o mesmo esqueleto — cabeçalho, card de lista, botão, badge —, então
// um arquivo só evita sete cópias do mesmo CSS.
import { StyleSheet, Dimensions, Platform } from 'react-native';
import { BRAND } from './index';

const { width } = Dimensions.get('window');
export const PAD = width * 0.055;
export const LARGURA_CARD = (width - PAD * 2 - 12) / 2;

export const t = StyleSheet.create({
  tela: { flex: 1, backgroundColor: BRAND.bg },
  scroll: { flex: 1 },
  conteudo: { paddingBottom: 110 },
  conteudoSemBarra: { paddingBottom: 32 },

  // ---- Cabeçalho ----
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: PAD,
    paddingTop: Platform.OS === 'ios' ? 12 : 44,
  },
  voltar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: BRAND.card,
    borderWidth: 1,
    borderColor: BRAND.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cabecalhoDireita: { flexDirection: 'row', alignItems: 'center', gap: 14, marginLeft: 'auto' },

  titulo: { fontSize: 29, fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink, marginHorizontal: PAD, marginTop: 14 },
  subtitulo: { fontSize: 14.5, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, marginHorizontal: PAD, marginTop: 2, lineHeight: 20 },
  secao: { fontSize: 19, fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink, marginHorizontal: PAD, marginTop: 24, marginBottom: 10 },

  // ---- Busca ----
  buscaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: BRAND.card,
    borderWidth: 1,
    borderColor: BRAND.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: PAD,
    marginTop: 14,
  },
  buscaInput: { flex: 1, fontSize: 14.5, fontFamily: 'Nunito_400Regular', color: BRAND.ink, padding: 0 },

  // ---- Card genérico ----
  card: {
    backgroundColor: BRAND.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BRAND.border,
    marginHorizontal: PAD,
    marginTop: 12,
    padding: 16,
  },
  cardTitulo: { fontSize: 17, fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink },
  cardTexto: { fontSize: 13.5, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, marginTop: 4, lineHeight: 19 },
  cardLinha: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  cardLinhaTexto: { flex: 1, fontSize: 13.5, fontFamily: 'Nunito_600SemiBold', color: BRAND.ink },

  // ---- Grade de pets (2 colunas) ----
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: PAD, marginTop: 12 },
  petCard: {
    width: LARGURA_CARD,
    backgroundColor: BRAND.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BRAND.border,
    overflow: 'hidden',
  },
  petFoto: { width: '100%', height: 128 },
  petFotoVazia: { width: '100%', height: 128, backgroundColor: '#E7EEFB', alignItems: 'center', justifyContent: 'center' },
  petCorpo: { padding: 12 },
  petNome: { fontSize: 16, fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink },
  petMeta: { fontSize: 12.5, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, marginTop: 2 },

  // ---- Badges ----
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 11,
  },
  badgeTexto: { fontSize: 12, fontFamily: 'Nunito_700Bold' },
  badgeAzul: { backgroundColor: '#E7EEFB' },
  badgeAzulTexto: { color: BRAND.blue },
  badgeVerde: { backgroundColor: '#E3F3E9' },
  badgeVerdeTexto: { color: BRAND.success },
  badgeAmbar: { backgroundColor: '#FFF3D6' },
  badgeAmbarTexto: { color: '#8A6100' },
  badgeVermelho: { backgroundColor: '#FBE9E7' },
  badgeVermelhoTexto: { color: BRAND.danger },

  // Sobreposto na foto do pet.
  badgeFoto: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(255,255,255,0.94)' },

  // ---- Botões ----
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BRAND.blue,
    borderRadius: 14,
    paddingVertical: 15,
  },
  botaoTexto: { color: '#fff', fontFamily: 'Nunito_800ExtraBold', fontSize: 15.5 },
  botaoDesabilitado: { backgroundColor: '#D8D2C4' },
  botaoTextoDesabilitado: { color: '#8A8577' },
  botaoSecundario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BRAND.card,
    borderWidth: 1.5,
    borderColor: BRAND.blue,
    borderRadius: 14,
    paddingVertical: 13,
  },
  botaoSecundarioTexto: { color: BRAND.blue, fontFamily: 'Nunito_700Bold', fontSize: 14.5 },
  botaoPequeno: { backgroundColor: BRAND.blue, borderRadius: 12, paddingVertical: 9, paddingHorizontal: 16 },
  botaoPequenoTexto: { color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 13.5 },

  // ---- Campo de texto ----
  campo: {
    backgroundColor: BRAND.card,
    borderWidth: 1.5,
    borderColor: BRAND.border,
    borderRadius: 14,
    padding: 15,
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    color: BRAND.ink,
  },
  campoMultilinha: { height: 110, textAlignVertical: 'top' },
  rotulo: { fontSize: 13, fontFamily: 'Nunito_700Bold', color: BRAND.ink, marginBottom: 8 },

  // ---- Barra de progresso (vagas) ----
  barraBg: { flex: 1, height: 8, borderRadius: 99, backgroundColor: '#E4E7EC' },
  barraFill: { height: '100%', borderRadius: 99, backgroundColor: BRAND.blue },
  barraCheia: { backgroundColor: BRAND.success },

  // ---- Faixa de rodapé fixa (ação principal) ----
  rodape: {
    borderTopWidth: 1,
    borderTopColor: BRAND.border,
    backgroundColor: BRAND.bg,
    paddingHorizontal: PAD,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 18,
  },

  // Mensagem de resultado de ação (sucesso/erro) dentro da tela.
  faixaSucesso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E3F3E9',
    borderRadius: 14,
    padding: 13,
    marginHorizontal: PAD,
    marginTop: 12,
  },
  faixaSucessoTexto: { flex: 1, fontSize: 13.5, fontFamily: 'Nunito_600SemiBold', color: BRAND.success, lineHeight: 19 },
  faixaErro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FBE9E7',
    borderRadius: 14,
    padding: 13,
    marginHorizontal: PAD,
    marginTop: 12,
  },
  faixaErroTexto: { flex: 1, fontSize: 13.5, fontFamily: 'Nunito_600SemiBold', color: BRAND.danger, lineHeight: 19 },
});

export default t;

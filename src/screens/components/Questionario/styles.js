// Questionário de afinidade (tela 10) — paleta BRAND.
//
// Estrutura do design: cabeçalho com "Salvar e sair", hero, barra "Etapa X de 5",
// trilha de 5 etapas, card da pergunta com opções em cartão, painel navy com o
// anel de progresso do perfil, resumo da etapa concluída, bloco recolhível das
// outras 15 perguntas e rodapé "Próxima pergunta" / "Voltar".
import { StyleSheet, Dimensions, Platform } from 'react-native';
import { BRAND } from '../../../theme';

const { width } = Dimensions.get('window');
const PAD = width * 0.055;

// Três opções cabem lado a lado; com 4 opções elas quebram para a linha de baixo.
export const LARGURA_OPCAO = (width - PAD * 2 - 20) / 3;

export const colors = {
  navy: BRAND.ink,
  blue: BRAND.blue,
  white: BRAND.card,
  gray: BRAND.inkSoft,
  lightGray: '#F3EFE4',
  border: BRAND.border,
};

export const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: BRAND.bg },
  scroll: { flex: 1 },
  conteudo: { paddingBottom: 24 },

  // ---- Cabeçalho ----
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PAD,
    paddingTop: Platform.OS === 'ios' ? 8 : 40,
  },
  voltarCirculo: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: BRAND.card,
    borderWidth: 1,
    borderColor: BRAND.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  salvarSair: { fontSize: 14.5, fontFamily: 'Nunito_700Bold', color: BRAND.blue },

  // ---- Hero ----
  heroRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: PAD, marginTop: 18 },
  heroTitulo: { fontSize: 32, fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink, lineHeight: 38 },
  heroTexto: { fontSize: 14.5, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, marginTop: 8, lineHeight: 20 },
  heroArte: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#EDF3FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  // ---- Barra de etapa ----
  etapaLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: PAD,
    marginTop: 24,
    marginBottom: 8,
  },
  etapaTexto: { fontSize: 15, fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink },
  etapaPct: { fontSize: 15, fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink },
  barraBg: { height: 7, borderRadius: 99, backgroundColor: '#E4DFD0', marginHorizontal: PAD, overflow: 'hidden' },
  barraFill: { height: '100%', borderRadius: 99, backgroundColor: BRAND.blue },

  // ---- Trilha das 5 etapas ----
  trilha: { flexDirection: 'row', paddingHorizontal: PAD, marginTop: 22, alignItems: 'flex-start' },
  trilhaItem: { flex: 1, alignItems: 'center' },
  trilhaCirculo: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: BRAND.card,
    borderWidth: 1.5,
    borderColor: BRAND.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trilhaCirculoAtual: {
    backgroundColor: BRAND.blue,
    borderColor: BRAND.blue,
    borderWidth: 4,
    // O anel externo claro do design, feito com sombra em vez de View extra.
    shadowColor: BRAND.blue,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  trilhaCheck: {
    position: 'absolute',
    top: -2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: BRAND.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: BRAND.bg,
  },
  trilhaRotulo: { fontSize: 11.5, fontFamily: 'Nunito_700Bold', color: BRAND.inkSoft, marginTop: 7, textAlign: 'center' },
  trilhaRotuloAtual: { color: BRAND.blue },
  // Linha pontilhada entre os círculos.
  trilhaLigacao: {
    position: 'absolute',
    top: 27,
    height: 2,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#C9D2DE',
  },

  // ---- Card da pergunta ----
  cardPergunta: {
    backgroundColor: BRAND.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BRAND.border,
    marginHorizontal: PAD,
    marginTop: 22,
    padding: 18,
  },
  perguntaNumero: {
    fontSize: 11.5,
    fontFamily: 'Nunito_800ExtraBold',
    color: BRAND.blue,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  perguntaTexto: { fontSize: 21, fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink, lineHeight: 28 },
  perguntaDica: { fontSize: 13.5, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, marginTop: 6, lineHeight: 19 },

  opcoesLinha: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
  opcaoCard: {
    width: LARGURA_OPCAO,
    minHeight: 128,
    backgroundColor: BRAND.card,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: BRAND.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 8,
  },
  opcaoCardAtiva: { backgroundColor: BRAND.blue, borderColor: BRAND.blue },
  opcaoCheck: { position: 'absolute', top: 8, right: 8 },
  opcaoRotulo: { fontSize: 14, fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink, textAlign: 'center' },
  opcaoRotuloAtivo: { color: '#fff' },
  opcaoAjuda: { fontSize: 11.5, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, textAlign: 'center' },
  opcaoAjudaAtiva: { color: 'rgba(255,255,255,0.85)' },

  // Lista vertical, para perguntas com muitas opções (4+) ou texto longo.
  opcaoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BRAND.card,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BRAND.border,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  opcaoLinhaAtiva: { borderColor: BRAND.blue, backgroundColor: '#EDF3FE' },
  opcaoLinhaTexto: { flex: 1, fontSize: 15, fontFamily: 'Nunito_600SemiBold', color: BRAND.ink, paddingRight: 10 },
  opcaoLinhaTextoAtivo: { color: BRAND.blue, fontFamily: 'Nunito_800ExtraBold' },
  radio: {
    width: 21, height: 21, borderRadius: 11, borderWidth: 2,
    borderColor: '#C7CFD9', alignItems: 'center', justifyContent: 'center',
  },
  radioAtivo: { borderColor: BRAND.blue },
  radioDentro: { width: 11, height: 11, borderRadius: 6, backgroundColor: BRAND.blue },

  rodapeCard: { fontSize: 12, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, textAlign: 'center', marginTop: 14 },

  // ---- Painel navy do progresso ----
  painel: {
    backgroundColor: BRAND.navy,
    borderRadius: 22,
    marginHorizontal: PAD,
    marginTop: 18,
    padding: 18,
  },
  painelTitulo: { fontSize: 16, fontFamily: 'Nunito_800ExtraBold', color: '#fff' },
  painelCorpo: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 14 },
  painelChips: { flex: 1, gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 11,
  },
  chipTexto: { flex: 1, fontSize: 12.5, fontFamily: 'Nunito_600SemiBold', color: '#fff' },
  painelNota: { fontSize: 13, fontFamily: 'Nunito_400Regular', color: 'rgba(255,255,255,0.75)', marginTop: 12, lineHeight: 19 },

  // ---- Resumo das etapas concluídas ----
  resumo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: BRAND.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BRAND.border,
    marginHorizontal: PAD,
    marginTop: 12,
    padding: 14,
  },
  resumoIcone: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: '#E3F3E9',
    alignItems: 'center', justifyContent: 'center',
  },
  resumoTitulo: { fontSize: 14.5, fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink },
  resumoValor: { fontSize: 12.5, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, marginTop: 1 },
  resumoEditar: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resumoEditarTexto: { fontSize: 13.5, fontFamily: 'Nunito_700Bold', color: BRAND.blue },

  // ---- Bloco das outras 15 perguntas ----
  opcionais: {
    backgroundColor: BRAND.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BRAND.border,
    marginHorizontal: PAD,
    marginTop: 12,
    padding: 14,
  },
  opcionaisTopo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  opcionaisIcone: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: '#EDF3FE',
    alignItems: 'center', justifyContent: 'center',
  },
  opcionaisTitulo: { fontSize: 15, fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink },
  opcionaisTexto: { fontSize: 12.5, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, marginTop: 1 },
  selo: { backgroundColor: '#EDF3FE', borderRadius: 20, paddingVertical: 5, paddingHorizontal: 11 },
  seloTexto: { fontSize: 11.5, fontFamily: 'Nunito_700Bold', color: BRAND.blue },
  opcionalItem: { marginTop: 16, borderTopWidth: 1, borderTopColor: BRAND.border, paddingTop: 14 },
  opcionalPergunta: { fontSize: 14.5, fontFamily: 'Nunito_700Bold', color: BRAND.ink, marginBottom: 10 },

  // ---- Nota de privacidade e rodapé ----
  privacidade: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: '#EDF3FE',
    borderRadius: 14,
    marginHorizontal: PAD,
    marginTop: 14,
    padding: 13,
  },
  privacidadeTexto: { flex: 1, fontSize: 12.5, fontFamily: 'Nunito_400Regular', color: BRAND.ink, lineHeight: 18 },

  faltam: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
    marginTop: 18,
  },
  faltamTexto: { fontSize: 13, fontFamily: 'Nunito_700Bold', color: BRAND.inkSoft },

  acoes: { paddingHorizontal: PAD, marginTop: 14 },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: BRAND.blue,
    borderRadius: 16,
    height: 58,
  },
  botaoDesabilitado: { backgroundColor: '#D8D2C4' },
  botaoTexto: { color: '#fff', fontSize: 17, fontFamily: 'Nunito_800ExtraBold' },
  botaoTextoDesabilitado: { color: '#8A8577' },
  voltarTexto: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
    color: BRAND.blue,
    paddingVertical: 16,
  },

  erroBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FBE9E7',
    borderRadius: 14,
    marginHorizontal: PAD,
    marginTop: 14,
    padding: 13,
  },
  erroTexto: { flex: 1, fontSize: 13, fontFamily: 'Nunito_600SemiBold', color: BRAND.danger, lineHeight: 18 },
});

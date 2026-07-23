import { StyleSheet, Dimensions, Platform } from 'react-native';
import { BRAND } from '../../../theme';

const { width } = Dimensions.get('window');
const PAD = width * 0.055;

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 110 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PAD,
    paddingTop: Platform.OS === 'ios' ? 12 : 44,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bellWrap: { position: 'relative' },
  bellDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: BRAND.blue,
    borderWidth: 1.5,
    borderColor: BRAND.bg,
  },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#E7EEFB' },

  title: { fontSize: 30, fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink, marginHorizontal: PAD, marginTop: 14 },
  subtitle: { fontSize: 14.5, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, marginHorizontal: PAD, marginTop: 2 },

  searchRow: { flexDirection: 'row', gap: 10, paddingHorizontal: PAD, marginTop: 16 },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND.card,
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 52,
    borderWidth: 1,
    borderColor: BRAND.border,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, fontFamily: 'Nunito_400Regular', color: BRAND.ink },
  filterBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: BRAND.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },

  temaLabel: { fontSize: 14, fontFamily: 'Nunito_600SemiBold', color: BRAND.inkSoft, marginHorizontal: PAD, marginTop: 20 },
  chipsRow: { paddingLeft: PAD, paddingRight: PAD / 2, marginTop: 10, flexDirection: 'row' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: BRAND.card,
    borderWidth: 1,
    borderColor: BRAND.border,
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  chipActive: { backgroundColor: BRAND.blue, borderColor: BRAND.blue },
  chipText: { fontSize: 13.5, fontFamily: 'Nunito_700Bold', color: BRAND.ink },
  chipTextActive: { color: '#fff' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PAD,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 21, fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink },
  sectionLink: { fontSize: 14, fontFamily: 'Nunito_700Bold', color: BRAND.blue },

  // ---- Trilha em destaque (card navy) ----
  trilhaCard: {
    backgroundColor: BRAND.navy,
    borderRadius: 22,
    marginHorizontal: PAD,
    padding: 20,
  },
  trilhaTag: { fontSize: 11.5, fontFamily: 'Nunito_800ExtraBold', color: '#8FB4F5', letterSpacing: 1 },
  trilhaTitle: { fontSize: 24, fontFamily: 'Nunito_800ExtraBold', color: '#fff', marginTop: 6 },
  trilhaSub: { fontSize: 14, fontFamily: 'Nunito_400Regular', color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  trilhaMeta: { fontSize: 12.5, fontFamily: 'Nunito_600SemiBold', color: 'rgba(255,255,255,0.6)', marginTop: 10 },
  trilhaProgressLabel: { fontSize: 12.5, fontFamily: 'Nunito_700Bold', color: '#fff', marginTop: 14 },
  trilhaBarBg: { height: 7, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.2)', marginTop: 6 },
  trilhaBarFill: { height: '100%', borderRadius: 99, backgroundColor: BRAND.blue },
  trilhaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BRAND.blue,
    borderRadius: 14,
    paddingVertical: 13,
    marginTop: 16,
  },
  trilhaBtnText: { color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 15 },

  // ---- Recomendados ----
  recRow: { flexDirection: 'row', gap: 12, paddingHorizontal: PAD },
  recCard: {
    flex: 1,
    backgroundColor: BRAND.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BRAND.border,
    overflow: 'hidden',
  },
  recImage: { width: '100%', height: 110 },
  recBody: { padding: 12 },
  recTag: { fontSize: 11, fontFamily: 'Nunito_800ExtraBold', color: BRAND.blue, letterSpacing: 0.6 },
  recTitle: { fontSize: 14.5, fontFamily: 'Nunito_700Bold', color: BRAND.ink, marginTop: 4, lineHeight: 19 },
  recFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  recTime: { fontSize: 12, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft },

  // ---- Guias rápidos ----
  quickList: {
    backgroundColor: BRAND.card,
    borderRadius: 18,
    marginHorizontal: PAD,
    borderWidth: 1,
    borderColor: BRAND.border,
    overflow: 'hidden',
  },
  quickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  quickLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E7EEFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickTitle: { fontSize: 15, fontFamily: 'Nunito_700Bold', color: BRAND.ink },
  quickTime: { fontSize: 12.5, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, marginTop: 1 },
  divider: { height: 1, backgroundColor: BRAND.border, marginLeft: 70 },
});

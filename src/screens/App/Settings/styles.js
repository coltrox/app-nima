import { StyleSheet, Dimensions, Platform } from 'react-native';
import { BRAND } from '../../../theme';

const { width } = Dimensions.get('window');
const PAD = width * 0.055;

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.bg },
  scrollContent: { paddingBottom: 40 },

  header: {
    paddingHorizontal: PAD,
    paddingTop: Platform.OS === 'ios' ? 8 : 44,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: BRAND.blue,
    backgroundColor: BRAND.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 30, fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink, marginTop: 14 },
  headerSub: { fontSize: 14.5, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, marginTop: 2 },

  section: { marginTop: 22 },
  sectionLabel: {
    fontSize: 17,
    fontFamily: 'Nunito_800ExtraBold',
    color: BRAND.ink,
    marginHorizontal: PAD,
    marginBottom: 10,
  },
  sectionCard: {
    backgroundColor: BRAND.card,
    borderRadius: 18,
    marginHorizontal: PAD,
    borderWidth: 1,
    borderColor: BRAND.border,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  itemIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#E7EEFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: { fontSize: 15, fontFamily: 'Nunito_700Bold', color: BRAND.ink },
  itemSub: { fontSize: 12.5, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, marginTop: 1 },
  itemRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemValue: { fontSize: 13.5, fontFamily: 'Nunito_600SemiBold', color: BRAND.inkSoft },
  divider: { height: 1, backgroundColor: BRAND.border, marginLeft: 68 },

  pillBtn: {
    borderWidth: 1.5,
    borderColor: BRAND.blue,
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  pillBtnText: { color: BRAND.blue, fontFamily: 'Nunito_700Bold', fontSize: 13 },
  okBadge: {
    backgroundColor: '#E3F3E9',
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  okBadgeText: { fontSize: 12, fontFamily: 'Nunito_700Bold', color: BRAND.success },

  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#E7EEFB',
    borderRadius: 18,
    marginHorizontal: PAD,
    marginTop: 22,
    padding: 16,
  },
  helpIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAND.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpTitle: { fontSize: 15, fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink },
  helpText: { fontSize: 12.5, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, marginTop: 1 },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FDECEA',
    borderRadius: 16,
    marginHorizontal: PAD,
    marginTop: 22,
    paddingVertical: 16,
  },
  logoutText: { color: BRAND.danger, fontFamily: 'Nunito_800ExtraBold', fontSize: 16 },
});

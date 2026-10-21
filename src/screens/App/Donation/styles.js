import { Platform } from 'react-native';
import { BRAND } from '../../../theme';
import { ms, fs, getPad } from '../../../theme/units';

export const createStyles = (insets, width, height) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: BRAND.bg },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: ms(110, width) + insets.bottom },

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: getPad(width),
      paddingTop: (Platform.OS === 'ios' ? 12 : 6) + Math.max(insets.top, Platform.OS === 'android' ? 24 : 0),
    },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: ms(14, width) },
    bellWrap: { position: 'relative' },
    bellDot: {
      position: 'absolute',
      top: -1,
      right: -1,
      width: ms(9, width),
      height: ms(9, width),
      borderRadius: ms(4.5, width),
      backgroundColor: BRAND.blue,
      borderWidth: 1.5,
      borderColor: BRAND.bg,
    },
    avatar: {
      width: ms(38, width),
      height: ms(38, width),
      borderRadius: ms(19, width),
      backgroundColor: '#E7EEFB',
    },

    title: {
      fontSize: fs(30, width),
      fontFamily: 'Nunito_800ExtraBold',
      color: BRAND.ink,
      marginHorizontal: getPad(width),
      marginTop: ms(14, width),
    },
    subtitle: {
      fontSize: fs(14.5, width),
      fontFamily: 'Nunito_400Regular',
      color: BRAND.inkSoft,
      marginHorizontal: getPad(width),
      marginTop: ms(2, width),
    },

    // ---- Impacto da comunidade ----
    impactCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: ms(16, width),
      backgroundColor: '#EDF3FE',
      borderRadius: ms(20, width),
      marginHorizontal: getPad(width),
      marginTop: ms(18, width),
      padding: ms(18, width),
    },
    impactIcon: {
      width: ms(58, width),
      height: ms(58, width),
      borderRadius: ms(29, width),
      borderWidth: 2,
      borderColor: BRAND.blue,
      justifyContent: 'center',
      alignItems: 'center',
    },
    impactLabel: { fontSize: fs(14, width), fontFamily: 'Nunito_700Bold', color: BRAND.ink },
    impactRow: { flexDirection: 'row', marginTop: ms(6, width) },
    impactValue: { fontSize: fs(22, width), fontFamily: 'Nunito_800ExtraBold', color: BRAND.blue },
    impactCaption: { fontSize: fs(12, width), fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft },
    impactDivider: { width: 1, backgroundColor: '#C9D8F2', marginHorizontal: ms(14, width) },

    // ---- Chips de causa ----
    chipsLabel: {
      fontSize: fs(14, width),
      fontFamily: 'Nunito_600SemiBold',
      color: BRAND.inkSoft,
      marginHorizontal: getPad(width),
      marginTop: ms(20, width),
    },
    chipsRow: { paddingLeft: getPad(width), paddingRight: getPad(width) / 2, marginTop: ms(10, width), flexDirection: 'row' },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: ms(6, width),
      backgroundColor: BRAND.card,
      borderWidth: 1,
      borderColor: BRAND.border,
      borderRadius: ms(20, width),
      paddingVertical: ms(9, width),
      paddingHorizontal: ms(14, width),
      marginRight: ms(8, width),
    },
    chipActive: { backgroundColor: BRAND.blue, borderColor: BRAND.blue },
    chipText: { fontSize: fs(13.5, width), fontFamily: 'Nunito_700Bold', color: BRAND.ink },
    chipTextActive: { color: '#fff' },

    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: getPad(width),
      marginTop: ms(24, width),
      marginBottom: ms(12, width),
    },
    sectionTitle: { fontSize: fs(21, width), fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink },
    sectionLink: { fontSize: fs(14, width), fontFamily: 'Nunito_700Bold', color: BRAND.blue },

    // ---- Campanha em destaque ----
    campaignCard: {
      backgroundColor: BRAND.card,
      borderRadius: ms(22, width),
      marginHorizontal: getPad(width),
      borderWidth: 1,
      borderColor: BRAND.border,
      overflow: 'hidden',
    },
    campaignImageWrap: { position: 'relative' },
    campaignImage: { width: '100%', height: ms(170, width) },
    heartBtn: {
      position: 'absolute',
      top: ms(12, width),
      right: ms(12, width),
      width: ms(38, width),
      height: ms(38, width),
      borderRadius: ms(19, width),
      backgroundColor: BRAND.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    campaignBody: { padding: ms(16, width) },
    ongRow: { flexDirection: 'row', alignItems: 'center', gap: ms(6, width) },
    ongName: { fontSize: fs(15, width), fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink },
    ongLocal: { flexDirection: 'row', alignItems: 'center', gap: ms(4, width), marginTop: ms(3, width) },
    ongLocalText: { fontSize: fs(12.5, width), fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft },
    campaignTitle: { fontSize: fs(20, width), fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink, marginTop: ms(10, width) },
    campaignDesc: { fontSize: fs(13.5, width), fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, marginTop: ms(4, width), lineHeight: fs(19, width) },

    barRow: { flexDirection: 'row', alignItems: 'center', gap: ms(10, width), marginTop: ms(14, width) },
    barBg: { flex: 1, height: ms(8, width), borderRadius: 99, backgroundColor: '#E4E7EC' },
    barFill: { height: '100%', borderRadius: 99, backgroundColor: BRAND.blue },
    barPct: { fontSize: fs(13.5, width), fontFamily: 'Nunito_800ExtraBold', color: BRAND.blue },

    valuesRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: ms(10, width) },
    raised: { fontSize: fs(19, width), fontFamily: 'Nunito_800ExtraBold', color: BRAND.blue },
    raisedLabel: { fontSize: fs(12, width), fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft },
    metaLabel: { fontSize: fs(12, width), fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, textAlign: 'right' },
    metaValue: { fontSize: fs(15, width), fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink, textAlign: 'right' },

    statsRow: { flexDirection: 'row', alignItems: 'center', gap: ms(14, width), marginTop: ms(12, width) },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: ms(5, width) },
    statText: { fontSize: fs(12.5, width), fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft },

    pixBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: ms(10, width),
      backgroundColor: BRAND.blue,
      borderRadius: ms(14, width),
      paddingVertical: ms(15, width),
      marginTop: ms(16, width),
    },
    pixBtnText: { color: '#fff', fontFamily: 'Nunito_800ExtraBold', fontSize: fs(16, width) },
    contasLink: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: ms(6, width),
      marginTop: ms(12, width),
    },
    contasText: { fontSize: fs(13.5, width), fontFamily: 'Nunito_700Bold', color: BRAND.blue },

    // ---- Outras causas ----
    otherCard: {
      flexDirection: 'row',
      gap: ms(12, width),
      backgroundColor: BRAND.card,
      borderRadius: ms(18, width),
      marginHorizontal: getPad(width),
      borderWidth: 1,
      borderColor: BRAND.border,
      padding: ms(12, width),
      alignItems: 'center',
    },
    otherImage: { width: ms(96, width), height: ms(82, width), borderRadius: ms(12, width) },
    otherOng: { flexDirection: 'row', alignItems: 'center', gap: ms(5, width) },
    otherOngText: { fontSize: fs(12.5, width), fontFamily: 'Nunito_700Bold', color: BRAND.inkSoft },
    otherTitle: { fontSize: fs(15, width), fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink, marginTop: ms(2, width) },
    otherBarRow: { flexDirection: 'row', alignItems: 'center', gap: ms(8, width), marginTop: ms(8, width) },
    otherPct: { fontSize: fs(12.5, width), fontFamily: 'Nunito_700Bold', color: BRAND.blue },
    otherRaised: { fontSize: fs(13.5, width), fontFamily: 'Nunito_800ExtraBold', color: BRAND.blue, marginTop: ms(6, width) },
    apoiarBtn: {
      backgroundColor: BRAND.blue,
      borderRadius: ms(12, width),
      paddingVertical: ms(9, width),
      paddingHorizontal: ms(16, width),
    },
    apoiarBtnText: { color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: fs(13.5, width) },

    // ---- Nota de transparência ----
    noteCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: ms(10, width),
      backgroundColor: BRAND.card,
      borderRadius: ms(16, width),
      marginHorizontal: getPad(width),
      marginTop: ms(18, width),
      padding: ms(14, width),
      borderWidth: 1,
      borderColor: BRAND.border,
    },
    noteText: { flex: 1, fontSize: fs(12.5, width), fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft },
    noteLink: { fontSize: fs(13, width), fontFamily: 'Nunito_700Bold', color: BRAND.blue },

    // ---- Busca ----
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: ms(10, width),
      backgroundColor: BRAND.card,
      borderWidth: 1,
      borderColor: BRAND.border,
      borderRadius: ms(16, width),
      paddingHorizontal: ms(14, width),
      paddingVertical: ms(12, width),
      marginHorizontal: getPad(width),
      marginTop: ms(12, width),
    },
    searchInput: { flex: 1, fontSize: fs(14.5, width), fontFamily: 'Nunito_400Regular', color: BRAND.ink, padding: 0 },

    // ---- Capa da campanha ----
    campaignCover: {
      height: ms(132, width),
      backgroundColor: '#EDF3FE',
      alignItems: 'center',
      justifyContent: 'center',
      gap: ms(6, width),
    },
    campaignCoverText: { fontSize: fs(12.5, width), fontFamily: 'Nunito_700Bold', color: BRAND.blue },

    // ---- PIX copia e cola ----
    pixBox: {
      backgroundColor: '#F7F4EC',
      borderWidth: 1,
      borderColor: BRAND.border,
      borderRadius: ms(14, width),
      padding: ms(14, width),
      marginTop: ms(14, width),
    },
    pixLabel: { fontSize: fs(12, width), fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink, textTransform: 'uppercase', letterSpacing: 0.4 },
    pixCode: { fontSize: fs(12.5, width), fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft, marginTop: ms(8, width), lineHeight: fs(18, width) },
    pixHint: { fontSize: fs(12, width), fontFamily: 'Nunito_600SemiBold', color: BRAND.blue, marginTop: ms(10, width) },

    metaRow: { flexDirection: 'row', alignItems: 'center', gap: ms(6, width), marginTop: ms(12, width) },
    metaTexto: { fontSize: fs(13.5, width), fontFamily: 'Nunito_700Bold', color: BRAND.ink },

    // ---- Card compacto ----
    otherThumb: {
      width: ms(68, width),
      height: ms(68, width),
      borderRadius: ms(14, width),
      backgroundColor: '#EDF3FE',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
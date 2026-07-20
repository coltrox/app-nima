import { StyleSheet, Dimensions, Platform } from 'react-native';
import { BRAND } from '../../../theme';

const { width, height } = Dimensions.get('window');

// Escala moderada com teto — evita distorção em tablets
const scale = (size, factor = 0.5) => {
  const baseScale = (width / 375) * size;
  const moderate = size + (baseScale - size) * factor;
  if (size === 58 || size === 60) return Math.min(moderate, 65);
  if (size === 26) return Math.min(moderate, 34);
  return moderate;
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND.bg,
  },
  backBtn: {
    width: 45,
    height: 45,
    backgroundColor: BRAND.card,
    borderRadius: 22.5,
    borderWidth: 1.5,
    borderColor: BRAND.ink,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 10 : height * 0.015,
    marginLeft: width * 0.04,
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: width * 0.05,
  },
  logoText: {
    fontSize: 30,
    fontFamily: 'Nunito_800ExtraBold',
    color: BRAND.blue,
  },
  topLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: BRAND.ink,
  },
  slogan: {
    textAlign: 'center',
    color: BRAND.inkSoft,
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginTop: 2,
  },
  card: {
    backgroundColor: BRAND.card,
    borderRadius: 24,
    marginHorizontal: width * 0.05,
    marginTop: 18,
    padding: 22,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  title: {
    fontSize: scale(26),
    fontFamily: 'Nunito_800ExtraBold',
    color: BRAND.ink,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: BRAND.inkSoft,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    color: BRAND.ink,
    marginBottom: 6,
    marginTop: 12,
  },
  helper: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: BRAND.inkSoft,
    marginTop: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND.card,
    borderRadius: 14,
    height: scale(58),
    borderWidth: 1,
    borderColor: '#D7DBE2',
    overflow: 'hidden',
  },
  inputIcon: {
    paddingLeft: 14,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    color: BRAND.ink,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        boxShadow: '0 0 0px 1000px white inset',
        WebkitTextFillColor: BRAND.ink,
      },
    }),
  },
  eyeButton: {
    paddingHorizontal: 14,
    height: '100%',
    justifyContent: 'center',
  },
  // Medidor de força — 3 segmentos + selos dos critérios
  strengthRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  strengthBar: {
    flex: 1,
    height: 6,
    borderRadius: 99,
    backgroundColor: '#E4E7EC',
  },
  strengthLabel: {
    textAlign: 'right',
    fontSize: 12.5,
    fontFamily: 'Nunito_700Bold',
    marginTop: 6,
  },
  checksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  checkText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    color: BRAND.inkSoft,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#B9C2CE',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND.card,
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: BRAND.blue,
    borderColor: BRAND.blue,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    color: BRAND.ink,
    lineHeight: 19,
  },
  link: {
    color: BRAND.blue,
    fontFamily: 'Nunito_700Bold',
  },
  button: {
    backgroundColor: BRAND.blue,
    height: scale(58),
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: 'Nunito_700Bold',
  },
  secureNote: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  secureNoteText: {
    fontSize: 12.5,
    fontFamily: 'Nunito_400Regular',
    color: BRAND.inkSoft,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: BRAND.inkSoft,
  },
  loginLink: {
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
    color: BRAND.blue,
    marginTop: 4,
  },
  popupContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    zIndex: 999,
  },
  popupContent: {
    backgroundColor: BRAND.card,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderLeftWidth: 5,
  },
  popupText: {
    marginLeft: 10,
    color: BRAND.ink,
    fontSize: 14,
    flex: 1,
  },
});

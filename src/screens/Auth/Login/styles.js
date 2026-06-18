import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const logoFontSize = width * 0.18;

const colors = {
  bgWarm: '#F0F2F5',        // Cinza médio-claro confortável
  textDark: '#2C3E50',      
  textMuted: '#5A6578',     
  peach: '#FF8A75',         
  white: '#FFFFFF',
  border: '#DCDFE4'         
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgWarm,
  },
  loadingContainer: {
    flex: 1, 
    backgroundColor: colors.bgWarm, 
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.08, 
    paddingVertical: height * 0.05,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 10,
    paddingTop: 15,
    zIndex: 1, 
  },
  pawWrapper: {
    marginTop: 6,
  },
  logoTextWrapper: {
    opacity: 1, 
    flexDirection: 'row', 
    alignItems: 'baseline', 
    paddingTop: 15
  },
  logoText: {
    fontSize: logoFontSize > 75 ? 75 : logoFontSize,
    fontFamily: 'Nunito_800ExtraBold',
    color: colors.textDark,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  dot: {
    position: 'absolute',
    width: width * 0.040,
    height: width * 0.040,
    borderRadius: 10,
    backgroundColor: colors.peach,
    top: Platform.OS === 'ios' ? '34%' : '29%', 
    left: "31.2%",
  },
  formContainer: {
    gap: height * 0.02,
    zIndex: 99, 
    position: 'relative',
  },
  welcomeText: {
    fontSize: width * 0.05,
    fontFamily: 'Nunito_700Bold',
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    height: 58,
    borderRadius: 16,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: colors.textDark,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      web: { 
        outlineStyle: 'none',
        // Força o fundo a continuar branco mesmo com preenchimento automático no ambiente web
        boxShadow: '0 0 0px 1000px white inset',
        WebkitTextFillColor: colors.textDark,
      }
    })
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    height: 58,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden', // Corta qualquer sobra quadrada dos cantos internos
  },
  inputWithIcon: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: colors.textDark,
    borderTopLeftRadius: 16,    // Força o arredondamento no canto superior esquerdo
    borderBottomLeftRadius: 16, // Força o arredondamento no canto inferior esquerdo
    ...Platform.select({
      web: { 
        outlineStyle: 'none',
        boxShadow: '0 0 0px 1000px white inset',
        WebkitTextFillColor: colors.textDark,
      }
    })
  },
  eyeButton: {
    paddingHorizontal: 15,
    height: '100%',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  bottomInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#B0B8C4',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    backgroundColor: colors.peach,
    borderColor: colors.peach,
  },
  rememberText: {
    color: colors.textMuted,
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  forgotText: {
    color: colors.peach,
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  loginButton: {
    backgroundColor: colors.peach,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: colors.peach,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 17,
    fontFamily: 'Nunito_700Bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.015,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    color: '#7F8C8D',
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginHorizontal: 15,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    height: 56,
    borderRadius: 16,
    gap: 12,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  socialText: {
    color: colors.textDark,
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingBottom: 30,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  signupText: {
    color: colors.peach,
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  popupContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    zIndex: 999,
  },
  popupContent: {
    backgroundColor: colors.white,
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
    color: colors.textDark,
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  }
});

export default styles;
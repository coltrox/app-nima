import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const logoFontSize = width * 0.18; // Escala dinâmica para o logo

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05082b',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.08, 
    paddingVertical: height * 0.05, // Vertical proporcional à altura
    gap: height * 0.02, // Espaçamento entre elementos responsivo
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 10,
    paddingTop: 15, // IMPORTANTE: Espaço extra para a fonte não cortar no topo
  },
  pawWrapper: {
    marginTop: 6,
  },
  logoText: {
    fontSize: logoFontSize > 75 ? 75 : logoFontSize,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#FFFFFF',
    includeFontPadding: false, // Remove preenchimento extra nativo do Android
    textAlignVertical: 'center',
    // Removi o lineHeight fixo para evitar o corte superior
  },
  logoTextPlain: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_800ExtraBold',
  },
  dot: {
    position: 'absolute',
    width: width * 0.040, // Ponto proporcional à largura
    height: width * 0.040,
    borderRadius: 10,
    backgroundColor: '#2259d1',
    top: Platform.OS === 'ios' ? '34%' : '29%', 
    left: "31.2%",
  },
  welcomeText: {
    fontSize: width * 0.05, // Texto de boas-vindas responsivo
    fontFamily: 'Nunito_700Bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 15,
    height: 58, // Altura fixa para toque confortável (padrão UX)
    borderRadius: 12,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#1F2937',
    ...Platform.select({
      web: { outlineStyle: 'none' }
    })
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    height: 58,
  },
  inputWithIcon: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#1F2937',
    ...Platform.select({
      web: { outlineStyle: 'none' }
    })
  },
  eyeButton: {
    paddingHorizontal: 15,
    height: '100%',
    justifyContent: 'center',
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
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  rememberText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  forgotText: {
    color: '#93C5FD',
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  loginButton: {
    backgroundColor: '#111827',
    height: 58,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 4, // Sombra leve no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: 'white',
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
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  orText: {
    color: '#D1D5DB',
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    marginHorizontal: 15,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 56,
    borderRadius: 12,
    gap: 12,
    marginBottom: 5,
  },
  socialText: {
    color: '#1F2937',
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
    color: '#D1D5DB',
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  signupText: {
    color: '#93C5FD',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
});

export default styles;
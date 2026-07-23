import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

import { BRAND } from '../../../theme';

const colors = {
  bgWarm: '#FAF8F5',
  textDark: '#1A202C',
  textMuted: '#4A5568',
  primary: '#0056C6',
  white: '#FFFFFF',
  border: '#E2E8F0',
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 24,
  },
  
  /* Logo Super Expandida */
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,       // Recorta a grande área transparente superior do PNG
    marginBottom: -100,    // Aproxima o card branco perfeitamente da logo gigante
    zIndex: 1,
  },
  logoImage: {
    width: width * 0.9,    // Logo ultra destacada ocupando toda a largura útil
    height: 350,           // Altura muito maior para destacar o nome Nima
    maxWidth: 520,
  },

  /* Card Branco Arredondado */
  cardContainer: {
    backgroundColor: colors.white,
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },

  welcomeText: {
    fontSize: 22,
    fontFamily: 'Nunito_800ExtraBold',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },

  /* Campos de Entrada */
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    color: colors.textDark,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  inputLeftIcon: {
    marginRight: 8,
  },
  inputField: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: colors.textDark,
    ...Platform.select({
      web: { 
        outlineStyle: 'none',
      }
    })
  },
  eyeButton: {
    paddingLeft: 8,
    height: '100%',
    justifyContent: 'center',
  },

  /* Lembrar-me e Esqueci Senha */
  bottomInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 18,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rememberText: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
  forgotText: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },

  /* Botão Entrar */
  loginButton: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },

  /* Mensagem de Proteção */
  protectionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  protectionText: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
  },

  /* Divisor */
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    color: '#A0AEC0',
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    marginHorizontal: 12,
  },

  /* Botões Sociais */
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    height: 44,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  socialText: {
    color: colors.textDark,
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },

  /* Criar Conta */
  signupSection: {
    alignItems: 'center',
    marginTop: 4,
  },
  signupPrompt: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 8,
  },
  signupButton: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  signupButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },

  /* Rodapé */
  termsFooter: {
    marginTop: 20,
    alignItems: 'center',
  },
  termsText: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  termsLink: {
    color: colors.primary,
    fontFamily: 'Nunito_700Bold',
  },

  /* Popup Toast */
  popupContainer: {
    position: 'absolute',
    bottom: 40,
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
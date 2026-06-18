import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Função de escala responsiva calibrada (Moderate Scale) com limites para evitar distorções
const scale = (size, factor = 0.5) => {
  const baseScale = (width / 375) * size;
  // Aplica uma escala moderada para equilibrar a visualização entre celulares e tablets
  const moderate = size + (baseScale - size) * factor;
  // Define tetos máximos para inputs e botões não quebrarem em telas muito grandes
  if (size === 58 || size === 60) return Math.min(moderate, 65);
  if (size === 26) return Math.min(moderate, 34); // Título
  return moderate;
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pawFixed: {
    position: 'absolute',
    zIndex: 0, 
  },
  backBtn: {
    width: 45,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: Platform.OS === 'ios' ? 10 : height * 0.015,
    marginLeft: width * 0.04,
    zIndex: 10,
  },
  animatedContent: {
    flex: 1,
    paddingHorizontal: width * 0.08,
    marginTop: height * 0.04,
    zIndex: 5,
  },
  headerContainer: {
    marginTop: height * 0.01,
    marginBottom: height * 0.025,
  },
  titleLarge: {
    fontSize: scale(26),
    color: '#FFFFFF',
    lineHeight: scale(36),
    fontWeight: '800',
  },
  form: {
    gap: scale(12),
    width: '100%',
  },
  inputLarge: {
    backgroundColor: '#FFFFFF',
    height: scale(58),
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: scale(16),
    color: '#1E232C',
    ...Platform.select({
      web: { outlineStyle: 'none' }
    })
  },
  buttonDark: {
    backgroundColor: '#1E232C',
    height: scale(58),
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(10),
  },
  buttonTextLarge: {
    color: '#FFFFFF',
    fontSize: scale(18),
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.03,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: '#FFFFFF',
    paddingHorizontal: 15,
    fontSize: scale(14),
    fontWeight: '600',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(15),
  },
  socialSquare: {
    width: '30%',
    height: scale(55),
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 35 : 25,
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: scale(15),
  },
  loginLinkLarge: {
    color: '#00CFE8',
    fontSize: scale(15),
    fontWeight: '700',
  },
  // POPUP UNIFICADA DO SISTEMA NIMA
  popupContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    zIndex: 999,
  },
  popupContent: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderLeftWidth: 5,
    gap: 5,
  },
  popupText: {
    marginLeft: 10,
    color: '#000',
    fontSize: 14,
    flex: 1,
  }
});
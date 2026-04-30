import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Função auxiliar para escalar tamanhos baseada na largura da tela (baseada em um padrão de 375px)
const scale = (size) => (width / 375) * size;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pawFixed: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  backButton: {
    width: scale(35),
    height: scale(40),
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  animatedContent: {
    flex: 1,
    paddingHorizontal: width * 0.08, // 8% da largura da tela para as laterais
    marginTop: height * 0.08, // 10% da altura da tela para empurrar para baixo responsivamente
    zIndex: 2,
  },
  headerContainer: {
    marginTop: height * -0.03,
    marginBottom: height * 0.04, // Espaçamento proporcional à altura\
  },
  titleLarge: {
    fontSize: scale(26), // Fonte escala conforme o dispositivo
    color: '#FFFFFF',
    lineHeight: scale(38),
    fontWeight: '800',
  },
  form: {
    gap: scale(15),
  },
  inputLarge: {
    backgroundColor: '#FFFFFF',
    height: scale(60), // Altura robusta e responsiva
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: scale(16),
    color: '#1E232C',
    outlineStyle: 'none'
  },
  buttonDark: {
    backgroundColor: '#1E232C',
    height: scale(60),
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(20),
  },
  buttonTextLarge: {
    color: '#FFFFFF',
    fontSize: scale(18),
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.04,
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
    marginBottom: scale(20),
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
    marginTop: 'auto',
    paddingBottom: Platform.OS === 'ios' ? 40 : 30, // Ajuste para o notch do iPhone
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
});
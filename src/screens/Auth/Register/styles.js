import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const scale = (size) => (width / 375) * size;

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
    marginTop: height * 0.01,
    marginLeft: width * 0.02,
    zIndex: 10,
  },
  animatedContent: {
    flex: 1,
    paddingHorizontal: width * 0.08,
    marginTop: height * 0.08,
    zIndex: 5, // Aumentado para garantir foco no PC
  },
  headerContainer: {
    marginTop: height * -0.03,
    marginBottom: height * 0.04,
  },
  titleLarge: {
    fontSize: scale(26),
    color: '#FFFFFF',
    lineHeight: scale(38),
    fontWeight: '800',
  },
  form: {
    gap: scale(15),
  },
  inputLarge: {
    backgroundColor: '#FFFFFF',
    height: scale(60),
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
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
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
  popupContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    zIndex: 999,
  },
  popupContent: {
    backgroundColor: '#1E232C',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#333',
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  popupText: {
    color: '#FFF',
    marginLeft: 10,
    fontSize: 14,
  }
});
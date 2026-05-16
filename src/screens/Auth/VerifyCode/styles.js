import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: width * 0.05, // Reduzido para dar mais espaço aos 6 inputs
    paddingTop: 20,
    zIndex: 5,
  },
  pawFixed: {
    position: 'absolute',
    zIndex: -1,
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
  },
  titleLarge: {
    fontSize: width * 0.08,
    color: '#FFF',
    lineHeight: width * 0.1,
  },
  descriptionLarge: {
    fontSize: 15,
    color: '#D1D5DB',
    marginTop: 25,
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribui os 6 campos uniformemente
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
    width: '100%',
  },
  otpInput: {
    width: width * 0.13, // Tamanho ideal para 6 dígitos lado a lado
    height: width * 0.15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 22,
    color: '#1E232C',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    paddingVertical: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  buttonVerify: {
    backgroundColor: '#1E232C',
    height: 58,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonTextVerify: {
    color: '#FFF',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerTextLarge: {
    color: '#D1D5DB',
    fontSize: 15,
  },
  resendLink: {
    color: '#FFF',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});

export default styles;
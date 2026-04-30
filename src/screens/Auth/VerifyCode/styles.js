import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: width * 0.07,
    paddingTop: 20,
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
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 30,
  },
  otpInput: {
    width: width * 0.18,
    height: width * 0.18,
    backgroundColor: '#FFF',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    color: '#1E232C',
    // Sombra leve para os inputs
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonVerify: {
    backgroundColor: '#1E232C', // Tom escuro como na imagem
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonTextVerify: {
    color: '#FFF',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerTextLarge: {
    fontSize: 15,
    color: '#D1D5DB',
  },
  resendLink: {
    fontSize: 15,
    color: '#00CFE8', // Tom de ciano conforme o "Reenvie" da imagem
  },
});

export default styles;
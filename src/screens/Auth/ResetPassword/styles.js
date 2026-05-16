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
    fontSize: width * 0.082,
    color: '#FFF',
    lineHeight: width * 0.1,
  },
  descriptionLarge: {
    fontSize: 18,
    color: '#D1D5DB',
    marginTop: 80,
    lineHeight: 20,
  },
  inputContainer: {
    marginTop: 40,
    marginBottom: 20,
    zIndex: 100,
  },
  inputLarge: {
    backgroundColor: '#FFF',
    height: 60,
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000',
    marginBottom: 15,
    ...Platform.select({
      web: { outlineStyle: 'none', cursor: 'text' },
    }),
  },
  buttonLarge: {
    backgroundColor: '#1E232C',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonTextLarge: {
    color: '#FFF',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerTextLarge: {
    fontSize: 15,
    color: '#D1D5DB',
  },
  loginLinkLarge: {
    fontSize: 15,
    color: '#00CFE8',
  },
  // --- Estilização do Popup ---
  popupContainer: {
    position: 'absolute',
    bottom: 50,
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
  },
  popupText: {
    marginLeft: 10,
    color: '#000',
    fontSize: 14,
  }
});

export default styles;
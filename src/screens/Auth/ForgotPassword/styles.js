import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: width * 0.07,
    paddingTop: 28,
    paddingBottom: height * 0.04,
    zIndex: 10,
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
  },
  titleLarge: {
    fontSize: width * 0.1,
    color: '#FFF',
    lineHeight: width * 0.11,
  },
  descriptionLarge: {
    fontSize: 18,
    color: '#D1D5DB',
    marginTop: 40,
    lineHeight: 22,
  },
  inputContainer: {
    gap: 15,
    marginTop: height * 0.04,
    zIndex: 999, // Eleva o container de inputs acima de tudo
  },
  inputLarge: {
    backgroundColor: '#FFF',
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
    // IMPORTANTE PARA WEB
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        cursor: 'text',
      },
    }),
  },
  buttonLarge: {
    backgroundColor: '#007AFF',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextLarge: {
    color: '#FFF',
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerTextLarge: {
    fontSize: 15,
    color: '#D1D5DB',
  },
  loginLinkLarge: {
    fontSize: 15,
    color: '#FFF',
    textDecorationLine: 'underline',
  },
});

export default styles;
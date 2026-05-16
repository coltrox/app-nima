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
    fontSize: 15,
    color: '#D1D5DB',
    marginTop: 25,
    lineHeight: 20,
  },
  inputSection: {
    marginTop: 40,
    marginBottom: 20,
    zIndex: 100,
  },
  inputField: {
    backgroundColor: '#F7F8F9',
    height: 60,
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#1E232C',
    borderWidth: 1,
    borderColor: '#E8ECF4',
    ...Platform.select({
      web: { outlineStyle: 'none', cursor: 'text' },
    }),
  },
  buttonReset: {
    backgroundColor: '#1E232C',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonTextReset: {
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
  helpLink: {
    fontSize: 15,
    color: '#00CFE8',
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
    textAlign: 'center',
  }
});

export default styles;
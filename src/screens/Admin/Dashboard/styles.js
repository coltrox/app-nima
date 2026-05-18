import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 25,
  },
  adminHeader: {
    marginBottom: 30,
  },
  title: {
    fontSize: 30,
    color: '#FFF',
    fontFamily: 'Nunito_800ExtraBold',
  },
  tagline: {
    color: '#9CA3AF',
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  statsBanner: {
    backgroundColor: '#1a3fae',
    padding: 25,
    borderRadius: 24,
    marginBottom: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  statsLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    textTransform: 'uppercase',
  },
  statsValue: {
    color: '#FFF',
    fontSize: 42,
    fontFamily: 'Nunito_800ExtraBold',
    marginTop: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: 'rgba(26, 63, 174, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    color: '#FFF',
    fontSize: 17,
    fontFamily: 'Nunito_700Bold',
    flex: 1,
  }
});
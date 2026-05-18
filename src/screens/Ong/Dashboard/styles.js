import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    color: '#FFF',
    fontFamily: 'Nunito_800ExtraBold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    fontFamily: 'Nunito_400Regular',
    marginBottom: 25,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    width: (width - 55) / 2,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardText: {
    color: '#FFF',
    marginTop: 10,
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFF',
    fontFamily: 'Nunito_700Bold',
    marginBottom: 15,
  },
  requestCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#1a3fae',
  },
  requestInfo: {
    marginLeft: 15,
    flex: 1,
  },
  petName: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  userName: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  }
});
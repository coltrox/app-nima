import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

export const colors = {
  navy: '#05082B',
  blue: '#1D5CFF',
  white: '#FFFFFF',
  gray: '#6B7280',
  ice: '#F8FAFC',
  lightGray: '#E2E8F0'
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ice,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
  },
  header: {
    paddingHorizontal: width * 0.06,
    paddingTop: Platform.OS === 'ios' ? 10 : 30,
    paddingBottom: 15,
  },
  title: {
    fontSize: isSmallDevice ? 24 : 28,
    fontWeight: 'bold',
    color: colors.navy,
  },
  heroSection: {
    paddingHorizontal: width * 0.06,
    marginBottom: 25,
  },
  heroTitle: {
    fontSize: isSmallDevice ? 20 : 24,
    fontWeight: 'bold',
    color: colors.navy,
  },
  heroSubtitle: {
    color: colors.gray,
    fontSize: 16,
    marginTop: 5,
    lineHeight: 22,
  },
  ongCard: {
    backgroundColor: colors.white,
    borderRadius: 28,
    marginHorizontal: width * 0.06,
    marginBottom: 20,
    overflow: 'hidden', // Garante que a imagem respeite o border radius
    ...Platform.select({
      ios: {
        shadowColor: colors.navy,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  ongImage: {
    width: '100%',
    height: height * 0.22, // Altura proporcional à tela
    backgroundColor: colors.lightGray,
  },
  cardInfo: {
    padding: 20,
  },
  ongName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 4,
  },
  ongCause: {
    color: colors.gray,
    fontSize: 14,
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 15,
  },
  metaLabel: {
    fontSize: 12,
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blue,
  },
  pixButton: {
    backgroundColor: colors.blue,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  pixText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  }
});
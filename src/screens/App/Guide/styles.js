import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

export const colors = {
  navy: '#05082B',
  blue: '#1D5CFF',
  white: '#FFFFFF',
  gray: '#6B7280',
  ice: '#F8FAFC',
  border: '#E2E8F0',
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
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  header: {
    paddingHorizontal: width * 0.06,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: isSmallDevice ? 24 : 28,
    fontWeight: 'bold',
    color: colors.navy,
  },
  sectionTitle: {
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: 'bold',
    color: colors.navy,
    marginHorizontal: width * 0.06,
    marginTop: 25,
    marginBottom: 15,
  },
  trilhaCard: {
    backgroundColor: colors.blue,
    borderRadius: 24,
    padding: width * 0.06,
    marginHorizontal: width * 0.06,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Sombras responsivas
    ...Platform.select({
      ios: {
        shadowColor: colors.blue,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  trilhaInfo: {
    flex: 1,
    paddingRight: 10,
  },
  trilhaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  trilhaText: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  listContainer: {
    marginTop: 5,
  },
  raçaItem: {
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: 20,
    marginHorizontal: width * 0.06,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  raçaText: {
    fontWeight: '600',
    color: colors.navy,
    fontSize: 15,
    flex: 1,
  },
});
import { StyleSheet, Dimensions, Platform } from 'react-native';
const { width, height } = Dimensions.get('window');

const isSmallDevice = width < 375;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  screenHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: width * 0.06, 
    paddingTop: Platform.OS === 'ios' ? 20 : 50,
    paddingBottom: 20
  },
  headerTitle: {
    fontSize: isSmallDevice ? 28 : 32, 
    fontWeight: 'bold', 
    color: '#1D5CFF'
  },
  statusBadge: {
    backgroundColor: '#059669', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12
  },
  statusText: {
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 12
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  avatarBorder: {
    width: isSmallDevice ? 120 : 140,
    height: isSmallDevice ? 120 : 140,
    borderRadius: isSmallDevice ? 60 : 70,
    borderWidth: 4,
    borderColor: '#1D5CFF',
    padding: 5,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  avatarImage: {
    width: '100%', 
    height: '100%', 
    borderRadius: isSmallDevice ? 55 : 65
  },
  petName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#05082B',
    marginTop: 15,
  },
  petDetails: {
    color: '#6B7280', 
    fontSize: 16
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 22,
    marginHorizontal: width * 0.06,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuItemContent: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 15
  },
  menuItemTitle: {
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#05082B'
  },
  menuItemSubtitle: {
    fontSize: 12, 
    color: '#6B7280'
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logCard: {
    backgroundColor: '#05082B',
    borderRadius: 28,
    padding: 20,
    marginHorizontal: width * 0.06,
    marginTop: 15,
  },
  logHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  logTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logContent: {
    marginTop: 20, 
    borderLeftWidth: 2, 
    borderLeftColor: '#1D5CFF', 
    paddingLeft: 15
  },
  logLabel: {
    color: '#FFF', 
    fontWeight: 'bold'
  },
  logData: {
    color: 'rgba(255,255,255,0.7)', 
    fontSize: 12
  }
});
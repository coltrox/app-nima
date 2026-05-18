import { StyleSheet, Dimensions, Platform } from 'react-native';

const { height, width } = Dimensions.get('window');

export const colors = {
  navy: '#05082B',
  blue: '#1D5CFF',
  white: '#FFFFFF',
  gray: '#94A3B8',
  lightGray: '#F1F5F9',
  border: '#E2E8F0'
};

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 43, 0.9)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.white,
    height: height * 0.9,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: width * 0.06, // Padding responsivo baseado na largura
  },
  topIndicator: {
    width: 36,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: height * 0.015,
  },
  header: {
    marginBottom: height * 0.02,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.015,
  },
  iconButton: {
    padding: 4,
  },
  laterText: {
    color: colors.gray,
    fontSize: 14,
    fontWeight: '500',
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.blue,
    textTransform: 'uppercase',
  },
  progressSteps: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '600',
  },
  progressContainer: {
    height: 6,
    backgroundColor: colors.lightGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  content: {
    paddingBottom: 20,
  },
  questionCard: {
    marginTop: height * 0.01,
    marginBottom: height * 0.025,
  },
  questionText: {
    fontSize: width > 400 ? 24 : 20, // Fonte responsiva
    fontWeight: '700',
    color: colors.navy,
    lineHeight: width > 400 ? 32 : 28,
  },
  optionsWrapper: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: colors.white,
    padding: height * 0.02,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionSelected: {
    borderColor: colors.blue,
    backgroundColor: '#F0F4FF',
  },
  optionText: {
    fontSize: 16,
    color: colors.navy,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.blue,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.lightGray,
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    color: colors.navy,
    height: height * 0.15,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: Platform.OS === 'ios' ? 45 : 40,
    marginBottom: Platform.OS === 'android' ? 10 : 0,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingRight: 20,
  },
  navButtonText: {
    fontSize: 16,
    color: colors.gray,
    fontWeight: '600',
  },
  mainButton: {
    flex: 1,
    marginLeft: width * 0.08,
  },
  mainButtonGradient: {
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mainButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  }
});
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
    backgroundColor: 'rgba(5, 8, 43, 0.85)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.white,
    height: height * 0.88,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: width * 0.06,
  },
  topIndicator: {
    width: 40,
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: height * 0.015,
  },
  header: {
    marginBottom: height * 0.015,
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
    fontWeight: '600',
  },
  progressWrapper: {
    marginTop: 5,
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
    letterSpacing: 0.5,
  },
  progressSteps: {
    fontSize: 12,
    color: colors.gray,
    fontWeight: '700',
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
    paddingBottom: 30,
  },
  questionCard: {
    marginTop: height * 0.015,
    marginBottom: height * 0.025,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  iconContainer: {
    backgroundColor: '#F0F4FF',
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
  },
  questionText: {
    fontSize: width > 400 ? 22 : 20,
    fontWeight: '700',
    color: colors.navy,
    lineHeight: width > 400 ? 30 : 26,
  },
  optionsWrapper: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: colors.white,
    padding: height * 0.022,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionSelected: {
    borderColor: colors.blue,
    backgroundColor: '#F4F7FF',
  },
  optionText: {
    fontSize: 16,
    color: colors.navy,
    fontWeight: '600',
    flex: 1,
    paddingRight: 10,
  },
  optionTextSelected: {
    color: colors.blue,
    fontWeight: '700',
  },
  customRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customRadioSelected: {
    borderColor: colors.blue,
  },
  customRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.blue,
  },
  input: {
    backgroundColor: colors.lightGray,
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    color: colors.navy,
    height: height * 0.16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: Platform.OS === 'ios' ? 35 : 25,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingRight: 15,
  },
  navButtonText: {
    fontSize: 15,
    color: colors.gray,
    fontWeight: '700',
  },
  mainButton: {
    flex: 1,
    marginLeft: width * 0.05,
  },
  mainButtonGradient: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  mainButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  }
});
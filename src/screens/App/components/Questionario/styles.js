import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  navy: '#05082B',
  blue: '#1D5CFF',
  white: '#FFFFFF',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  ice: '#F8FAFC',
};

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 43, 0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.ice,
    height: height * 0.85,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.blue,
  },
  stepText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.gray,
  },
  sectionLabel: {
    color: colors.blue,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 25,
  },
  optionButton: {
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionSelected: {
    borderColor: colors.blue,
    backgroundColor: '#EEF4FF',
  },
  optionText: {
    fontSize: 16,
    color: colors.navy,
  },
  optionTextSelected: {
    color: colors.blue,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    height: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  nextButton: {
    flex: 2,
    backgroundColor: colors.blue,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    flex: 1,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray,
  },
  backButtonText: {
    color: colors.gray,
    fontWeight: '600',
  }
});
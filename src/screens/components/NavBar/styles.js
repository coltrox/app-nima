import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const colors = {
  navy: '#05082B',
  blue: '#1D5CFF',
  gray: '#8E8E93',
  white: '#FFFFFF',
  border: '#E5E5EA',
};

export const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    bottom: 25, // Mantendo o estilo flutuante que você tinha
    left: width * 0.06,
    right: width * 0.06,
    height: 70,
    backgroundColor: colors.white,
    borderRadius: 25,
    // --- AS DUAS LINHAS ABAIXO SÃO A CHAVE ---
    flexDirection: 'row', 
    width: width * 0.88, // Garante que ela ocupe o espaço correto
    // -----------------------------------------
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 10,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    zIndex: 1000, // Garante que fique por cima de tudo
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Faz cada item ocupar o mesmo espaço na horizontal
  },
  navText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  }
});
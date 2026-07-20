import { StyleSheet, Platform } from 'react-native';
import { BRAND } from '../../../theme';

// Cores da barra alinhadas à marca (azul ativo, cinza inativo).
export const colors = {
  navy: BRAND.navy,
  blue: BRAND.blue,
  gray: '#9AA6B2',
  white: BRAND.card,
  border: BRAND.border,
};

export const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 28 : 14,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 12,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    zIndex: 1000,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 3,
  },
  navText: {
    fontSize: 11,
    fontFamily: 'Nunito_700Bold',
    marginTop: 2,
  },
});

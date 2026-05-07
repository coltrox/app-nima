import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, colors } from './styles';

const Navbar = ({ navigation, currentRoute }) => {
  const navItems = [
    { name: 'Donation', icon: 'heart-outline', activeIcon: 'heart', label: 'Apoiar' },
    { name: 'Guide', icon: 'book-outline', activeIcon: 'book', label: 'Guia' }, // Alterado aqui
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', label: 'Home' },
    { name: 'MyPet', icon: 'paw-outline', activeIcon: 'paw', label: 'Meu Pet' },
    { name: 'Profile', icon: 'person-outline', activeIcon: 'person', label: 'Perfil' },
  ];

  return (
    <View style={styles.navbar}>
      {navItems.map((item) => {
        const isActive = currentRoute === item.name;
        
        const iconName = isActive 
          ? (item.activeIcon || item.icon.replace('-outline', '')) 
          : item.icon;

        return (
          <TouchableOpacity 
            key={item.name}
            style={styles.navItem}
            activeOpacity={0.7} 
            onPress={() => navigation.navigate(item.name)}
          >
            <Ionicons 
              name={iconName} 
              size={isActive ? 26 : 24} 
              color={isActive ? colors.blue : colors.gray} 
            />
            <Text style={[
              styles.navText, 
              { color: isActive ? colors.blue : colors.gray }
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Navbar;
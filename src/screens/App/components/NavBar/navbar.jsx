import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, colors } from './styles';

const Navbar = ({ navigation, currentRoute }) => {
  const navItems = [
    { name: 'Match', icon: 'heart-half', label: 'Match' },
    { name: 'BreedGuide', icon: 'book-outline', label: 'Guia' },
    { name: 'Home', icon: 'home', label: 'Home' },
    { name: 'SmartTag', icon: 'pricetag-outline', label: 'Tag' },
    { name: 'Profile', icon: 'person-outline', label: 'Perfil' },
  ];

  return (
    <View style={styles.navbar}>
      {navItems.map((item) => {
        const isActive = currentRoute === item.name;
        return (
          <TouchableOpacity 
            key={item.name}
            style={styles.navItem} 
            onPress={() => navigation.navigate(item.name)}
          >
            <Ionicons 
              name={isActive ? item.icon.replace('-outline', '') : item.icon} 
              size={isActive ? 26 : 24} 
              color={isActive ? colors.blue : colors.gray} 
            />
            <Text style={[styles.navText, { color: isActive ? colors.blue : colors.gray }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Navbar;
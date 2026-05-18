import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Platform 
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { styles } from './styles';
import Navbar from '../../components/NavBar/navbar';

const ProfileScreen = ({ navigation }) => {
  // Função para deslogar e limpar a pilha de navegação
  const handleLogout = () => {
    // Usamos replace para que o botão 'voltar' do celular não retorne ao perfil
    navigation.replace('Login'); 
  };

  const menuItems = [
    { id: 1, title: 'Dados Pessoais', icon: 'person-outline', color: '#1D5CFF' },
    { id: 2, title: 'Notificações', icon: 'notifications-outline', color: '#FF9500' },
    { id: 3, title: 'Segurança', icon: 'shield-checkmark-outline', color: '#059669' },
    { id: 4, title: 'Ajuda & Suporte', icon: 'help-circle-outline', color: '#6B7280' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        style={styles.scroll} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Meu Perfil</Text>
          <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
            <Feather name="log-out" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Card de Perfil */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>P</Text>
            </View>
            <TouchableOpacity style={styles.editBadge}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>Pedro Coltro</Text>
          <Text style={styles.userEmail}>pedro.coltro@gmail.com</Text>
          
          <TouchableOpacity style={styles.editProfileBtn}>
            <Text style={styles.editProfileText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>02</Text>
            <Text style={styles.statLabel}>Pets</Text>
          </View>
          <View style={[styles.statBox, styles.statDivider]}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Interesses</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>08</Text>
            <Text style={styles.statLabel}>Apoios</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <Navbar navigation={navigation} currentRoute="Profile" />
    </SafeAreaView>
  );
};

export default ProfileScreen;
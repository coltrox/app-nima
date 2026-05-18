import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

const AdminDashboard = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Limpa tudo ao sair manualmente
      await AsyncStorage.multiRemove([
        '@nima_token', 
        '@nima_user_role', 
        '@nima_remember_me'
      ]);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert("Erro", "Não foi possível encerrar a sessão.");
    }
  };

  return (
    <LinearGradient colors={['#05082b', '#0a1550']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.adminHeader}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 20, paddingTop: 10 }}>
            <View>
              <Text style={styles.title}>Administração</Text>
              <Text style={styles.tagline}>Controle Geral do Ecossistema Nima</Text>
            </View>
            
            <TouchableOpacity onPress={handleLogout} style={{ padding: 10 }}>
              <Ionicons name="log-out-outline" size={28} color="#FF4444" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.statsBanner}>
            <Text style={styles.statsLabel}>Total de Adoções Realizadas</Text>
            <Text style={styles.statsValue}>1.240</Text>
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="business" size={24} color="#FFF" />
            </View>
            <Text style={styles.menuText}>Validar Novas ONGs</Text>
            <Ionicons name="chevron-forward" size={20} color="#1a3fae" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="people" size={24} color="#FFF" />
            </View>
            <Text style={styles.menuText}>Gerenciar Usuários</Text>
            <Ionicons name="chevron-forward" size={20} color="#1a3fae" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="shield-checkmark" size={24} color="#FFF" />
            </View>
            <Text style={styles.menuText}>Relatórios de Segurança</Text>
            <Ionicons name="chevron-forward" size={20} color="#1a3fae" />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default AdminDashboard;
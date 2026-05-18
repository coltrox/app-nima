import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

const OngDashboard = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['@nima_token', '@nima_user_role', '@nima_remember_me']);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair.");
    }
  };

  return (
    <LinearGradient colors={['#05082b', '#1a3fae']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 }}>
          <View>
            <Text style={styles.headerTitle}>Painel da ONG</Text>
            <Text style={styles.subtitle}>Gerencie seus animais e adoções</Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={28} color="#FF4444" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="add-circle" size={32} color="#FFF" />
              <Text style={styles.cardText}>Novo Pet</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="list" size={32} color="#FFF" />
              <Text style={styles.cardText}>Meus Pets</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Pedidos de Adoção</Text>
          
          <View style={styles.requestCard}>
            <Ionicons name="time-outline" size={24} color="#FFF" />
            <View style={styles.requestInfo}>
              <Text style={styles.petName}>Rex (Cão)</Text>
              <Text style={styles.userName}>Interessado: João Silva</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>

          <View style={styles.requestCard}>
            <Ionicons name="time-outline" size={24} color="#FFF" />
            <View style={styles.requestInfo}>
              <Text style={styles.petName}>Luna (Gata)</Text>
              <Text style={styles.userName}>Interessado: Maria Oliveira</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default OngDashboard;
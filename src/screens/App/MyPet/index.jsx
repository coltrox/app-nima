import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { styles } from './styles';
import Navbar from '../../components/NavBar/navbar';

const MyPetScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        
        {/* Header com ajuste de plataforma */}
        <View style={styles.screenHeader}>
          <Text style={styles.headerTitle}>Meu Pet</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Tag Ativa</Text>
          </View>
        </View>

        <View style={styles.avatarContainer}>
          <View style={styles.avatarBorder}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300' }} 
              style={styles.avatarImage} 
            />
          </View>
          <Text style={styles.petName}>Bento</Text>
          <Text style={styles.petDetails}>Golden Retriever • 2 anos</Text>
        </View>

        {/* Menu Items */}
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={styles.menuItemContent}>
            <View style={[styles.iconCircle, { backgroundColor: '#EBF2FF' }]}>
              <Ionicons name="medical" size={22} color="#1D5CFF" />
            </View>
            <View>
              <Text style={styles.menuItemTitle}>Ficha Médica</Text>
              <Text style={styles.menuItemSubtitle}>Vacinas e alergias</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={styles.menuItemContent}>
            <View style={[styles.iconCircle, { backgroundColor: '#FFF4E5' }]}>
              <MaterialCommunityIcons name="nfc-variant" size={24} color="#FF9500" />
            </View>
            <View>
              <Text style={styles.menuItemTitle}>Configurar Smart Tag</Text>
              <Text style={styles.menuItemSubtitle}>Vincular link adotenima.com.br</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>

        {/* Card de Monitoramento */}
        <View style={styles.logCard}>
          <View style={styles.logHeader}>
            <Text style={styles.logTitle}>Monitoramento</Text>
            <FontAwesome5 name="satellite-dish" size={16} color="#1D5CFF" />
          </View>
          <View style={styles.logContent}>
            <Text style={styles.logLabel}>Última leitura detectada</Text>
            <Text style={styles.logData}>Campinas, SP • Hoje às 14:32</Text>
          </View>
        </View>

        {/* Padding inferior para a Navbar */}
        <View style={{ height: 120 }} />
      </ScrollView>

      <Navbar navigation={navigation} currentRoute="SmartTag" />
    </SafeAreaView>
  );
};

export default MyPetScreen;
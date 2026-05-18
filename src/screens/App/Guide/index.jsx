import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform,
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import Navbar from '../../components/NavBar/navbar';

const Guide = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        style={styles.scroll} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Guia Nima</Text>
        </View>

        <Text style={styles.sectionTitle}>Trilhas de Adestramento</Text>
        
        <TouchableOpacity 
          style={styles.trilhaCard}
          activeOpacity={0.8}
        >
          <View style={styles.trilhaInfo}>
            <Text style={styles.trilhaTitle}>Comandos Básicos</Text>
            <Text style={styles.trilhaText}>Senta, Fica e Junto (Técnicas Fundamentais)</Text>
          </View>
          <Ionicons name="play-circle" size={48} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Conteúdo por Raça</Text>
        
        <View style={styles.listContainer}>
          {['Saúde do Golden Retriever', 'Alimentação para Gatos', 'Exercícios: Porte Grande'].map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.raçaItem}
              activeOpacity={0.7}
            >
              <Text style={styles.raçaText}>{item}</Text>
              <Ionicons name="book-outline" size={20} color="#1D5CFF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Espaçamento inferior para não cobrir o conteúdo com a Navbar */}
        <View style={{ height: 120 }} />
      </ScrollView>

      <Navbar navigation={navigation} currentRoute="Guide" />
    </SafeAreaView>
  );
};

export default Guide;
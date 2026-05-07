import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { styles } from './styles'; 
import Navbar from '../components/NavBar/navbar';

const ongs = [
  { id: '1', name: 'ONG Patinhas Livres', cause: 'Resgate e Reabilitação', meta: 'R$ 5.000', image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?q=80&w=400' },
  { id: '2', name: 'Abrigo Esperança', cause: 'Alimentação e Castração', meta: 'R$ 2.300', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=400' },
];

const DonationsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        style={styles.scroll} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Vitrine Social</Text>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Apoie uma causa</Text>
          <Text style={styles.heroSubtitle}>Sua doação salva vidas diretamente pelo Pix.</Text>
        </View>

        {ongs.map(ong => (
          <TouchableOpacity key={ong.id} style={styles.ongCard} activeOpacity={0.9}>
            <Image source={{ uri: ong.image }} style={styles.ongImage} />
            
            <View style={styles.cardInfo}>
              <Text style={styles.ongName}>{ong.name}</Text>
              <Text style={styles.ongCause}>{ong.cause}</Text>
              
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.metaLabel}>Meta</Text>
                  <Text style={styles.metaValue}>{ong.meta}</Text>
                </View>
                
                <TouchableOpacity style={styles.pixButton} activeOpacity={0.7}>
                  <Text style={styles.pixText}>Doar via Pix</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        
        {/* Espaçamento para não sumir atrás da Navbar */}
        <View style={{ height: 120 }} />
      </ScrollView>

      <Navbar navigation={navigation} currentRoute="Match" />
    </SafeAreaView>
  );
};

export default DonationsScreen;
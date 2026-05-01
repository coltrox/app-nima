import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { styles, colors } from './styles';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSmartInsights, setShowSmartInsights] = useState(true);

  const suggestions = [
    { id: 1, name: 'Luna', breed: 'Golden Retriever', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=300&h=400&auto=format&fit=crop' },
    { id: 2, name: 'Thor', breed: 'Bulldog Francês', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=300&h=400&auto=format&fit=crop' },
    { id: 3, name: 'Mel', breed: 'Vira-lata', image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=300&h=400&auto=format&fit=crop' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scroll} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>nima</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={24} color={colors.navy} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Feather name="settings" size={22} color={colors.navy} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Saudação e Busca */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Olá, Pedro!</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar no nima..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.gray}
            />
          </View>
        </View>

        {/* Toggle de Seção */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            onPress={() => setShowSmartInsights(!showSmartInsights)}
            style={styles.toggleBtn}
          >
            <Text style={styles.toggleText}>
              {showSmartInsights ? "Ver Quiz de Perfil" : "Ver Meus Insights"}
            </Text>
            <Ionicons name="swap-horizontal" size={16} color={colors.blue} />
          </TouchableOpacity>
        </View>

        {showSmartInsights ? (
          <View style={styles.smartInsightsCard}>
            <Text style={styles.cardTitle}>Insights da Semana</Text>
            <View style={styles.metricsRow}>
              <View style={styles.metric}>
                <Text style={styles.metricNumber}>12</Text>
                <Text style={styles.metricLabel}>Matches</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricNumber}>45</Text>
                <Text style={styles.metricLabel}>Vistos</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricNumber}>08</Text>
                <Text style={styles.metricLabel}>Likes</Text>
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.ctaCard}>
            <View>
              <Text style={styles.ctaTitle}>Quiz de Personalidade</Text>
              <Text style={styles.ctaText}>Melhore seus matches em até 80%</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.white} />
          </TouchableOpacity>
        )}

        {/* Match em Destaque */}
        <Text style={styles.sectionTitle}>Destaque do Dia</Text>
        <View style={styles.matchCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop' }} 
            style={styles.matchImage} 
          />
          <LinearGradient
            colors={['transparent', 'rgba(5, 8, 43, 0.8)']}
            style={styles.imageGradient}
          />
          <View style={styles.matchInfoOverlay}>
            <View>
              <Text style={styles.matchNameWhite}>Bento, 2 anos</Text>
              <Text style={styles.matchBreedWhite}>Golden Retriever</Text>
            </View>
            <View style={styles.matchPercentBadge}>
              <Text style={styles.matchPercentText}>98% Match</Text>
            </View>
          </View>
        </View>

        {/* Progresso do Perfil */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Perfil quase pronto!</Text>
            <Text style={styles.progressValue}>75%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '75%' }]} />
          </View>
        </View>

        {/* Lista de Sugestões */}
        <Text style={styles.sectionTitle}>Recomendações</Text>
        <FlatList
          horizontal
          data={suggestions}
          renderItem={({ item }) => (
            <View style={styles.petSuggestionCard}>
              <Image source={{ uri: item.image }} style={styles.petSuggestionImage} />
              <Text style={styles.petName}>{item.name}</Text>
              <Text style={styles.petBreed}>{item.breed}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsList}
        />
      </ScrollView>

      {/* Menu Inferior (Navbar Float) */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={26} color={colors.blue} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart-outline" size={26} color={colors.gray} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubbles-outline" size={26} color={colors.gray} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={26} color={colors.gray} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
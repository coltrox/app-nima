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

import Navbar from '../../components/NavBar/navbar';
import Questionario from '../../components/Questionario/Questionario';

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSmartInsights, setShowSmartInsights] = useState(true);
  const [isQuizVisible, setIsQuizVisible] = useState(false);

  const handleCloseQuiz = () => {
    setIsQuizVisible(false);
  };

  const handleCompleteQuiz = (data) => {
    console.log('Quiz nima finalizado:', data);
    setIsQuizVisible(false);
  };

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
        {/* Header Superior */}
        <View style={styles.header}>
          <Text style={styles.logo}>nima</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={24} color={colors.navy} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Feather name="settings" size={22} color={colors.navy} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Secção de Saudação */}
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

        {/* Seletor de Insights/Quiz */}
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

        {/* Cards Dinâmicos */}
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
          <TouchableOpacity 
            style={styles.ctaCard}
            onPress={() => setIsQuizVisible(true)}
          >
            <View>
              <Text style={styles.ctaTitle}>Questionário de compatibilidade</Text>
              <Text style={styles.ctaText}>Melhore seus matches em até 80%</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.white} />
          </TouchableOpacity>
        )}

        {/* Destaque do Dia */}
        <Text style={styles.sectionTitle}>Destaque do Dia</Text>
        <TouchableOpacity 
            style={styles.matchCard}
            onPress={() => navigation.navigate('PetDetails')}
        >
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
        </TouchableOpacity>

        {/* Barra de Progresso */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Perfil quase pronto!</Text>
            <Text style={styles.progressValue}>75%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '75%' }]} />
          </View>
        </View>

        {/* Recomendações */}
        <Text style={styles.sectionTitle}>Recomendações</Text>
        <FlatList
          horizontal
          data={suggestions}
          renderItem={({ item }) => (
            <TouchableOpacity 
                style={styles.petSuggestionCard}
                onPress={() => navigation.navigate('PetDetails')}
            >
              <Image source={{ uri: item.image }} style={styles.petSuggestionImage} />
              <Text style={styles.petName}>{item.name}</Text>
              <Text style={styles.petBreed}>{item.breed}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsList}
        />
      </ScrollView>

      <Questionario 
        visible={isQuizVisible} 
        onClose={handleCloseQuiz}
        onComplete={handleCompleteQuiz}
      />

      <Navbar navigation={navigation} currentRoute="Home" />
      
    </SafeAreaView>
  );
};

export default HomeScreen;
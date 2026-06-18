import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importando estilos e cores estruturados
import { styles, colors } from './styles';

import Navbar from '../../components/NavBar/navbar';
import Questionario from '../../components/Questionario/Questionario';

const { width: screenWidth } = Dimensions.get('window');
const HAS_SEEN_TUTORIAL_KEY = '@nima:has_seen_tutorial';

// --- COMPONENTE DE TUTORIAL (ONBOARDING SLIDES) ---
const TutorialTutorial = ({ visible, onClose, onFinish }) => {
  if (!visible) return null;

  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const slides = [
    {
      id: 1,
      title: 'Bem-vindo ao nima',
      description: 'Encontre conexões autênticas e mude vidas. O seu match ideal está a poucos passos de distância.',
      icon: 'heart',
      colors: ['#FFEAE6', '#FFDCD3'],
      iconColor: colors.peach,
    },
    {
      id: 2,
      title: 'Curadoria Inteligente',
      description: 'Explore uma interface minimalista com recomendações personalizadas desenvolvidas pela nossa Inteligência Artificial.',
      icon: 'sparkles',
      colors: ['#E6F0FF', '#D2E5FF'],
      iconColor: '#5290F2',
    },
    {
      id: 3,
      title: 'Sintonia Perfeita',
      description: 'Responda ao nosso quiz de afinidade exclusivo para refinar seus resultados e descobrir compatibilidades reais.',
      icon: 'git-network-outline',
      colors: ['#F5E6FF', '#EAD2FF'],
      iconColor: colors.pastelPurple,
    },
    {
      id: 4,
      title: 'Segurança & Privacidade',
      description: 'Sua jornada de adoção é protegida de ponta a ponta. Valide seu perfil com total confidencialidade dos seus dados.',
      icon: 'shield-checkmark-outline',
      colors: ['#E3F7EB', '#C8EED9'],
      iconColor: '#3BB273',
    },
  ];

  // Controla a mudança via botão com animação fluida de slide
  const handleNext = () => {
    const nextIndex = currentSlide + 1;
    if (nextIndex < slides.length) {
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * screenWidth,
        animated: true,
      });
    } else {
      onFinish();
    }
  };

  // Captura o movimento do scroll em tempo real para sincronizar o botão e os indicadores
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { 
      useNativeDriver: false,
      listener: (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        // Calcula o índice com base no deslocamento atual (arredondando para o mais próximo)
        const index = Math.round(offsetX / screenWidth);
        if (index !== currentSlide && index >= 0 && index < slides.length) {
          setCurrentSlide(index);
        }
      }
    }
  );

  const renderSlide = ({ item }) => (
    <LinearGradient colors={item.colors} style={styles.slideContainer}>
      <View style={[styles.bgCircle, { top: 60, left: -40, backgroundColor: 'rgba(255,255,255,0.4)', width: 140, height: 140 }]} />
      <View style={[styles.bgCircle, { bottom: 120, right: -50, backgroundColor: 'rgba(255,255,255,0.3)', width: 200, height: 200 }]} />
      
      <View style={styles.slideContent}>
        <View style={[styles.slideIconContainer, { borderColor: item.iconColor, borderWidth: 1.5, borderRadius: 50, padding: 24 }]}>
          <Ionicons name={item.icon} size={70} color={item.iconColor} />
        </View>
        <Text style={[styles.slideTitle, { fontWeight: '700', letterSpacing: -0.5, marginTop: 30 }]}>{item.title}</Text>
        <Text style={[styles.slideDescription, { lineHeight: 24, fontSize: 15, color: '#555' }]}>{item.description}</Text>
      </View>
    </LinearGradient>
  );

  const dotWidth = 10;
  const dotGap = 12;
  const totalDotShift = dotWidth + dotGap;
  
  const indicatorTranslateX = scrollX.interpolate({
    inputRange: [0, screenWidth * (slides.length - 1)],
    outputRange: [0, (slides.length - 1) * totalDotShift],
    extrapolate: 'clamp',
  });

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgWarm }}>
        
        <TouchableOpacity style={styles.skipButton} onPress={onClose}>
          <Text style={[styles.skipButtonText, { fontWeight: '600', color: colors.textDark }]}>Pular</Text>
        </TouchableOpacity>

        <Animated.FlatList
          ref={flatListRef}
          horizontal
          pagingEnabled
          data={slides}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />

        <View style={styles.slideFooter}>
          {/* Indicador de Bolinhas com a Patinha Animada */}
          <View style={styles.paginationDotsContainer}>
            <View style={styles.passiveDotsRow}>
              {slides.map((_, index) => (
                <View key={index} style={[styles.dotInactive, { backgroundColor: 'rgba(0,0,0,0.1)' }]} />
              ))}
            </View>
            
            <Animated.View 
              style={[
                styles.dotActiveAnimated, 
                { transform: [{ translateX: indicatorTranslateX }] }
              ]}
            >
              <Text style={{ fontSize: 16 }}>🐾</Text>
            </Animated.View>
          </View>

          <TouchableOpacity style={[styles.slideActionNext, { borderRadius: 25, paddingHorizontal: 24 }]} onPress={handleNext}>
            <Text style={[styles.slideActionNextText, { fontWeight: '600' }]}>
              {currentSlide === slides.length - 1 ? "Começar" : "Próximo"}
            </Text>
            {currentSlide < slides.length - 1 && (
              <Ionicons name="arrow-forward" size={16} color={colors.white} style={{ marginLeft: 6 }} />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// --- COMPONENTE PRINCIPAL HOME ---
const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSmartInsights, setShowSmartInsights] = useState(true);
  const [isQuizVisible, setIsQuizVisible] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [profileProgress, setProfileProgress] = useState({ hasPhoto: false, hasForm: false, hasDocs: false });
  const [isFirstTimeTutorialVisible, setIsFirstTimeTutorialVisible] = useState(false);

  useEffect(() => {
    const checkTutorialStatus = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem(HAS_SEEN_TUTORIAL_KEY);
        if (hasSeen === null) {
          setIsFirstTimeTutorialVisible(true);
        }
      } catch (error) {
        console.error("Erro ao ler o AsyncStorage:", error);
      }
    };
    checkTutorialStatus();
  }, []);

  const disableTutorialPermanently = async () => {
    setIsFirstTimeTutorialVisible(false);
    try {
      await AsyncStorage.setItem(HAS_SEEN_TUTORIAL_KEY, 'true');
    } catch (error) {
      console.error("Erro ao gravar no AsyncStorage:", error);
    }
  };

  const completedSteps = Object.values(profileProgress).filter(Boolean).length;
  const totalSteps = 3;
  const progressPercent = (completedSteps / totalSteps) * 100;
  const isProfileComplete = completedSteps === totalSteps;

  const handleCloseQuiz = () => { setIsQuizVisible(false); };
  const handleCompleteQuiz = (data) => {
    setIsQuizVisible(false);
    setProfileProgress(prev => ({ ...prev, hasForm: true }));
  };

  const suggestions = [
    { id: 1, name: 'Luna', breed: 'Golden Retriever', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=300&h=400&auto=format&fit=crop' },
    { id: 2, name: 'Thor', breed: 'Bulldog Francês', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=300&h=400&auto=format&fit=crop' },
    { id: 3, name: 'Mel', breed: 'Vira-lata', image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=300&h=400&auto=format&fit=crop' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      
      <TutorialTutorial 
        visible={isFirstTimeTutorialVisible} 
        onClose={disableTutorialPermanently} 
        onFinish={disableTutorialPermanently} 
      />

      <ScrollView 
        style={styles.scroll} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.header}>
          <Text style={[styles.logo, { letterSpacing: -1 }]}>nima</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={22} color={colors.textDark} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Feather name="settings" size={20} color={colors.textDark} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>
            {isLoggedIn ? "Olá, Pedro! 👋" : "Conheça o nima"}
          </Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar conexões..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        {isLoggedIn && !isProfileComplete && (
          <TouchableOpacity 
            style={styles.progressCard}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Complete seu Perfil</Text>
              <Text style={styles.progressValue}>{Math.round(progressPercent)}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 8 }}>
              Insira sua foto, responda ao formulário e envie os documentos.
            </Text>
          </TouchableOpacity>
        )}

        {(!isLoggedIn || !isProfileComplete) && (
          <View style={styles.smartInsightsCard}>
            <View style={styles.insightIconCircle}>
              <Ionicons name="sparkles-outline" size={26} color={colors.peach} />
            </View>
            <Text style={[styles.cardTitle, { textAlign: 'center', marginBottom: 6 }]}>
               {!isLoggedIn ? "Modo Descoberta Ativo" : "Perfil em Andamento"}
            </Text>
            <Text style={{ color: colors.textMuted, textAlign: 'center', fontSize: 13, paddingHorizontal: 10, marginBottom: 15, lineHeight: 18 }}>
              {!isLoggedIn 
                ? "Explore a plataforma livremente. Ative sua conta para configurar o painel de afinidade e receber indicações personalizadas pela nossa IA." 
                : "Seu painel definitivo está sendo preparado. Finalize o envio da documentação para habilitar matches em tempo real."}
            </Text>
            {!isLoggedIn && (
              <TouchableOpacity 
                style={{ backgroundColor: colors.peach, paddingVertical: 11, paddingHorizontal: 28, borderRadius: 20 }}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={{ color: colors.white, fontWeight: '700', fontSize: 14 }}>Criar Conta</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {isProfileComplete && (
          <View>
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                onPress={() => setShowSmartInsights(!showSmartInsights)}
                style={styles.toggleBtn}
              >
                <Text style={styles.toggleText}>
                  {showSmartInsights ? "Ver Quiz de Perfil" : "Ver Analytics de Match"}
                </Text>
                <Ionicons name="swap-horizontal" size={16} color={colors.peach} />
              </TouchableOpacity>
            </View>

            {showSmartInsights ? (
              <View style={styles.smartInsightsCard}>
                <Text style={styles.cardTitle}>Métricas Semanais</Text>
                <View style={styles.metricsRow}>
                  <View style={styles.metric}>
                    <Text style={styles.metricNumber}>12</Text>
                    <Text style={styles.metricLabel}>Matches</Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricNumber}>45</Text>
                    <Text style={styles.metricLabel}>Visualizações</Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricNumber}>08</Text>
                    <Text style={styles.metricLabel}>Interesses</Text>
                  </View>
                </View>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.ctaCard}
                onPress={() => setIsQuizVisible(true)}
              >
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.ctaTitle}>Questionário de Compatibilidade</Text>
                  <Text style={styles.ctaText}>Aumente a precisão dos seus matches em até 80%</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.white} />
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={styles.sectionTitle}>
          {!isProfileComplete ? "Preview: Destaque do Dia" : "Destaque do Dia"}
        </Text>
        <TouchableOpacity 
            style={styles.matchCard}
            onPress={() => navigation.navigate('PetDetails')}
        >
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop' }} 
            style={styles.matchImage} 
          />
          <LinearGradient
            colors={['transparent', 'rgba(74, 62, 61, 0.7)']}
            style={styles.imageGradient}
          />
          <View style={styles.matchInfoOverlay}>
            <View>
              <Text style={styles.matchNameWhite}>Bento, 2 anos</Text>
              <Text style={styles.matchBreedWhite}>Golden Retriever</Text>
            </View>
            <View style={[styles.matchPercentBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Text style={styles.matchPercentText}>
                {!isProfileComplete ? "Sintonia: --%" : "98% de Compatibilidade"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>
            {!isProfileComplete ? "Preview: Sugestões de Match" : "Recomendações Especiais"}
        </Text>
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
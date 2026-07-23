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
import { useFocusEffect } from '@react-navigation/native';

// Importando estilos e cores estruturados
import { styles, colors } from './styles';
import authService from '../../Auth/authService'; 
import Questionario from '../../components/Questionario/Questionario';
import Navbar from '../../components/NavBar/navbar';
import Logo from '../../components/Logo';

const { width: screenWidth } = Dimensions.get('window');
const HAS_SEEN_TUTORIAL_KEY = '@nima:has_seen_tutorial';

// Variável de controle na memória volátil para detectar recarregamento completo (F5)
let isInitialAppLoad = true;

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

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { 
      useNativeDriver: false,
      listener: (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
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
  const [userName, setUserName] = useState('');
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isFirstTimeTutorialVisible, setIsFirstTimeTutorialVisible] = useState(false);

  // Carrega e atualiza dinamicamente as informações com validação estrita de persistência
  useFocusEffect(
    React.useCallback(() => {
      const loadUserData = async () => {
        try {
          const token = await AsyncStorage.getItem('@nima_token');
          const rememberMe = await AsyncStorage.getItem('@nima_remember_me');
          const fullName = await AsyncStorage.getItem('@nima_user_name'); 
          const profileCompletedStatus = await AsyncStorage.getItem('@nima_profile_completed');

          if (token) {
            // Se o app acabou de sofrer um F5/Recarregamento E o usuário NÃO pediu para manter logado
            if (isInitialAppLoad && rememberMe !== 'true') {
              await AsyncStorage.removeItem('@nima_token');
              await AsyncStorage.removeItem('@nima_user_role');
              await AsyncStorage.removeItem('@nima_user_name');
              await AsyncStorage.removeItem('@nima_profile_completed');
              
              setIsLoggedIn(false);
              setUserName('');
              setIsProfileComplete(false);
              isInitialAppLoad = false; 
              return;
            }

            // Fluxo normal: Mantém logado (seja vindo direto do LoginScreen ou com rememberMe ativado)
            setIsLoggedIn(true);
            setUserName(authService.getFirstName(fullName || ''));
            setIsProfileComplete(profileCompletedStatus === 'true');
          } else {
            setIsLoggedIn(false);
            setUserName('');
            setIsProfileComplete(false);
          }

          // Após a primeira checagem de foco no ciclo de vida atual da memória, desativa o gatilho inicial
          isInitialAppLoad = false;

        } catch (error) {
          console.error("Erro ao carregar dados do usuário na Home:", error);
        }
      };

      loadUserData();
    }, [])
  );

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

  const handleCloseQuiz = () => { setIsQuizVisible(false); };
  
  const handleCompleteQuiz = async (data) => {
    setIsQuizVisible(false);
    try {
      await authService.completeProfile(data);
      setIsProfileComplete(true);
    } catch (error) {
      console.error(error);
    }
  };

  // Dados mockados (visual-first). Serão ligados a /animais/recomendados depois.
  const acoes = [
    { key: 'adotar', label: 'Adotar', icon: 'paw-outline', active: true },
    { key: 'apadrinhar', label: 'Apadrinhar', icon: 'heart-outline' },
    { key: 'doar', label: 'Doar', icon: 'gift-outline' },
    { key: 'ongs', label: 'ONGs', icon: 'business-outline' },
  ];
  const match = {
    nome: 'Bento',
    idade: '2 anos',
    km: '3,2 km',
    compat: 92,
    ong: 'ONG Patas Unidas',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop',
    tags: [
      { icon: 'shield-checkmark-outline', label: 'Vacinado' },
      { icon: 'paw-outline', label: 'Porte médio' },
      { icon: 'heart-outline', label: 'Carinhoso' },
    ],
  };
  const perfilPct = 40;

  return (
    <SafeAreaView style={styles.container}>
      <TutorialTutorial
        visible={isFirstTimeTutorialVisible}
        onClose={disableTutorialPermanently}
        onFinish={disableTutorialPermanently}
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Logo height={26} />
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.bellWrap}>
              <Ionicons name="notifications-outline" size={23} color={colors.textDark} />
              <View style={styles.bellDot} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <View style={styles.avatar} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.locationPill} activeOpacity={0.7}>
          <Ionicons name="location-outline" size={15} color={colors.peach} />
          <Text style={styles.locationText}>Campinas, SP</Text>
          <Ionicons name="chevron-down" size={14} color={colors.textDark} />
        </TouchableOpacity>

        {/* Saudação */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Olá, {isLoggedIn && userName ? userName : 'tutor'}!</Text>
          <Text style={styles.greetingSub}>Pronto para encontrar um novo amigo?</Text>
        </View>

        {/* Busca */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar cães, raças ou cidades"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.85}>
            <Ionicons name="options-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Ações rápidas */}
        <View style={styles.quickRow}>
          {acoes.map((a) => (
            <TouchableOpacity key={a.key} style={[styles.quickCard, a.active && styles.quickCardActive]} activeOpacity={0.85}>
              <Ionicons name={a.icon} size={26} color={a.active ? colors.peach : colors.textDark} />
              <Text style={[styles.quickLabel, a.active && { color: colors.peach }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Banner de progresso do perfil → abre o questionário */}
        {!isProfileComplete && (
          <TouchableOpacity style={styles.profileBanner} activeOpacity={0.9} onPress={() => setIsQuizVisible(true)}>
            <View style={styles.profileBannerIcon}>
              <Ionicons name="paw" size={22} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileBannerText}>Seu perfil está {perfilPct}% completo</Text>
              <View style={styles.profileBarBg}>
                <View style={[styles.profileBarFill, { width: `${perfilPct}%` }]} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <Text style={styles.profileContinue}>Continuar</Text>
              <Ionicons name="chevron-forward" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        )}

        {/* Seu melhor match */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Seu melhor match</Text>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Text style={styles.sectionLink}>Ver todos</Text>
            <Ionicons name="chevron-forward" size={15} color={colors.peach} />
          </TouchableOpacity>
        </View>

        <View style={styles.matchCard}>
          <View style={styles.matchImageWrap}>
            <Image source={{ uri: match.image }} style={styles.matchImage} />
            <View style={styles.compatBadge}>
              <Ionicons name="heart" size={16} color={colors.peach} />
              <View>
                <Text style={styles.compatValue}>{match.compat}%</Text>
                <Text style={styles.compatLabel}>compatível</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.heartBtn}>
              <Ionicons name="heart-outline" size={20} color={colors.textDark} />
            </TouchableOpacity>
            <View style={styles.ongBadge}>
              <Ionicons name="shield-checkmark" size={14} color={colors.peach} />
              <Text style={styles.ongBadgeText}>{match.ong}</Text>
            </View>
          </View>
          <View style={styles.matchBody}>
            <View style={styles.matchTopRow}>
              <View>
                <Text style={styles.matchName}>{match.nome}</Text>
                <Text style={styles.matchMeta}>{match.idade}  ·  {match.km}</Text>
              </View>
              <TouchableOpacity style={styles.matchBtn} activeOpacity={0.85} onPress={() => navigation.navigate('PetDetails')}>
                <Text style={styles.matchBtnText}>Conhecer {match.nome}</Text>
                <Ionicons name="chevron-forward" size={15} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.tagRow}>
              {match.tags.map((t) => (
                <View key={t.label} style={styles.tag}>
                  <Ionicons name={t.icon} size={14} color={colors.textMuted} />
                  <Text style={styles.tagText}>{t.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Campanha */}
        <TouchableOpacity style={styles.campaignCard} activeOpacity={0.9} onPress={() => navigation.navigate('Donation')}>
          <View style={styles.campaignIcon}>
            <Ionicons name="heart" size={28} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.campaignTitle}>Ajude uma nova história</Text>
            <Text style={styles.campaignText}>A campanha de ração está em 68% da meta.</Text>
            <View style={styles.campaignBarBg}>
              <View style={[styles.campaignBarFill, { width: '68%' }]} />
            </View>
            <View style={styles.campaignBtn}>
              <Text style={styles.campaignBtnText}>Apoiar agora</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <Questionario visible={isQuizVisible} onClose={handleCloseQuiz} onComplete={handleCompleteQuiz} />

      <Navbar navigation={navigation} currentRoute="Home" />
    </SafeAreaView>
  );
};

export default HomeScreen;
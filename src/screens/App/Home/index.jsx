import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { styles, colors } from './styles';
import authService from '../../Auth/authService';
import Questionario from '../../components/Questionario/Questionario';
import Navbar from '../../components/NavBar/navbar';
import Logo from '../../components/Logo';
import Campo from '../../components/Campo';
import { Carregando, Erro, Vazio, Aviso } from '../../components/Estado';
import useCarregar from '../../../hooks/useCarregar';
import animalService, { primeiraFoto } from '../../../services/animalService';
import vaquinhaService, { emReais } from '../../../services/vaquinhaService';
import questionarioService from '../../../services/questionarioService';
import { mensagemDoErro } from '../../../services/http';

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
      colors: ['#EDF3FE', '#DCE8FC'],
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
      flatListRef.current?.scrollToOffset({ offset: nextIndex * screenWidth, animated: true });
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
      },
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
        <Text style={[styles.slideTitle, { letterSpacing: -0.5, marginTop: 30 }]}>{item.title}</Text>
        <Text style={[styles.slideDescription, { lineHeight: 24, fontSize: 15 }]}>{item.description}</Text>
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
          <Text style={styles.skipButtonText}>Pular</Text>
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
          getItemLayout={(_, index) => ({ length: screenWidth, offset: screenWidth * index, index })}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />

        <View style={styles.slideFooter}>
          <View style={styles.paginationDotsContainer}>
            <View style={styles.passiveDotsRow}>
              {slides.map((_, index) => (
                <View key={index} style={styles.dotInactive} />
              ))}
            </View>

            <Animated.View style={[styles.dotActiveAnimated, { transform: [{ translateX: indicatorTranslateX }] }]}>
              <Text style={{ fontSize: 16 }}>🐾</Text>
            </Animated.View>
          </View>

          <TouchableOpacity style={[styles.slideActionNext, { borderRadius: 25, paddingHorizontal: 24 }]} onPress={handleNext}>
            <Text style={styles.slideActionNextText}>
              {currentSlide === slides.length - 1 ? 'Começar' : 'Próximo'}
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

// Ações rápidas: cada uma leva a uma tela que existe de verdade no backend.
// "Apadrinhar" saiu — não há apadrinhamento no banco nem na API.
const ACOES = [
  { key: 'adotar', label: 'Adotar', icon: 'paw-outline', rota: 'Match' },
  { key: 'perdidos', label: 'Perdidos', icon: 'search-outline', rota: 'Desaparecidos' },
  { key: 'doar', label: 'Doar', icon: 'gift-outline', rota: 'Donation' },
  { key: 'ongs', label: 'ONGs', icon: 'business-outline', rota: 'Ongs' },
];

// --- COMPONENTE PRINCIPAL HOME ---
const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuizVisible, setIsQuizVisible] = useState(false);
  const [enviandoQuiz, setEnviandoQuiz] = useState(false);
  const [erroQuiz, setErroQuiz] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [isFirstTimeTutorialVisible, setIsFirstTimeTutorialVisible] = useState(false);

  // Feed de animais: tenta o recomendado (precisa de questionário) e cai
  // para a vitrine geral quando o tutor ainda não respondeu.
  const feed = useCarregar(() => animalService.feed(), {
    inicial: { lista: [], personalizado: false, aviso: null },
  });

  // Campanha do rodapé — mesma fonte da Vitrine Social.
  const vaquinhas = useCarregar(() => vaquinhaService.listar(), { inicial: [] });

  useFocusEffect(
    React.useCallback(() => {
      const loadUserData = async () => {
        try {
          const token = await AsyncStorage.getItem('@nima_token');
          const rememberMe = await AsyncStorage.getItem('@nima_remember_me');
          const fullName = await AsyncStorage.getItem('@nima_user_name');

          if (token) {
            // F5/recarregamento sem "manter conectado": derruba a sessão.
            if (isInitialAppLoad && rememberMe !== 'true') {
              await AsyncStorage.multiRemove([
                '@nima_token',
                '@nima_user_role',
                '@nima_user_name',
                '@nima_profile_completed',
              ]);
              setIsLoggedIn(false);
              setUserName('');
              isInitialAppLoad = false;
              return;
            }

            setIsLoggedIn(true);
            setUserName(authService.getFirstName(fullName || ''));

            // Quem manda é o backend, não o flag local: o login não devolve
            // "perfilCompleto", então perguntar ao /auth/relatorio é a única
            // forma correta de saber se o questionário já foi respondido.
            try {
              const respondeu = await questionarioService.jaRespondeu();
              setIsProfileComplete(respondeu);
              await AsyncStorage.setItem('@nima_profile_completed', respondeu ? 'true' : 'false');
            } catch {
              // Offline: confia no último valor conhecido em vez de incomodar.
              const salvo = await AsyncStorage.getItem('@nima_profile_completed');
              setIsProfileComplete(salvo !== 'false');
            }
          } else {
            setIsLoggedIn(false);
            setUserName('');
            setIsProfileComplete(true); // visitante não vê convite de questionário
          }

          isInitialAppLoad = false;
        } catch (error) {
          console.error('Erro ao carregar dados do usuário na Home:', error);
        }
      };

      loadUserData();
    }, [])
  );

  useEffect(() => {
    const checkTutorialStatus = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem(HAS_SEEN_TUTORIAL_KEY);
        if (hasSeen === null) setIsFirstTimeTutorialVisible(true);
      } catch (error) {
        console.error('Erro ao ler o AsyncStorage:', error);
      }
    };
    checkTutorialStatus();
  }, []);

  const disableTutorialPermanently = async () => {
    setIsFirstTimeTutorialVisible(false);
    try {
      await AsyncStorage.setItem(HAS_SEEN_TUTORIAL_KEY, 'true');
    } catch (error) {
      console.error('Erro ao gravar no AsyncStorage:', error);
    }
  };

  const handleCompleteQuiz = useCallback(async (respostas) => {
    setEnviandoQuiz(true);
    setErroQuiz(null);
    try {
      await questionarioService.enviar(respostas);
      await AsyncStorage.setItem('@nima_profile_completed', 'true');
      setIsProfileComplete(true);
      setIsQuizVisible(false);
      feed.recarregar(); // agora o feed vira recomendação de verdade
    } catch (e) {
      setErroQuiz(mensagemDoErro(e, 'Não foi possível salvar suas respostas.'));
    } finally {
      setEnviandoQuiz(false);
    }
  }, [feed]);

  const { lista, personalizado, aviso } = feed.dados || { lista: [], personalizado: false, aviso: null };

  const animais = useMemo(() => {
    const termo = searchQuery.trim().toLowerCase();
    if (!termo) return lista;
    return lista.filter((a) =>
      `${a.nome ?? ''} ${a.raca ?? ''} ${a.especie ?? ''} ${a.porte ?? ''}`.toLowerCase().includes(termo)
    );
  }, [lista, searchQuery]);

  const destaque = animais[0] ?? null;
  const campanha = (vaquinhas.dados || [])[0] ?? null;

  const Destaque = () => {
    if (feed.carregando && lista.length === 0) return <Carregando texto="Buscando pets perto de você…" />;
    if (feed.erro && lista.length === 0) return <Erro mensagem={feed.erro} onTentarDeNovo={feed.recarregar} />;
    if (!destaque) {
      return (
        <Vazio
          icone="paw-outline"
          titulo={searchQuery ? 'Nenhum pet com esse termo' : 'Nenhum pet disponível ainda'}
          texto={
            searchQuery
              ? 'Tente outro nome, raça ou porte.'
              : 'Assim que uma ONG cadastrar um animal, ele aparece aqui.'
          }
        />
      );
    }

    const foto = primeiraFoto(destaque);
    return (
      <View style={styles.matchCard}>
        <View style={styles.matchImageWrap}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.matchImage} />
          ) : (
            <View style={styles.matchImagePlaceholder}>
              <Ionicons name="paw" size={40} color={colors.peach} />
              <Text style={styles.matchImagePlaceholderText}>Sem foto cadastrada</Text>
            </View>
          )}

          {/* O score só existe no feed recomendado (vem do questionário). */}
          {destaque.compatibilidade != null && (
            <View style={styles.compatBadge}>
              <Ionicons name="heart" size={16} color={colors.peach} />
              <View>
                <Text style={styles.compatValue}>{Math.round(destaque.compatibilidade)}%</Text>
                <Text style={styles.compatLabel}>compatível</Text>
              </View>
            </View>
          )}

          {destaque.status_posse ? (
            <View style={styles.ongBadge}>
              <Ionicons name="shield-checkmark" size={14} color={colors.peach} />
              <Text style={styles.ongBadgeText}>{destaque.status_posse}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.matchBody}>
          <View style={styles.matchTopRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.matchName}>{destaque.nome}</Text>
              <Text style={styles.matchMeta}>
                {[destaque.idade, destaque.raca].filter(Boolean).join('  ·  ')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.matchBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('PetDetails', { id: destaque.id })}
            >
              <Text style={styles.matchBtnText}>Conhecer</Text>
              <Ionicons name="chevron-forward" size={15} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.tagRow}>
            {[destaque.especie, destaque.porte, destaque.temperamento]
              .filter(Boolean)
              .map((t) => (
                <View key={t} style={styles.tag}>
                  <Ionicons name="ellipse" size={7} color={colors.peach} />
                  <Text style={styles.tagText}>{t}</Text>
                </View>
              ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TutorialTutorial
        visible={isFirstTimeTutorialVisible}
        onClose={disableTutorialPermanently}
        onFinish={disableTutorialPermanently}
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
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

        <TouchableOpacity style={styles.locationPill} activeOpacity={0.7} onPress={() => navigation.navigate('Ongs')}>
          <Ionicons name="location-outline" size={15} color={colors.peach} />
          <Text style={styles.locationText}>ONGs perto de você</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.textDark} />
        </TouchableOpacity>

        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Olá, {isLoggedIn && userName ? userName : 'tutor'}!</Text>
          <Text style={styles.greetingSub}>Pronto para encontrar um novo amigo?</Text>
        </View>

        <View style={styles.searchRow}>
          {/* Campo padronizado: antes o ícone ficava por cima da área de
              digitação e o input tinha altura menor que o alvo de toque. */}
          <Campo
            icone="search"
            placeholder="Buscar por nome, raça ou porte"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            returnKeyType="search"
            containerStyle={{ flex: 1 }}
          />
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.85} onPress={() => navigation.navigate('Match')}>
            <Ionicons name="grid-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.quickRow}>
          {ACOES.map((a) => (
            <TouchableOpacity
              key={a.key}
              style={styles.quickCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate(a.rota)}
            >
              <Ionicons name={a.icon} size={26} color={colors.textDark} />
              <Text style={styles.quickLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Convite ao questionário — só quando o backend confirma que falta */}
        {isLoggedIn && !isProfileComplete && (
          <TouchableOpacity style={styles.profileBanner} activeOpacity={0.9} onPress={() => setIsQuizVisible(true)}>
            <View style={styles.profileBannerIcon}>
              <Ionicons name="paw" size={22} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileBannerText}>Responda o questionário de afinidade</Text>
              <Text style={[styles.profileContinue, { opacity: 0.8, marginTop: 2 }]}>
                São 20 perguntas — é o que gera suas recomendações.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </TouchableOpacity>
        )}

        {aviso && isLoggedIn && isProfileComplete ? <Aviso texto={aviso} /> : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {personalizado ? 'Seu melhor match' : 'Disponíveis para adoção'}
          </Text>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}
            onPress={() => navigation.navigate('Match')}
          >
            <Text style={styles.sectionLink}>Ver todos</Text>
            <Ionicons name="chevron-forward" size={15} color={colors.peach} />
          </TouchableOpacity>
        </View>

        <Destaque />

        {/* Campanha real da Vitrine Social */}
        {campanha ? (
          <TouchableOpacity style={styles.campaignCard} activeOpacity={0.9} onPress={() => navigation.navigate('Donation')}>
            <View style={styles.campaignIcon}>
              <Ionicons name="heart" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.campaignTitle}>{campanha.titulo}</Text>
              <Text style={styles.campaignText} numberOfLines={2}>
                {campanha.descricao || campanha.ong?.nome || 'Campanha aberta agora'}
                {emReais(campanha.meta) ? `  ·  Meta ${emReais(campanha.meta)}` : ''}
              </Text>
              <View style={styles.campaignBtn}>
                <Text style={styles.campaignBtnText}>Apoiar agora</Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : null}
      </ScrollView>

      <Questionario
        visible={isQuizVisible}
        onClose={() => { setIsQuizVisible(false); setErroQuiz(null); }}
        onComplete={handleCompleteQuiz}
        enviando={enviandoQuiz}
        erro={erroQuiz}
      />

      <Navbar navigation={navigation} currentRoute="Home" />
    </SafeAreaView>
  );
};

export default HomeScreen;

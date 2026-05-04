import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingForm from '../../../components/OnboardingForm';

const HomeScreen = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
        setShowOnboarding(hasOnboarded !== 'true');
      } catch (error) {
        setShowOnboarding(true);
      }
    };
    checkFirstLaunch();
  }, []);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasOnboarded', 'true');
      setShowOnboarding(false);
    } catch (error) {
      // Erro ao salvar
    }
  };

  if (showOnboarding) {
    return <OnboardingForm onComplete={completeOnboarding} />;
  }

  // Mock data
  const promoData = [
    { id: '1', title: 'Promo 1', subtitle: '50% OFF' },
    { id: '2', title: 'Promo 2', subtitle: 'Frete Grátis' },
    { id: '3', title: 'Promo 3', subtitle: 'Novo Lançamento' },
  ];

  const progressData = [
    { id: '1', title: 'Meu Progresso 1', percent: 80 },
    { id: '2', title: 'Meu Progresso 2', percent: 50 },
    { id: '3', title: 'Meu Progresso 3', percent: 95 },
  ];

  const sugestoesData = [
    { id: '1', title: 'Sugestão 1 para você' },
    { id: '2', title: 'Sugestão 2 personalizada' },
    { id: '3', title: 'Sugestão 3 imperdível' },
  ];

  const matchesData = [
    { id: '1', name: 'Match 1', score: 95 },
    { id: '2', name: 'Match 2', score: 88 },
    { id: '3', name: 'Match 3', score: 92 },
    { id: '4', name: 'Match 4', score: 76 },
  ];

  const renderPromo = ({ item }) => (
    <View style={styles.promoItem}>
      <Text style={styles.promoTitle}>{item.title}</Text>
      <Text style={styles.promoSubtitle}>{item.subtitle}</Text>
    </View>
  );

  const renderProgress = ({ item }) => (
    <View style={styles.progressItem}>
      <Text style={styles.progressTitle}>{item.title}</Text>
      <Text style={styles.progressPercent}>{item.percent}%</Text>
    </View>
  );

  const renderSugestao = ({ item }) => (
    <View style={styles.sugestaoItem}>
      <Text>{item.title}</Text>
    </View>
  );

  const renderMatch = ({ item }) => (
    <View style={styles.matchItem}>
      <Text style={styles.matchName}>{item.name}</Text>
      <Text style={styles.matchScore}>{item.score}%</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>LogoApp</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Text style={styles.icon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={styles.icon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SearchBar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produtos, marcas..."
        />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promoções</Text>
          <FlatList
            data={promoData}
            renderItem={renderPromo}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progresso</Text>
          <FlatList
            data={progressData}
            renderItem={renderProgress}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sugestões</Text>
          <FlatList
            data={sugestoesData}
            renderItem={renderSugestao}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Matches</Text>
          <FlatList
            data={matchesData}
            renderItem={renderMatch}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.matchRow}
          />
        </View>
      </ScrollView>

      {/* BottomNavBar flutuante */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.activeNav]}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🔍</Text>
          <Text style={styles.navLabel}>Busca</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>❤️</Text>
          <Text style={styles.navLabel}>Matches</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⭐</Text>
          <Text style={styles.navLabel}>Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginLeft: 10,
  },
  iconBtn: {
    marginLeft: 15,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  promoItem: {
    backgroundColor: 'white',
    padding: 20,
    marginRight: 15,
    borderRadius: 16,
    minWidth: 160,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  progressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 16,
    flex: 1,
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  sugestaoItem: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchRow: {
    justifyContent: 'space-between',
  },
  matchItem: {
    flexBasis: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  matchScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeNav: {
    // Estilo ativo pode ser expandido
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  navLabelActive: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
});

export default HomeScreen;
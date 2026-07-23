import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import Navbar from '../../components/NavBar/navbar';
import Logo from '../../components/Logo';
import { BRAND } from '../../../theme';

// Conteúdo mockado (visual-first). O Guia é conteúdo editorial do app,
// não vem do backend — será substituído por material real do TCC.
const TEMAS = [
  { key: 'adestramento', label: 'Adestramento', icon: 'megaphone-outline' },
  { key: 'saude', label: 'Saúde', icon: 'shield-checkmark-outline' },
  { key: 'alimentacao', label: 'Alimentação', icon: 'nutrition-outline' },
  { key: 'comportamento', label: 'Comportamento', icon: 'happy-outline' },
];

const RECOMENDADOS = [
  {
    tag: 'SAÚDE',
    titulo: 'Saúde do Golden Retriever',
    tempo: '6 min de leitura',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop',
  },
  {
    tag: 'BEM-ESTAR',
    titulo: 'Exercícios para cães de porte grande',
    tempo: '5 min de leitura',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600&auto=format&fit=crop',
  },
];

const RAPIDOS = [
  { titulo: 'Alimentação para filhotes', tempo: '4 min', icon: 'nutrition-outline' },
  { titulo: 'Como reduzir a ansiedade', tempo: '4 min', icon: 'heart-outline' },
];

const Guide = ({ navigation }) => {
  const [busca, setBusca] = useState('');
  const [tema, setTema] = useState('adestramento');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Logo height={26} />
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.bellWrap}>
              <Ionicons name="notifications-outline" size={23} color={BRAND.ink} />
              <View style={styles.bellDot} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <View style={styles.avatar} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.title}>Guia Nima</Text>
        <Text style={styles.subtitle}>Informações para cuidar, ensinar e criar vínculos.</Text>

        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={BRAND.inkSoft} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar guias, raças ou temas"
              placeholderTextColor={BRAND.inkSoft}
              value={busca}
              onChangeText={setBusca}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.85}>
            <Ionicons name="options-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.temaLabel}>Explorar por tema</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {TEMAS.map((t) => {
            const ativo = tema === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={[styles.chip, ativo && styles.chipActive]}
                onPress={() => setTema(t.key)}
                activeOpacity={0.85}
              >
                <Ionicons name={t.icon} size={16} color={ativo ? '#fff' : BRAND.ink} />
                <Text style={[styles.chipText, ativo && styles.chipTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Trilha em destaque */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trilha em destaque</Text>
          <TouchableOpacity><Text style={styles.sectionLink}>Ver todas</Text></TouchableOpacity>
        </View>

        <View style={styles.trilhaCard}>
          <Text style={styles.trilhaTag}>ADESTRAMENTO</Text>
          <Text style={styles.trilhaTitle}>Comandos básicos</Text>
          <Text style={styles.trilhaSub}>Senta, fica e junto</Text>
          <Text style={styles.trilhaMeta}>4 aulas  ·  18 min</Text>
          <Text style={styles.trilhaProgressLabel}>1 de 4 concluída</Text>
          <View style={styles.trilhaBarBg}>
            <View style={[styles.trilhaBarFill, { width: '25%' }]} />
          </View>
          <TouchableOpacity style={styles.trilhaBtn} activeOpacity={0.85}>
            <Ionicons name="play-circle" size={20} color="#fff" />
            <Text style={styles.trilhaBtnText}>Continuar trilha</Text>
          </TouchableOpacity>
        </View>

        {/* Recomendados */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recomendados para você</Text>
          <TouchableOpacity><Text style={styles.sectionLink}>Ver todas</Text></TouchableOpacity>
        </View>

        <View style={styles.recRow}>
          {RECOMENDADOS.map((r) => (
            <TouchableOpacity key={r.titulo} style={styles.recCard} activeOpacity={0.9}>
              <Image source={{ uri: r.image }} style={styles.recImage} />
              <View style={styles.recBody}>
                <Text style={styles.recTag}>{r.tag}</Text>
                <Text style={styles.recTitle}>{r.titulo}</Text>
                <View style={styles.recFooter}>
                  <Text style={styles.recTime}>{r.tempo}</Text>
                  <Ionicons name="bookmark-outline" size={18} color={BRAND.blue} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Guias rápidos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Guias rápidos</Text>
        </View>

        <View style={styles.quickList}>
          {RAPIDOS.map((g, i) => (
            <View key={g.titulo}>
              <TouchableOpacity style={styles.quickItem} activeOpacity={0.7}>
                <View style={styles.quickLeft}>
                  <View style={styles.quickIcon}>
                    <Ionicons name={g.icon} size={20} color={BRAND.blue} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.quickTitle}>{g.titulo}</Text>
                    <Text style={styles.quickTime}>{g.tempo}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C7CFD9" />
              </TouchableOpacity>
              {i < RAPIDOS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </ScrollView>

      <Navbar navigation={navigation} currentRoute="Guide" />
    </SafeAreaView>
  );
};

export default Guide;

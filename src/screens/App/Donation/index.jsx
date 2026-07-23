import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import Navbar from '../../components/NavBar/navbar';
import Logo from '../../components/Logo';
import { BRAND } from '../../../theme';

// Mock (visual-first). Depois liga em GET /api/vaquinhas (PIX copia-e-cola real da ONG).
const CAUSAS = [
  { key: 'todas', label: 'Todas', icon: 'grid-outline' },
  { key: 'racao', label: 'Ração', icon: 'nutrition-outline' },
  { key: 'tratamento', label: 'Tratamento', icon: 'medkit-outline' },
  { key: 'abrigos', label: 'Abrigos', icon: 'home-outline' },
];

const DESTAQUE = {
  ong: 'ONG Patinhas Livres',
  cidade: 'Campinas, SP',
  titulo: 'Ração e reabilitação',
  descricao: 'Ajude 60 animais resgatados a receber alimento e cuidados.',
  pct: 77,
  arrecadado: 'R$ 3.850',
  meta: 'R$ 5.000',
  apoiadores: 142,
  dias: 12,
  image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop',
};

const OUTRAS = [
  {
    ong: 'Abrigo Esperança',
    titulo: 'Novo espaço de acolhimento',
    pct: 38,
    arrecadado: 'R$ 2.300',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=400&auto=format&fit=crop',
  },
];

const DonationsScreen = ({ navigation }) => {
  const [causa, setCausa] = useState('todas');

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

        <Text style={styles.title}>Vitrine Social</Text>
        <Text style={styles.subtitle}>Apoie uma causa e acompanhe cada transformação.</Text>

        {/* Impacto da comunidade */}
        <View style={styles.impactCard}>
          <View style={styles.impactIcon}>
            <Ionicons name="heart" size={26} color={BRAND.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.impactLabel}>Impacto da comunidade</Text>
            <View style={styles.impactRow}>
              <View>
                <Text style={styles.impactValue}>R$ 42.680</Text>
                <Text style={styles.impactCaption}>arrecadados este mês</Text>
              </View>
              <View style={styles.impactDivider} />
              <View>
                <Text style={styles.impactValue}>128</Text>
                <Text style={styles.impactCaption}>animais ajudados</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Filtro por causa */}
        <Text style={styles.chipsLabel}>Encontre uma causa</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {CAUSAS.map((c) => {
            const ativo = causa === c.key;
            return (
              <TouchableOpacity
                key={c.key}
                style={[styles.chip, ativo && styles.chipActive]}
                onPress={() => setCausa(c.key)}
                activeOpacity={0.85}
              >
                <Ionicons name={c.icon} size={16} color={ativo ? '#fff' : BRAND.ink} />
                <Text style={[styles.chipText, ativo && styles.chipTextActive]}>{c.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Campanha em destaque */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Campanha em destaque</Text>
          <TouchableOpacity><Text style={styles.sectionLink}>Ver todas</Text></TouchableOpacity>
        </View>

        <View style={styles.campaignCard}>
          <View style={styles.campaignImageWrap}>
            <Image source={{ uri: DESTAQUE.image }} style={styles.campaignImage} />
            <TouchableOpacity style={styles.heartBtn}>
              <Ionicons name="heart-outline" size={19} color={BRAND.ink} />
            </TouchableOpacity>
          </View>
          <View style={styles.campaignBody}>
            <View style={styles.ongRow}>
              <Ionicons name="shield-checkmark" size={16} color={BRAND.blue} />
              <Text style={styles.ongName}>{DESTAQUE.ong}</Text>
            </View>
            <View style={styles.ongLocal}>
              <Ionicons name="location-outline" size={13} color={BRAND.inkSoft} />
              <Text style={styles.ongLocalText}>{DESTAQUE.cidade}</Text>
            </View>

            <Text style={styles.campaignTitle}>{DESTAQUE.titulo}</Text>
            <Text style={styles.campaignDesc}>{DESTAQUE.descricao}</Text>

            <View style={styles.barRow}>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${DESTAQUE.pct}%` }]} />
              </View>
              <Text style={styles.barPct}>{DESTAQUE.pct}%</Text>
            </View>

            <View style={styles.valuesRow}>
              <View>
                <Text style={styles.raised}>{DESTAQUE.arrecadado}</Text>
                <Text style={styles.raisedLabel}>arrecadados</Text>
              </View>
              <View>
                <Text style={styles.metaLabel}>Meta</Text>
                <Text style={styles.metaValue}>{DESTAQUE.meta}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="people-outline" size={15} color={BRAND.inkSoft} />
                <Text style={styles.statText}>{DESTAQUE.apoiadores} apoiadores</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={15} color={BRAND.inkSoft} />
                <Text style={styles.statText}>{DESTAQUE.dias} dias restantes</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.pixBtn} activeOpacity={0.85}>
              <Ionicons name="qr-code-outline" size={20} color="#fff" />
              <Text style={styles.pixBtnText}>Doar via Pix</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contasLink}>
              <Ionicons name="shield-checkmark-outline" size={16} color={BRAND.blue} />
              <Text style={styles.contasText}>Ver prestação de contas</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Outras causas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Outras causas</Text>
          <TouchableOpacity><Text style={styles.sectionLink}>Ver todas</Text></TouchableOpacity>
        </View>

        {OUTRAS.map((o) => (
          <View key={o.titulo} style={styles.otherCard}>
            <Image source={{ uri: o.image }} style={styles.otherImage} />
            <View style={{ flex: 1 }}>
              <View style={styles.otherOng}>
                <Ionicons name="shield-checkmark" size={13} color={BRAND.blue} />
                <Text style={styles.otherOngText}>{o.ong}</Text>
              </View>
              <Text style={styles.otherTitle}>{o.titulo}</Text>
              <View style={styles.otherBarRow}>
                <View style={[styles.barBg, { flex: 1 }]}>
                  <View style={[styles.barFill, { width: `${o.pct}%` }]} />
                </View>
                <Text style={styles.otherPct}>{o.pct}% da meta</Text>
              </View>
              <Text style={styles.otherRaised}>{o.arrecadado}</Text>
            </View>
            <TouchableOpacity style={styles.apoiarBtn} activeOpacity={0.85}>
              <Text style={styles.apoiarBtnText}>Apoiar</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Nota de transparência */}
        <View style={styles.noteCard}>
          <Ionicons name="shield-checkmark" size={20} color={BRAND.blue} />
          <Text style={styles.noteText}>Doações verificadas e acompanhamento transparente.</Text>
          <TouchableOpacity><Text style={styles.noteLink}>Saiba mais</Text></TouchableOpacity>
        </View>
      </ScrollView>

      <Navbar navigation={navigation} currentRoute="Donation" />
    </SafeAreaView>
  );
};

export default DonationsScreen;

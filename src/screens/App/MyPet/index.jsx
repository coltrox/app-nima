import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import Navbar from '../../components/NavBar/navbar';
import Logo from '../../components/Logo';
import { BRAND } from '../../../theme';

// Mock (visual-first). Depois liga em /animais/minhas + /animais/:id/leituras.
//
// A Patinha é uma tag NFC: não tem bateria nem GPS contínuo. Por isso o card
// mostra a ÚLTIMA LEITURA registrada (quando alguém escaneou), e não
// "bateria 86%" / rastreio ao vivo como no rascunho do design.
const PET = {
  nome: 'Bento',
  raca: 'Golden Retriever',
  idade: '2 anos',
  tagCodigo: 'NIMA-2048',
  foto: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop',
  ultimaLeitura: { local: 'Campinas, SP', quando: 'Hoje às 14:32' },
};

const ACESSOS = [
  { label: 'Ficha médica', icon: 'medkit-outline' },
  { label: 'Patinha', icon: 'pricetag-outline' },
  { label: 'Rotina', icon: 'calendar-outline' },
  { label: 'Documentos', icon: 'document-text-outline' },
];

const CUIDADOS = [
  { label: 'Passeio', icon: 'walk-outline', feito: true },
  { label: 'Alimentação', icon: 'restaurant-outline', feito: true },
  { label: 'Água', icon: 'water-outline', feito: false },
];

const MyPetScreen = ({ navigation }) => {
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
              <View style={styles.avatarSmall} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.title}>Meu pet</Text>
        <Text style={styles.subtitle}>Tudo sobre o {PET.nome} em um só lugar.</Text>

        {/* Card do pet */}
        <View style={styles.petCard}>
          <Image source={{ uri: PET.foto }} style={styles.petPhoto} />
          <View style={{ flex: 1 }}>
            <View style={styles.petNameRow}>
              <Text style={styles.petName}>{PET.nome}</Text>
              <TouchableOpacity>
                <Ionicons name="create-outline" size={19} color={BRAND.blue} />
              </TouchableOpacity>
            </View>
            <Text style={styles.petBreed}>{PET.raca}  ·  {PET.idade}</Text>

            <View style={styles.tagBadge}>
              <Ionicons name="radio-outline" size={14} color="#fff" />
              <Text style={styles.tagBadgeText}>Patinha ativa</Text>
            </View>

            <View style={styles.petMetaRow}>
              <Ionicons name="pricetag-outline" size={15} color={BRAND.inkSoft} />
              <View>
                <Text style={styles.petMetaLabel}>Código</Text>
                <Text style={styles.petMetaValue}>{PET.tagCodigo}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Acessos rápidos */}
        <Text style={styles.sectionTitle}>Acessos rápidos</Text>
        <View style={styles.quickGrid}>
          {ACESSOS.map((a) => (
            <TouchableOpacity key={a.label} style={styles.quickCard} activeOpacity={0.85}>
              <Ionicons name={a.icon} size={24} color={BRAND.blue} />
              <Text style={styles.quickLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Monitoramento da Patinha — última leitura NFC */}
        <View style={styles.tagCard}>
          <Text style={styles.tagCardTitle}>Monitoramento da Patinha</Text>
          <View style={styles.tagOnlineRow}>
            <View style={styles.tagOnlineDot} />
            <Text style={styles.tagOnlineText}>Tag registrada e ativa</Text>
          </View>

          <View style={styles.tagBody}>
            <View style={styles.tagMapThumb}>
              <Ionicons name="location" size={32} color={BRAND.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tagInfoLabel}>Última leitura detectada</Text>
              <Text style={styles.tagInfoValue}>
                {PET.ultimaLeitura.local}  ·  {PET.ultimaLeitura.quando}
              </Text>
              <TouchableOpacity style={styles.tagBtn} activeOpacity={0.85}>
                <Ionicons name="map-outline" size={17} color="#fff" />
                <Text style={styles.tagBtnText}>Ver no mapa</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.tagHistLink}>
            <Text style={styles.tagHistText}>Histórico de leituras</Text>
            <Ionicons name="chevron-forward" size={15} color="#8FB4F5" />
          </TouchableOpacity>
        </View>

        {/* Vacinas */}
        <Text style={styles.sectionTitle}>Saúde</Text>
        <View style={styles.vacCard}>
          <View style={styles.vacIcon}>
            <Ionicons name="shield-checkmark" size={24} color={BRAND.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.vacTitle}>Vacinas em dia</Text>
            <Text style={styles.vacSub}>Próxima dose: 12 de agosto</Text>
            <View style={styles.vacBarRow}>
              <View style={styles.vacBarBg}>
                <View style={[styles.vacBarFill, { width: '80%' }]} />
              </View>
              <Text style={styles.vacCount}>4 de 5</Text>
            </View>
          </View>
          <View style={styles.okBadge}>
            <Text style={styles.okBadgeText}>Em dia</Text>
          </View>
        </View>

        {/* Cuidados de hoje */}
        <Text style={styles.sectionTitle}>Cuidados de hoje</Text>
        <View style={styles.careRow}>
          {CUIDADOS.map((c) => (
            <TouchableOpacity key={c.label} style={styles.careCard} activeOpacity={0.85}>
              <Ionicons name={c.icon} size={26} color={BRAND.blue} />
              <Text style={styles.careLabel}>{c.label}</Text>
              <Text style={[styles.careStatus, { color: c.feito ? BRAND.success : BRAND.blue }]}>
                {c.feito ? '✓ Feito' : 'Pendente'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Navbar navigation={navigation} currentRoute="MyPet" />
    </SafeAreaView>
  );
};

export default MyPetScreen;

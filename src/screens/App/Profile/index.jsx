import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image, Alert,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './styles';
import Navbar from '../../components/NavBar/navbar';
import Anel from '../../components/Anel';
import { Carregando } from '../../components/Estado';
import { BRAND } from '../../../theme';
import t, { PAD } from '../../../theme/telaStyles';
import useCarregar from '../../../hooks/useCarregar';
import perfilService from '../../../services/perfilService';
import questionarioService from '../../../services/questionarioService';
import animalService, { primeiraFoto } from '../../../services/animalService';
import solicitacaoService from '../../../services/solicitacaoService';
import favoritos from '../../../services/favoritos';

// Perfil do tutor.
//
// PROGRESSO (regra definida pelo usuário):
//   questionário respondido .......... 80%
//   + ter pet (adotado ou cadastrado) . 100%
// Sem questionário fica em 20%, que é o que a conta sozinha representa.
//
// AVATAR: a foto do pet, não do tutor. `profiles` não guarda imagem e o app
// não envia foto — usar o pet aproxima o app de quem ele serve, que era a
// intenção. Sem pet com foto, cai na inicial do nome.
//
// FAVORITOS: vivem em AsyncStorage (não há tabela no backend); os ids são
// resolvidos contra a vitrine para virar card.

const CHAVES_SESSAO = [
  '@nima_token',
  '@nima_user_role',
  '@nima_user_name',
  '@nima_remember_me',
  '@nima_profile_completed',
];

const ProfileScreen = ({ navigation }) => {
  const dados = useCarregar(
    async () => {
      const [perfil, respondeu, meus, adotados, favIds, vitrine] = await Promise.all([
        perfilService.obter().catch(() => null),
        questionarioService.jaRespondeu().catch(() => false),
        animalService.meus().catch(() => []),
        solicitacaoService.meusPets().catch(() => []),
        favoritos.listar(),
        animalService.listarTodos().catch(() => []),
      ]);

      // Desduplica: um pet adotado e já transferido aparece nas duas listas.
      const vistos = new Set();
      const pets = [];
      for (const p of [...meus, ...adotados]) {
        if (vistos.has(String(p.id))) continue;
        vistos.add(String(p.id));
        pets.push(p);
      }

      const favoritados = (vitrine || []).filter((a) => favIds.includes(String(a.id)));
      return { perfil, respondeu, pets, favoritados, totalFavoritos: favIds.length };
    },
    { inicial: null }
  );

  const { perfil, respondeu, pets = [], favoritados = [], totalFavoritos = 0 } = dados.dados || {};

  // Fallback offline: nome e e-mail guardados no login.
  const [nomeLocal, setNomeLocal] = useState('');
  const [emailLocal, setEmailLocal] = useState('');
  useEffect(() => {
    (async () => {
      setNomeLocal((await AsyncStorage.getItem('@nima_user_name')) || '');
      setEmailLocal((await AsyncStorage.getItem('@nima_email')) || '');
    })();
  }, []);

  const nome = perfil?.nome || nomeLocal || 'Tutor Nima';
  const email = perfil?.email || emailLocal || '';

  // 20% pela conta, +60% pelo questionário, +20% por ter pet.
  const progresso = useMemo(() => {
    let p = 20;
    if (respondeu) p += 60;
    if (pets.length > 0) p += 20;
    return p;
  }, [respondeu, pets.length]);

  // O avatar é a foto do pet — o primeiro que tiver imagem.
  const fotoPet = useMemo(() => {
    for (const p of pets) {
      const f = primeiraFoto(p);
      if (f) return { uri: f, nome: p.nome };
    }
    return null;
  }, [pets]);

  const inicial = (nome || 'T').trim().charAt(0).toUpperCase();

  const sair = () => {
    Alert.alert('Sair da conta', 'Você precisará entrar de novo para adotar ou ver seus pets.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(CHAVES_SESSAO);
          } catch {
            // segue pro login de qualquer forma
          }
          navigation.replace('Login');
        },
      },
    ]);
  };

  const proximoPasso = !respondeu
    ? { acao: 'Responder o questionário', rota: 'Home' }
    : pets.length === 0
      ? { acao: 'Ver pets para adoção', rota: 'Match' }
      : null;

  if (dados.carregando && !dados.dados) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Carregando texto="Carregando seu perfil…" />
        <Navbar navigation={navigation} currentRoute="Profile" />
      </SafeAreaView>
    );
  }

  const MenuItem = ({ item, last }) => (
    <TouchableOpacity
      style={[styles.menuItem, last && styles.menuItemLast]}
      activeOpacity={0.7}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: item.color + '18' }]}>
          <Ionicons name={item.icon} size={21} color={item.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.menuItemTitle}>{item.title}</Text>
          <Text style={styles.menuItemSub}>{item.sub}</Text>
        </View>
      </View>
      {item.badge ? (
        <View style={styles.menuBadge}><Text style={styles.menuBadgeText}>{item.badge}</Text></View>
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#C7CFD9" />
      )}
    </TouchableOpacity>
  );

  const minhaConta = [
    {
      title: 'Minhas adoções',
      sub: 'Solicitações enviadas e o status de cada uma',
      icon: 'clipboard-outline',
      color: BRAND.blue,
      onPress: () => navigation.navigate('Solicitacoes'),
    },
    {
      title: 'Meus pets',
      sub: pets.length ? `${pets.length} ${pets.length === 1 ? 'pet' : 'pets'}` : 'Nenhum pet ainda',
      icon: 'paw-outline',
      color: BRAND.success,
      onPress: () => navigation.navigate('MyPet'),
    },
    {
      title: 'Questionário de afinidade',
      sub: respondeu ? 'Respondido' : 'Ainda não respondido',
      icon: 'sparkles-outline',
      color: '#FF9500',
      badge: respondeu ? 'Concluído' : undefined,
      onPress: () => navigation.navigate('Home'),
    },
    {
      title: 'Configurações',
      sub: 'Notificações, privacidade e conta',
      icon: 'settings-outline',
      color: '#6B7280',
      onPress: () => navigation.navigate('Settings'),
    },
  ];

  const descobrir = [
    {
      title: 'ONGs parceiras',
      sub: 'Contato e endereço de quem cuida',
      icon: 'business-outline',
      color: BRAND.blue,
      onPress: () => navigation.navigate('Ongs'),
    },
    {
      title: 'Mural de desaparecidos',
      sub: 'Ajude a encontrar um animal',
      icon: 'search-outline',
      color: BRAND.danger,
      onPress: () => navigation.navigate('Desaparecidos'),
    },
    {
      title: 'Guia de cuidados',
      sub: 'Saúde, bem-estar e adestramento',
      icon: 'book-outline',
      color: '#6B7280',
      onPress: () => navigation.navigate('Guide'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Meu perfil</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={sair} activeOpacity={0.7}>
            <Feather name="log-out" size={17} color={BRAND.danger} />
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Gerencie sua conta e acompanhe seu progresso.</Text>

        {/* Card de perfil — avatar é a foto do pet */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatarWrapper}>
              {fotoPet ? (
                <Image
                  source={{ uri: fotoPet.uri }}
                  style={{ width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: BRAND.blue }}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>{inicial}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.editBadge} onPress={() => navigation.navigate('MyPet')}>
                <Ionicons name="paw" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{nome}</Text>
              {email ? <Text style={styles.userEmail}>{email}</Text> : null}
              {fotoPet ? (
                <View style={styles.verifiedRow}>
                  <Ionicons name="heart" size={14} color={BRAND.blue} />
                  <Text style={[styles.verifiedText, { color: BRAND.blue }]}>Foto do {fotoPet.nome}</Text>
                </View>
              ) : perfil?.telefone ? (
                <View style={styles.verifiedRow}>
                  <Ionicons name="call-outline" size={14} color={BRAND.inkSoft} />
                  <Text style={[styles.verifiedText, { color: BRAND.inkSoft }]}>{perfil.telefone}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* Progresso do perfil */}
        <View style={[t.card, { backgroundColor: BRAND.navy, borderColor: BRAND.navy }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
            <Anel pct={progresso} size={98} espessura={10} cor="#3B82F6">
              <Text style={{ fontSize: 22, fontFamily: 'Nunito_800ExtraBold', color: '#fff' }}>
                {progresso}%
              </Text>
            </Anel>

            <View style={{ flex: 1, gap: 8 }}>
              <Text style={{ fontSize: 16, fontFamily: 'Nunito_800ExtraBold', color: '#fff' }}>
                {progresso === 100 ? 'Perfil completo!' : 'Perfil em construção'}
              </Text>

              {[
                ['Conta criada', true],
                ['Questionário respondido', !!respondeu],
                ['Pet adotado ou cadastrado', pets.length > 0],
              ].map(([texto, feito]) => (
                <View key={texto} style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                  <Ionicons
                    name={feito ? 'checkmark-circle' : 'ellipse-outline'}
                    size={15}
                    color={feito ? '#4ADE80' : 'rgba(255,255,255,0.45)'}
                  />
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 12.5,
                      fontFamily: 'Nunito_600SemiBold',
                      color: feito ? '#fff' : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {texto}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {proximoPasso ? (
            <TouchableOpacity
              style={[t.botao, { marginTop: 16 }]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate(proximoPasso.rota)}
            >
              <Text style={t.botaoTexto}>{proximoPasso.acao}</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Impacto real */}
        <Text style={styles.sectionLabel}>Seu impacto na Nima</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{String(pets.length).padStart(2, '0')}</Text>
            <Text style={styles.statLabel}>Pets</Text>
          </View>
          <View style={[styles.statBox, styles.statDivider]}>
            <Text style={styles.statNumber}>{String(totalFavoritos).padStart(2, '0')}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{respondeu ? '01' : '00'}</Text>
            <Text style={styles.statLabel}>Questionário</Text>
          </View>
        </View>

        {/* Favoritos */}
        <Text style={styles.sectionLabel}>Pets favoritados</Text>
        {favoritados.length === 0 ? (
          <View style={[t.card, { marginTop: 0 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="heart-outline" size={22} color={BRAND.inkSoft} />
              <View style={{ flex: 1 }}>
                <Text style={t.cardTitulo}>Nenhum favorito ainda</Text>
                <Text style={t.cardTexto}>
                  Toque no coração na ficha de um pet para guardá-lo aqui.
                  {totalFavoritos > favoritados.length
                    ? ' Alguns favoritos antigos já não estão disponíveis.'
                    : ''}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: PAD, gap: 12, marginTop: 4 }}
          >
            {favoritados.map((a) => {
              const foto = primeiraFoto(a);
              return (
                <TouchableOpacity
                  key={a.id}
                  style={{
                    width: 148,
                    backgroundColor: BRAND.card,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: BRAND.border,
                    overflow: 'hidden',
                  }}
                  activeOpacity={0.88}
                  onPress={() => navigation.navigate('PetDetails', { id: a.id })}
                >
                  {foto ? (
                    <Image source={{ uri: foto }} style={{ width: '100%', height: 100 }} />
                  ) : (
                    <View
                      style={{
                        width: '100%', height: 100, backgroundColor: '#E7EEFB',
                        alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Ionicons name="paw" size={26} color={BRAND.blue} />
                    </View>
                  )}
                  <View style={{ padding: 11 }}>
                    <Text style={{ fontSize: 15, fontFamily: 'Nunito_800ExtraBold', color: BRAND.ink }} numberOfLines={1}>
                      {a.nome}
                    </Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Nunito_400Regular', color: BRAND.inkSoft }} numberOfLines={1}>
                      {[a.raca, a.porte].filter(Boolean).join(' · ')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        <Text style={styles.sectionLabel}>Minha conta</Text>
        <View style={styles.menuSection}>
          {minhaConta.map((item, i) => (
            <MenuItem key={item.title} item={item} last={i === minhaConta.length - 1} />
          ))}
        </View>

        <Text style={styles.sectionLabel}>Descobrir</Text>
        <View style={styles.menuSection}>
          {descobrir.map((item, i) => (
            <MenuItem key={item.title} item={item} last={i === descobrir.length - 1} />
          ))}
        </View>

        <View style={styles.helpCard}>
          <View style={styles.helpIcon}>
            <Ionicons name="headset-outline" size={22} color={BRAND.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.helpTitle}>Precisa de ajuda?</Text>
            <Text style={styles.helpText}>Fale com o suporte da Nima.</Text>
          </View>
        </View>
      </ScrollView>

      <Navbar navigation={navigation} currentRoute="Profile" />
    </SafeAreaView>
  );
};

export default ProfileScreen;

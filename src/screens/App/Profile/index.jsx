import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './styles';
import Navbar from '../../components/NavBar/navbar';
import { BRAND } from '../../../theme';

const ProfileScreen = ({ navigation }) => {
  const [nome, setNome] = useState('Tutor Nima');
  const [email, setEmail] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const fullName = await AsyncStorage.getItem('@nima_user_name');
        const savedEmail = await AsyncStorage.getItem('@nima_email');
        if (fullName) setNome(fullName);
        if (savedEmail) setEmail(savedEmail);
      })();
    }, [])
  );

  // Logout de verdade: limpa a sessão antes de mandar pro Login.
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        '@nima_token',
        '@nima_user_role',
        '@nima_user_name',
        '@nima_remember_me',
        '@nima_profile_completed',
      ]);
    } catch (e) {
      // segue pro login de qualquer forma
    }
    navigation.replace('Login');
  };

  const inicial = (nome || 'T').trim().charAt(0).toUpperCase();

  const contaPrivacidade = [
    { title: 'Dados pessoais', sub: 'Nome, e-mail e telefone', icon: 'person-outline', color: BRAND.blue },
    { title: 'Notificações', sub: 'Alertas e comunicações', icon: 'notifications-outline', color: '#FF9500' },
    { title: 'Segurança', sub: 'Senha e autenticação', icon: 'shield-checkmark-outline', color: BRAND.success, badge: 'Protegida' },
    { title: 'Privacidade', sub: 'Controle dos seus dados', icon: 'lock-closed-outline', color: '#6B7280' },
  ];
  const preferencias = [
    { title: 'Interesses e afinidade', sub: 'Personalize suas recomendações', icon: 'heart-outline', color: BRAND.blue },
    { title: 'Aparência e acessibilidade', sub: 'Tema, fonte e contraste', icon: 'moon-outline', color: '#6B7280' },
  ];

  const MenuItem = ({ item, last }) => (
    <TouchableOpacity style={[styles.menuItem, last && styles.menuItemLast]} activeOpacity={0.7}>
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Meu perfil</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
            <Feather name="log-out" size={17} color={BRAND.danger} />
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Gerencie suas contas e suas preferências.</Text>

        {/* Card de perfil */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{inicial}</Text>
              </View>
              <TouchableOpacity style={styles.editBadge}>
                <Ionicons name="camera" size={15} color="#FFF" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{nome}</Text>
              {email ? <Text style={styles.userEmail}>{email}</Text> : null}
              <View style={styles.verifiedRow}>
                <Ionicons name="shield-checkmark" size={15} color={BRAND.success} />
                <Text style={styles.verifiedText}>Conta verificada</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.editProfileBtn} activeOpacity={0.85}>
            <Text style={styles.editProfileText}>Editar perfil</Text>
          </TouchableOpacity>

          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Perfil 80% completo</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '80%' }]} />
            </View>
            <TouchableOpacity><Text style={styles.progressLink}>Completar</Text></TouchableOpacity>
          </View>
        </View>

        {/* Impacto */}
        <Text style={styles.sectionLabel}>Seu impacto na Nima</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}><Text style={styles.statNumber}>02</Text><Text style={styles.statLabel}>Pets</Text></View>
          <View style={[styles.statBox, styles.statDivider]}><Text style={styles.statNumber}>15</Text><Text style={styles.statLabel}>Interesses</Text></View>
          <View style={styles.statBox}><Text style={styles.statNumber}>08</Text><Text style={styles.statLabel}>Apoios</Text></View>
        </View>

        {/* Conta e privacidade */}
        <Text style={styles.sectionLabel}>Conta e privacidade</Text>
        <View style={styles.menuSection}>
          {contaPrivacidade.map((item, i) => (
            <MenuItem key={item.title} item={item} last={i === contaPrivacidade.length - 1} />
          ))}
        </View>

        {/* Preferências */}
        <Text style={styles.sectionLabel}>Preferências</Text>
        <View style={styles.menuSection}>
          {preferencias.map((item, i) => (
            <MenuItem key={item.title} item={item} last={i === preferencias.length - 1} />
          ))}
        </View>

        {/* Ajuda */}
        <View style={styles.helpCard}>
          <View style={styles.helpIcon}>
            <Ionicons name="headset-outline" size={22} color={BRAND.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.helpTitle}>Precisa de ajuda?</Text>
            <Text style={styles.helpText}>Fale com o suporte da Nima.</Text>
          </View>
          <TouchableOpacity style={styles.helpBtn}>
            <Text style={styles.helpBtnText}>Central de ajuda</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Navbar navigation={navigation} currentRoute="Profile" />
    </SafeAreaView>
  );
};

export default ProfileScreen;

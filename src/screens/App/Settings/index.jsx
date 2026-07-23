import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Platform, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, Feather } from '@expo/vector-icons';
import { styles } from './styles';
import { BRAND } from '../../../theme';

const SettingsScreen = ({ navigation }) => {
  const [notifPush, setNotifPush] = React.useState(true);
  const [notifTag, setNotifTag] = React.useState(true);
  const [notifSaude, setNotifSaude] = React.useState(true);
  const [autoUpdate, setAutoUpdate] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  // Logout completo: sem isso o "Lembrar-me" reloga o usuário sozinho.
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        '@nima_token',
        '@nima_user_role',
        '@nima_user_name',
        '@nima_remember_me',
        '@nima_profile_completed',
      ]);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair da conta corretamente.');
    }
  };

  const secoes = [
    {
      title: 'Preferências',
      items: [
        { id: 'lang', title: 'Idioma', value: 'Português (BR)', icon: 'language-outline' },
        { id: 'theme', title: 'Tema escuro', sub: 'Aparência do aplicativo', type: 'switch', value: darkMode, setter: setDarkMode, icon: 'moon-outline' },
        { id: 'a11y', title: 'Acessibilidade', sub: 'Texto, contraste e movimento', icon: 'text-outline' },
      ],
    },
    {
      title: 'Notificações',
      items: [
        { id: 'push', title: 'Notificações push', sub: 'Novidades e atualizações', type: 'switch', value: notifPush, setter: setNotifPush, icon: 'notifications-outline' },
        { id: 'tag', title: 'Alertas da Patinha', sub: 'Quando alguém escaneia a tag do seu pet', type: 'switch', value: notifTag, setter: setNotifTag, icon: 'location-outline' },
        { id: 'saude', title: 'Lembretes de saúde', sub: 'Vacinas e consultas', type: 'switch', value: notifSaude, setter: setNotifSaude, icon: 'calendar-outline' },
      ],
    },
    {
      title: 'Aplicativo e armazenamento',
      items: [
        { id: 'perm', title: 'Permissões', sub: 'Localização, câmera e arquivos', icon: 'lock-closed-outline' },
        { id: 'cache', title: 'Limpar cache', sub: '128 MB armazenados', icon: 'server-outline', action: 'Limpar' },
        { id: 'auto', title: 'Atualização automática', sub: 'Manter o app sempre atualizado', type: 'switch', value: autoUpdate, setter: setAutoUpdate, icon: 'refresh-outline' },
      ],
    },
    {
      title: 'Privacidade e segurança',
      items: [
        { id: 'priv', title: 'Privacidade dos dados', sub: 'Gerencie o uso das suas informações', icon: 'lock-closed-outline' },
        { id: 'sec', title: 'Segurança da conta', sub: 'Senha e autenticação', icon: 'shield-checkmark-outline', badge: 'Protegida' },
      ],
    },
    {
      title: 'Sobre',
      items: [
        { id: 'version', title: 'Versão do app', value: '1.0.4 (Beta)', icon: 'information-circle-outline', badge: 'Atualizado' },
        { id: 'terms', title: 'Termos de uso', icon: 'document-text-outline' },
        { id: 'privacy', title: 'Política de privacidade', icon: 'reader-outline' },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={BRAND.blue} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configurações</Text>
          <Text style={styles.headerSub}>Personalize sua experiência na Nima.</Text>
        </View>

        {secoes.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionLabel}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, i) => (
                <View key={item.id}>
                  <TouchableOpacity style={styles.itemRow} disabled={item.type === 'switch'} activeOpacity={0.7}>
                    <View style={styles.itemLeft}>
                      <View style={styles.itemIcon}>
                        <Ionicons name={item.icon} size={19} color={BRAND.blue} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        {item.sub ? <Text style={styles.itemSub}>{item.sub}</Text> : null}
                      </View>
                    </View>

                    {item.type === 'switch' ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.setter}
                        trackColor={{ false: '#CBD5E1', true: BRAND.blue }}
                        thumbColor={Platform.OS === 'ios' ? '#FFF' : item.value ? '#FFF' : '#F4F3F4'}
                      />
                    ) : item.action ? (
                      <TouchableOpacity style={styles.pillBtn}>
                        <Text style={styles.pillBtnText}>{item.action}</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.itemRight}>
                        {item.value ? <Text style={styles.itemValue}>{item.value}</Text> : null}
                        {item.badge ? (
                          <View style={styles.okBadge}><Text style={styles.okBadgeText}>{item.badge}</Text></View>
                        ) : (
                          <Ionicons name="chevron-forward" size={18} color="#C7CFD9" />
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                  {i < section.items.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.helpCard}>
          <View style={styles.helpIcon}>
            <Ionicons name="headset-outline" size={22} color={BRAND.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.helpTitle}>Precisa de ajuda?</Text>
            <Text style={styles.helpText}>Acesse a Central de Ajuda da Nima.</Text>
          </View>
          <TouchableOpacity style={styles.pillBtn}>
            <Text style={styles.pillBtnText}>Abrir</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Feather name="log-out" size={20} color={BRAND.danger} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

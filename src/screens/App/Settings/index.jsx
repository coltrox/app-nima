import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Platform,
  Switch,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import necessário
import { Ionicons, Feather } from '@expo/vector-icons';
import { styles } from './styles';

const SettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  // FUNÇÃO DE LOGOUT CORRIGIDA
  const handleLogout = async () => {
    try {
      // Remove o token que mantém a sessão ativa (Persistência)
      await AsyncStorage.removeItem('@nima_token'); 
      
      // Opcional: Se você quiser que o app esqueça o email/senha do "Lembrar-me" 
      // ao sair manualmente, descomente as linhas abaixo:
      // await AsyncStorage.removeItem('@nima_email');
      // await AsyncStorage.removeItem('@nima_password');

      // Reseta a navegação para a tela de Login
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair da conta corretamente.');
      console.error('Erro ao limpar cache de login:', error);
    }
  };

  const settingSections = [
    {
      title: 'Preferências',
      items: [
        { id: 'lang', title: 'Idioma', value: 'Português (BR)', icon: 'language-outline' },
        { id: 'theme', title: 'Tema Escuro', type: 'switch', value: darkMode, setter: setDarkMode, icon: 'moon-outline' },
      ]
    },
    {
      title: 'Aplicativo',
      items: [
        { id: 'notif', title: 'Notificações Push', type: 'switch', value: notificationsEnabled, setter: setNotificationsEnabled, icon: 'notifications-active-outline' },
        { id: 'storage', title: 'Limpar Cache', icon: 'server-outline' },
      ]
    },
    {
      title: 'Sobre',
      items: [
        { id: 'version', title: 'Versão do App', value: '1.0.4 (Beta)', icon: 'information-circle-outline' },
        { id: 'terms', title: 'Termos de Uso', icon: 'document-text-outline' },
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#05082B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {settingSections.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.sectionLabel}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIdx) => (
                <View key={item.id}>
                  <TouchableOpacity 
                    style={styles.itemRow}
                    disabled={item.type === 'switch'}
                    activeOpacity={0.7}
                  >
                    <View style={styles.itemLeft}>
                      <Ionicons name={item.icon} size={22} color="#1D5CFF" />
                      <Text style={styles.itemTitle}>{item.title}</Text>
                    </View>

                    {item.type === 'switch' ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.setter}
                        trackColor={{ false: '#CBD5E1', true: '#1D5CFF' }}
                        thumbColor={Platform.OS === 'ios' ? '#FFF' : item.value ? '#FFF' : '#F4F3F4'}
                      />
                    ) : (
                      <View style={styles.itemRight}>
                        {item.value && <Text style={styles.itemValue}>{item.value}</Text>}
                        <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                      </View>
                    )}
                  </TouchableOpacity>
                  {itemIdx < section.items.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={handleLogout} // Chama a função que limpa o storage
        >
          <Feather name="log-out" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
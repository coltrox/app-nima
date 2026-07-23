import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { 
  useFonts, 
  Nunito_400Regular, 
  Nunito_600SemiBold, 
  Nunito_700Bold, 
  Nunito_800ExtraBold 
} from '@expo-google-fonts/nunito';
import styles from './styles';
import authService from '../authService';
import { BRAND } from '../../../theme';

// Cargos que só existem no painel web. O backend autentica os três, mas o app
// mobile é a superfície do tutor — ONG e desenvolvedor não têm tela aqui.
const CARGOS_SO_WEB = ['ong', 'desenvolvedor'];

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [popupConfig, setPopupConfig] = useState({ show: false, message: '', type: 'success' });

  const popupFade = useRef(new Animated.Value(0)).current;
  const popupSlide = useRef(new Animated.Value(10)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current; 

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    const checkPersistedLogin = async () => {
      try {
        const userToken = await AsyncStorage.getItem('@nima_token');
        const userRole = await AsyncStorage.getItem('@nima_user_role');
        const wasRemembered = await AsyncStorage.getItem('@nima_remember_me');
        const savedEmail = await AsyncStorage.getItem('@nima_email');

        await AsyncStorage.removeItem('@nima_password');

        // O app é só do tutor: sessão de ONG/dev que sobrou de antes não vale.
        if (userToken && wasRemembered === 'true' && !CARGOS_SO_WEB.includes(userRole)) {
          navigation.replace('Home');
          return;
        }
        if (CARGOS_SO_WEB.includes(userRole)) {
          await AsyncStorage.multiRemove(['@nima_token', '@nima_user_role', '@nima_user_name']);
        }

        if (savedEmail) {
          setEmail(savedEmail);
          setRememberMe(true);
        }
      } catch (e) {
        console.error('Erro na persistência', e);
      } finally {
        setIsLoading(false);
      }
    };
    checkPersistedLogin();
  }, []);

  useFocusEffect(
    ...[useCallback(() => {
      contentOpacity.setValue(1);
    }, [])]
  );

  const triggerPopup = (message, type = 'success') => {
    setPopupConfig({ show: true, message, type });
    Animated.parallel([
      Animated.timing(popupFade, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(popupSlide, { toValue: 0, friction: 8, useNativeDriver: true })
    ]).start();
    setTimeout(() => {
      Animated.timing(popupFade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setPopupConfig(prev => ({ ...prev, show: false }));
      });
    }, 3000);
  };

  const handleAuthNavigation = () => {
    Animated.timing(contentOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start(() => navigation.replace('Home'));
  };

  const handleSimpleNavigation = (routeName) => {
    navigation.navigate(routeName);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      triggerPopup('Preencha email e senha.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);

      // Trava de superfície: o app é do tutor. Uma conta de ONG ou de
      // desenvolvedor autentica com sucesso no backend, mas não tem nenhuma
      // tela aqui — todas as ações dela exigem o painel web. Melhor recusar com
      // explicação do que deixar entrar num app vazio.
      if (CARGOS_SO_WEB.includes(data.user?.cargo)) {
        triggerPopup(
          'Contas de ONG e de administração usam o painel web, não o aplicativo.',
          'error'
        );
        setIsLoading(false);
        return;
      }

      await AsyncStorage.setItem('@nima_token', data.token);
      await AsyncStorage.setItem('@nima_user_role', data.user.cargo);
      await AsyncStorage.setItem('@nima_remember_me', rememberMe ? 'true' : 'false');
      await AsyncStorage.setItem('@nima_user_name', data.user.nome || 'Usuário');

      // O login NÃO informa se o questionário foi respondido — quem sabe disso
      // é GET /auth/relatorio. Limpar a chave aqui força a Home a perguntar ao
      // backend em vez de confiar num flag da sessão anterior.
      await AsyncStorage.removeItem('@nima_profile_completed');

      // O e-mail é dado de exibição (aparece no Perfil), não credencial:
      // fica salvo independentemente do "lembrar-me". A senha nunca é salva.
      await AsyncStorage.setItem('@nima_email', email);

      handleAuthNavigation();
    } catch (error) {
      triggerPopup(String(error), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={BRAND.blue} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
          <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
            
            {/* Logo isolada sem legenda */}
            <View style={styles.logoContainer}>
              <Animated.View style={{ opacity: contentOpacity }}>
                <Image
                  source={require('../../../../assets/logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </Animated.View>
            </View>

            {/* Card Branco com o Formulário */}
            <Animated.View style={[styles.cardContainer, { opacity: contentOpacity }]}>
              <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
              <Text style={styles.subtitleText}>
                Gerencie suas contas e suas preferências.
              </Text>

              {/* Input Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>E-mail</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="#7F8C8D" style={styles.inputLeftIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="Pedro.coltro@gmail.com"
                    placeholderTextColor="#A0AEC0"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Input Senha */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Senha</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#7F8C8D" style={styles.inputLeftIcon} />
                  <TextInput
                    style={styles.inputField}
                    placeholder="••••••••••••••••"
                    placeholderTextColor="#A0AEC0"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#7F8C8D" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Lembrar-me & Esqueceu Senha */}
              <View style={styles.bottomInputRow}>
                <TouchableOpacity style={styles.rememberContainer} activeOpacity={0.7} onPress={() => setRememberMe(!rememberMe)}>
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                  <Text style={styles.rememberText}>Lembrar-me</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSimpleNavigation('ForgotPassword')}>
                  <Text style={styles.forgotText}>Esqueceu a senha?</Text>
                </TouchableOpacity>
              </View>

              {/* Botão Principal Entrar */}
              <TouchableOpacity style={styles.loginButton} activeOpacity={0.8} onPress={handleLogin} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <View style={styles.loginButtonContent}>
                    <Text style={styles.loginButtonText}>Entrar</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 8 }} />
                  </View>
                )}
              </TouchableOpacity>

              {/* Proteção de Dados */}
              <View style={styles.protectionRow}>
                <Ionicons name="shield-checkmark-outline" size={14} color="#7F8C8D" />
                <Text style={styles.protectionText}>Seus dados estão protegidos.</Text>
              </View>

              {/* Divisor */}
              <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.orText}>ou continue com</Text>
                <View style={styles.line} />
              </View>

              {/* Botões Sociais Lado a Lado */}
              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialButton} onPress={() => triggerPopup('Login com Google chega em breve!', 'success')}>
                  <Ionicons name="logo-google" size={18} color="#EA4335" />
                  <Text style={styles.socialText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton} onPress={() => triggerPopup('Login com Facebook chega em breve!', 'success')}>
                  <Ionicons name="logo-facebook" size={18} color="#1877F2" />
                  <Text style={styles.socialText}>Facebook</Text>
                </TouchableOpacity>
              </View>

              {/* Rodapé Cadastre-se */}
              <View style={styles.signupSection}>
                <Text style={styles.signupPrompt}>Ainda não tem uma conta?</Text>
                <TouchableOpacity style={styles.signupButton} onPress={() => handleSimpleNavigation('Register')}>
                  <Text style={styles.signupButtonText}>Criar conta</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Rodapé Termos e ícone de Pata */}
            <View style={styles.termsFooter}>
              <Text style={styles.termsText}>
                Ao continuar, você concorda com os{'\n'}
                <Text style={styles.termsLink}>Termos de Uso</Text> e a <Text style={styles.termsLink}>Política de Privacidade</Text>.
              </Text>
              <Ionicons name="paw-outline" size={24} color="#0056C6" style={{ marginTop: 12, opacity: 0.6 }} />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {popupConfig.show && (
        <Animated.View style={[styles.popupContainer, { opacity: popupFade, transform: [{ translateY: popupSlide }] }]}>
          <View style={[
            styles.popupContent, 
            { borderLeftColor: popupConfig.type === 'success' ? '#2ECC71' : '#E74C3C' }
          ]}>
            <Ionicons 
              name={popupConfig.type === 'success' ? "checkmark-circle" : "alert-circle"} 
              size={24} 
              color={popupConfig.type === 'success' ? "#2ECC71" : "#E74C3C"} 
            />
            <Text style={styles.popupText}>{popupConfig.message}</Text>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default LoginScreen;
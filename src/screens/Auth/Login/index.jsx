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

const { width, height } = Dimensions.get('window');

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
  const pawX = useRef(new Animated.Value(0)).current;
  const pawY = useRef(new Animated.Value(0)).current;
  const pawRotate = useRef(new Animated.Value(-10)).current;

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
        // Migração: versões antigas guardavam a senha em texto puro. Apaga se existir.
        await AsyncStorage.removeItem('@nima_password');

        if (userToken && wasRemembered === 'true') {
          if (userRole === 'admin') {
            navigation.replace('AdminDashboard');
          } else if (userRole === 'ong') {
            navigation.replace('OngDashboard');
          } else {
            navigation.replace('Home');
          }
          return; 
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
      pawX.setValue(0);
      pawY.setValue(0);
      pawRotate.setValue(-10);
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

  const handleAuthNavigation = (role) => {
    const targetX = width * 0.54; 
    const targetY = height * 0.05; 

    Animated.parallel([
      Animated.timing(contentOpacity, { toValue: 0, duration: 300, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(pawX, { toValue: targetX, duration: 500, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(pawY, { toValue: targetY, duration: 500, useNativeDriver: Platform.OS !== 'web' }),
      Animated.timing(pawRotate, { toValue: 25, duration: 500, useNativeDriver: Platform.OS !== 'web' }),
    ]).start(() => {
      if (role === 'admin') {
        navigation.replace('AdminDashboard');
      } else if (role === 'ong') {
        navigation.replace('OngDashboard');
      } else {
        navigation.replace('Home');
      }
    });
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

      // Persistindo os dados principais do login
      await AsyncStorage.setItem('@nima_token', data.token);
      await AsyncStorage.setItem('@nima_user_role', data.user.cargo);
      await AsyncStorage.setItem('@nima_remember_me', rememberMe ? 'true' : 'false');

      // CORREÇÃO: Salvando os dados necessários para a HomeScreen atualizar dinamicamente
      await AsyncStorage.setItem('@nima_user_name', data.user.nome || 'Usuário');
      await AsyncStorage.setItem('@nima_profile_completed', data.user.perfilCompleto ? 'true' : 'false');

      // "Lembrar-me" guarda só o e-mail — senha NUNCA vai pro AsyncStorage
      // (texto puro, legível por qualquer um com acesso ao aparelho).
      if (rememberMe) {
        await AsyncStorage.setItem('@nima_email', email);
      } else {
        await AsyncStorage.removeItem('@nima_email');
      }

      handleAuthNavigation(data.user.cargo);

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

  const pawRotateDeg = pawRotate.interpolate({
    inputRange: [-10, 25],
    outputRange: ['-10deg', '25deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
          <View style={{ flex: 1, width: '100%' }}>
            
            <View style={styles.logoContainer}>
              <Animated.View style={[styles.pawWrapper, { transform: [{ translateX: pawX }, { translateY: pawY }, { rotate: pawRotateDeg }] }]}>
                <Ionicons name="paw" size={width * 0.22} color={BRAND.blue} />
              </Animated.View>

              <Animated.View style={[styles.logoTextWrapper, { opacity: contentOpacity }]}>
                <Text style={styles.logoText}>N<Text style={{ fontWeight: 'normal' }}>ima</Text></Text>
                <View style={styles.dot} />
              </Animated.View>
            </View>

            <Animated.View style={[styles.formContainer, { opacity: contentOpacity }]}>
              <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
              <Text style={[styles.rememberText, { textAlign: 'center', marginTop: -12, marginBottom: 8 }]}>
                Gerencie suas contas e suas preferências.
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#7F8C8D"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                editable={!isLoading}
              />

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="Senha"
                  placeholderTextColor="#7F8C8D"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#5A6578" />
                </TouchableOpacity>
              </View>

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

              <TouchableOpacity style={styles.loginButton} activeOpacity={0.8} onPress={handleLogin} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.loginButtonText}>Entrar  →</Text>}
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
                <Ionicons name="shield-checkmark-outline" size={14} color={BRAND.inkSoft} />
                <Text style={styles.footerText}>Seus dados estão protegidos.</Text>
              </View>

              <View style={styles.divider}>
                <View style={styles.line} /><Text style={styles.orText}>OU</Text><View style={styles.line} />
              </View>

              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={20} color="#2D3748" />
                <Text style={styles.socialText}>Entrar com o Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={20} color="#2D3748" />
                <Text style={styles.socialText}>Entrar com o Facebook</Text>
              </TouchableOpacity>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Ainda não tem uma conta? </Text>
                <TouchableOpacity onPress={() => handleSimpleNavigation('Register')}>
                  <Text style={styles.signupText}>Cadastre-se</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
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
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
import { LinearGradient } from 'expo-linear-gradient';
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
        const savedPassword = await AsyncStorage.getItem('@nima_password');

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
          setPassword(savedPassword || '');
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

      await AsyncStorage.setItem('@nima_token', data.token);
      await AsyncStorage.setItem('@nima_user_role', data.user.cargo);
      await AsyncStorage.setItem('@nima_remember_me', rememberMe ? 'true' : 'false');

      if (rememberMe) {
        await AsyncStorage.setItem('@nima_email', email);
        await AsyncStorage.setItem('@nima_password', password);
      } else {
        await AsyncStorage.removeItem('@nima_email');
        await AsyncStorage.removeItem('@nima_password');
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
      <View style={{ flex: 1, backgroundColor: '#05082b', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  const pawRotateDeg = pawRotate.interpolate({
    inputRange: [-10, 25],
    outputRange: ['-10deg', '25deg'],
  });

  return (
    <LinearGradient colors={['#05082b', '#0a1550', '#0d2680', '#1a3fae']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
            <View style={{ flex: 1, width: '100%' }}>
              
              <View style={styles.logoContainer}>
                <Animated.View style={[styles.pawWrapper, { transform: [{ translateX: pawX }, { translateY: pawY }, { rotate: pawRotateDeg }] }]}>
                  <Ionicons name="paw" size={width * 0.22} color="#FFFFFF" />
                </Animated.View>

                <Animated.View style={{ opacity: contentOpacity, flexDirection: 'row', alignItems: 'baseline', paddingTop: 15 }}>
                  <Text style={styles.logoText}>N<Text style={{ fontWeight: 'normal' }}>ima</Text></Text>
                  <View style={styles.dot} />
                </Animated.View>
              </View>

              <Animated.View style={[styles.formContainer, { opacity: contentOpacity }]}>
                <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  editable={!isLoading}
                />

                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.inputWithIcon}
                    placeholder="Senha"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#9CA3AF" />
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
                  {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.loginButtonText}>Entrar</Text>}
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.line} /><Text style={styles.orText}>OU</Text><View style={styles.line} />
                </View>

                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-google" size={20} color="#DB4437" />
                  <Text style={styles.socialText}>Entrar com o Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-facebook" size={20} color="#1877F2" />
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
      </SafeAreaView>

      {popupConfig.show && (
        <Animated.View style={[styles.popupContainer, { opacity: popupFade, transform: [{ translateY: popupSlide }] }]}>
          <View style={[
            styles.popupContent, 
            { borderLeftColor: popupConfig.type === 'success' ? '#4ADE80' : '#EF4444' }
          ]}>
            <Ionicons 
              name={popupConfig.type === 'success' ? "checkmark-circle" : "alert-circle"} 
              size={24} 
              color={popupConfig.type === 'success' ? "#4ADE80" : "#EF4444"} 
            />
            <Text style={styles.popupText}>{popupConfig.message}</Text>
          </View>
        </Animated.View>
      )}
    </LinearGradient>
  );
};

export default LoginScreen;
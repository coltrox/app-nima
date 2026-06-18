import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import styles from './styles';
import authService from '../authService';

const { width, height } = Dimensions.get('window');

export default function ForgotPassword() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Configuração da Popup Customizada do Sistema
  const [popupConfig, setPopupConfig] = useState({ show: false, message: '', type: 'success' });
  const popupFade = useRef(new Animated.Value(0)).current;
  const popupSlide = useRef(new Animated.Value(10)).current;

  const PAW_X = width * 0.68;
  const PAW_Y = height * 0.12;
  const PAW_ROTATION = '25deg';

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current; 
  const pawFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(pawFadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
    ]).start();
  }, []);

  const triggerPopup = (message, type = 'success', shouldNavigate = false) => {
    setPopupConfig({ show: true, message, type });
    
    Animated.parallel([
      Animated.timing(popupFade, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(popupSlide, { toValue: 0, friction: 8, useNativeDriver: true })
    ]).start();

    setTimeout(() => {
      Animated.timing(popupFade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setPopupConfig(prev => ({ ...prev, show: false }));
        if (shouldNavigate) {
          navigation.navigate('VerifyCode', { email: email.trim().toLowerCase() });
        }
      });
    }, 3000);
  };

  const handleSendCode = async () => {
    const sanitizedEmail = email.trim().toLowerCase();

    if (!sanitizedEmail) {
      triggerPopup('Por favor, insira o seu endereço de e-mail.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      triggerPopup('Por favor, insira um formato de e-mail válido.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(sanitizedEmail);
      triggerPopup('Código enviado com sucesso para a sua caixa de entrada!', 'success', true);
    } catch (error) {
      console.error(`[FORGOT-PASSWORD] Erro: ${error}`);
      // Fallback seguro OWASP
      triggerPopup('O processo de recuperação foi iniciado. Verifique o seu e-mail.', 'success', true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient 
      colors={['#05082b', '#0a1550', '#0d2680', '#1a3fae']} 
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View 
          pointerEvents="none" 
          style={[styles.pawFixed, {
            top: PAW_Y,
            left: PAW_X, 
            opacity: pawFadeAnim,
            transform: [{ rotate: PAW_ROTATION }],
            zIndex: -1
          }]}
        >
          <Ionicons name="paw" size={width * 0.22} color="#FFFFFF" />
        </Animated.View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="always"
          >
            <View style={styles.mainContent}>
              
              <Animated.View style={{ opacity: fadeAnim, zIndex: 100, alignSelf: 'flex-start' }}>
                <TouchableOpacity 
                  style={styles.backBtn} 
                  onPress={() => navigation.goBack()}
                  disabled={isLoading}
                >
                  <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={{ 
                opacity: fadeAnim, 
                transform: [{ translateY: slideAnim }],
                marginTop: height * 0.05,
                zIndex: 200 
              }}>
                <Text style={[styles.titleLarge, { fontFamily: 'Nunito_800ExtraBold' }]}>
                  Esqueceu
                </Text>
                <Text style={[styles.titleLarge, { fontFamily: 'Nunito_800ExtraBold' }]}>
                  a senha?
                </Text>
                
                <Text style={[styles.descriptionLarge, { fontFamily: 'Nunito_400Regular' }]}>
                  Não se preocupe! Isso acontece. Por favor, insira o e-mail da sua conta.
                </Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.inputLarge, { fontFamily: 'Nunito_400Regular' }]}
                    placeholder="Insira seu Email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    editable={!isLoading}
                    autoFocus={Platform.OS === 'web'}
                  />
                  
                  <TouchableOpacity
                    style={styles.buttonLarge}
                    onPress={handleSendCode}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <Text style={[styles.buttonTextLarge, { fontFamily: 'Nunito_700Bold' }]}>
                        Receber código
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </Animated.View>

              <Animated.View style={[styles.footer, { opacity: fadeAnim, zIndex: 100, marginTop: 'auto', paddingTop: 40 }]}>
                <Text style={[styles.footerTextLarge, { fontFamily: 'Nunito_400Regular' }]}>
                  Lembrou da senha? 
                </Text>
                <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
                  <Text style={[styles.loginLinkLarge, { fontFamily: 'Nunito_700Bold' }]}>
                    {" "}Faça Login!
                  </Text>
                </TouchableOpacity>
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
            <Text style={[styles.popupText, { fontFamily: 'Nunito_700Bold' }]}>{popupConfig.message}</Text>
          </View>
        </Animated.View>
      )}
    </LinearGradient>
  );
}
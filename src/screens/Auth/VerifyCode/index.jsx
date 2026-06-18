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
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './styles';
import authService from '../authService';

const { width, height } = Dimensions.get('window');

export default function VerifyCode() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef([]);

  const email = route.params?.email;

  // Configuração da Popup Padrão do Sistema
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
    }, 3500);
  };

  const handleCodeChange = (text, index) => {
    // Permite que o usuário cole o código completo de 6 dígitos no primeiro input
    if (text.length > 1) {
      const cleanedText = text.replace(/[^0-9]/g, '').slice(0, 6);
      const newCode = [...code];
      for (let i = 0; i < 6; i++) {
        newCode[i] = cleanedText[i] || '';
      }
      setCode(newCode);
      
      const targetIndex = cleanedText.length === 6 ? 5 : cleanedText.length;
      inputs.current[targetIndex]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text !== '' && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length < 6) {
      triggerPopup('Por favor, insira o código de 6 dígitos completo.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await authService.verifyCode(email, verificationCode);
      navigation.navigate('ResetPassword', { email, code: verificationCode });
    } catch (error) {
      triggerPopup(typeof error === 'string' ? error : 'Código inválido ou expirado.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      triggerPopup('Novo código enviado com sucesso!', 'success');
    } catch (error) {
      triggerPopup('Erro ao reenviar o código. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#05082b', '#0a1550', '#0d2680', '#1a3fae']} style={styles.container}>
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
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          >
            <View style={styles.mainContent}>
              <Animated.View style={{ opacity: fadeAnim, zIndex: 10, alignSelf: 'flex-start' }}>
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
                zIndex: 20
              }}>
                <Text style={[styles.titleLarge, { fontFamily: 'Nunito_800ExtraBold' }]}>Verificação</Text>
                
                <Text style={[styles.descriptionLarge, { fontFamily: 'Nunito_400Regular' }]}>
                  Insira o código de 6 dígitos enviado para o seu e-mail.
                </Text>

                <View style={styles.otpContainer}>
                  {code.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(el) => (inputs.current[index] = el)}
                      style={[styles.otpInput, { fontFamily: 'Nunito_700Bold' }]}
                      maxLength={Platform.OS === 'web' ? 6 : 1}
                      keyboardType="number-pad"
                      onChangeText={(text) => handleCodeChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      value={digit}
                      editable={!isLoading}
                    />
                  ))}
                </View>

                <TouchableOpacity 
                  style={styles.buttonVerify} 
                  activeOpacity={0.8}
                  onPress={handleVerify}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={[styles.buttonTextVerify, { fontFamily: 'Nunito_700Bold' }]}>Verificar</Text>
                  )}
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={[styles.footer, { opacity: fadeAnim, marginTop: 'auto', paddingBottom: 20, zIndex: 10 }]}>
                <Text style={[styles.footerTextLarge, { fontFamily: 'Nunito_400Regular' }]}>
                  Não recebeu? 
                </Text>
                <TouchableOpacity onPress={handleResendCode} disabled={isLoading}>
                  <Text style={[styles.resendLink, { fontFamily: 'Nunito_700Bold' }]}> Reenvie.</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Componente de Popup do Sistema */}
      {popupConfig.show && (
        <Animated.View style={[styles.popupContainer, { opacity: popupFade, transform: [{ translateY: popupSlide }] }]}>
          <View style={[
            styles.popupContent, 
            { borderLeftColor: popupConfig.type === 'success' ? '#4ADE80' : '#EF4444' }
          ]}>
            <Ionicons 
              name={popupConfig.type === 'success' ? "checkmark-circle" : "alert-circle"} 
              size={24} 
              color={popupConfig.type === 'success' ? '#4ADE80' : '#EF4444'} 
            />
            <Text style={[styles.popupText, { fontFamily: 'Nunito_700Bold' }]}>{popupConfig.message}</Text>
          </View>
        </Animated.View>
      )}
    </LinearGradient>
  );
}
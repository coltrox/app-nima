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
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './styles';
import authService from '../authService';

const { width, height } = Dimensions.get('window');

export default function ResetPassword() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [popupConfig, setPopupConfig] = useState({ show: false, message: '', type: 'success' });

  const email = route.params?.email;
  const code = route.params?.code;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pawFadeAnim = useRef(new Animated.Value(0)).current;
  const popupFade = useRef(new Animated.Value(0)).current;
  const popupSlide = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(pawFadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
    ]).start();
  }, []);

  const triggerPopup = (message, type = 'success', callback = null) => {
    setPopupConfig({ show: true, message, type });
    
    Animated.parallel([
      Animated.timing(popupFade, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(popupSlide, { toValue: 0, friction: 8, useNativeDriver: true })
    ]).start();

    setTimeout(() => {
      Animated.timing(popupFade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setPopupConfig(prev => ({ ...prev, show: false }));
        if (callback) callback();
      });
    }, 3000);
  };

  const handleResetPassword = async () => {
    const pwr = password.trim();
    const conf = confirmPassword.trim();

    if (!pwr || !conf) {
      triggerPopup('Preencha todos os campos.', 'error');
      return;
    }

    if (pwr !== conf) {
      triggerPopup('As senhas não coincidem.', 'error');
      return;
    }

    // REGEX CORRIGIDO: Aceita qualquer caractere (inclusive os especiais como *), exigindo ao menos uma letra e um número
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(pwr)) {
      triggerPopup('A senha deve conter no mínimo 6 caracteres, incluindo letras e números.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(email, code, pwr);
      triggerPopup('Senha alterada com sucesso!', 'success', () => {
        navigation.navigate('Login');
      });
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || (typeof error === 'string' ? error : 'Erro ao alterar a senha.');
      triggerPopup(errorMsg, 'error');
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
            top: height * 0.12, 
            left: width * 0.68, 
            opacity: pawFadeAnim, 
            transform: [{ rotate: '25deg' }] 
          }]}
        >
          <Ionicons name="paw" size={width * 0.22} color="#FFFFFF" />
        </Animated.View>

        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          pointerEvents="box-none"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }} 
            showsVerticalScrollIndicator={false} 
            keyboardShouldPersistTaps="always"
            pointerEvents="box-none"
          >
            <View style={styles.mainContent} pointerEvents="box-none">
              <Animated.View style={{ opacity: fadeAnim, zIndex: 10 }}>
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
                <Text style={[styles.titleLarge, { fontFamily: 'Nunito_800ExtraBold' }]}>Nova senha</Text>
                
                <Text style={[styles.descriptionLarge, { fontFamily: 'Nunito_400Regular' }]}>
                  Crie uma senha nova. Por segurança, não utilize uma senha já usada anteriormente.
                </Text>

                <View style={styles.inputContainer} pointerEvents="box-none">
                  <View style={styles.passwordWrapper}>
                    <TextInput 
                      style={[styles.inputLargeWithIcon, { fontFamily: 'Nunito_400Regular' }]} 
                      placeholder="Nova Senha" 
                      placeholderTextColor="#9CA3AF" 
                      secureTextEntry={securePassword} 
                      value={password}
                      onChangeText={setPassword}
                      editable={!isLoading}
                    />
                    <TouchableOpacity 
                      style={styles.eyeIcon} 
                      onPress={() => setSecurePassword(!securePassword)}
                    >
                      <Ionicons name={securePassword ? "eye-off" : "eye"} size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.passwordWrapper}>
                    <TextInput 
                      style={[styles.inputLargeWithIcon, { fontFamily: 'Nunito_400Regular' }]} 
                      placeholder="Confirmar nova Senha" 
                      placeholderTextColor="#9CA3AF" 
                      secureTextEntry={secureConfirmPassword} 
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      editable={!isLoading}
                    />
                    <TouchableOpacity 
                      style={styles.eyeIcon} 
                      onPress={() => setSecureConfirmPassword(!secureConfirmPassword)}
                    >
                      <Ionicons name={secureConfirmPassword ? "eye-off" : "eye"} size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity 
                    style={styles.buttonLarge} 
                    activeOpacity={0.8} 
                    onPress={handleResetPassword}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <Text style={[styles.buttonTextLarge, { fontFamily: 'Nunito_700Bold' }]}>Alterar senha</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </Animated.View>

              <View style={{ flex: 1 }} pointerEvents="none" />

              <Animated.View style={[styles.footer, { opacity: fadeAnim, zIndex: 10, marginTop: 'auto' }]}>
                <Text style={[styles.footerTextLarge, { fontFamily: 'Nunito_400Regular' }]}>Precisa de ajuda? </Text>
                <TouchableOpacity disabled={isLoading}>
                  <Text style={[styles.loginLinkLarge, { fontFamily: 'Nunito_700Bold' }]}>Entre em Contato.</Text>
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
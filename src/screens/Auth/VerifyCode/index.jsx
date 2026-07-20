import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './styles';
import authService from '../authService';
import { BRAND } from '../../../theme';

export default function VerifyCode() {
  const navigation = useNavigation();
  const route = useRoute();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef([]);

  const email = route.params?.email;

  const [popupConfig, setPopupConfig] = useState({ show: false, message: '', type: 'success' });
  const popupFade = useRef(new Animated.Value(0)).current;
  const popupSlide = useRef(new Animated.Value(10)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const triggerPopup = (message, type = 'success') => {
    setPopupConfig({ show: true, message, type });
    Animated.parallel([
      Animated.timing(popupFade, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(popupSlide, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
    setTimeout(() => {
      Animated.timing(popupFade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setPopupConfig((prev) => ({ ...prev, show: false }));
      });
    }, 3500);
  };

  const handleCodeChange = (text, index) => {
    // Cola o código completo no primeiro campo
    if (text.length > 1) {
      const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
      const newCode = [...code];
      for (let i = 0; i < 6; i++) newCode[i] = cleaned[i] || '';
      setCode(newCode);
      const target = cleaned.length === 6 ? 5 : cleaned.length;
      inputs.current[target]?.focus();
      return;
    }
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text !== '' && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputs.current[index - 1]?.focus();
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} disabled={isLoading}>
              <Ionicons name="chevron-back" size={22} color={BRAND.blue} />
            </TouchableOpacity>
            <View style={styles.logoRow}>
              <Ionicons name="paw" size={22} color={BRAND.blue} />
              <Text style={styles.logoText}>Nima</Text>
            </View>
            <Text style={styles.stepLabel}>Etapa 2 de 3</Text>
          </View>

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <View style={styles.illustration}>
              <Ionicons name="shield-checkmark-outline" size={52} color={BRAND.blue} />
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>Verificação</Text>
              <Text style={styles.description}>
                Insira o código de 6 dígitos enviado para{' '}
                <Text style={styles.emailHint}>{email || 'seu e-mail'}</Text>.
              </Text>

              <View style={styles.otpContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(el) => (inputs.current[index] = el)}
                    style={[styles.otpInput, digit !== '' && styles.otpInputFilled]}
                    maxLength={Platform.OS === 'web' ? 6 : 1}
                    keyboardType="number-pad"
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    value={digit}
                    editable={!isLoading}
                  />
                ))}
              </View>

              <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleVerify} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Verificar  →</Text>}
              </TouchableOpacity>

              <View style={styles.expireNote}>
                <Ionicons name="time-outline" size={14} color={BRAND.inkSoft} />
                <Text style={styles.expireNoteText}>O código expira em 10 minutos.</Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Não recebeu?</Text>
              <TouchableOpacity onPress={handleResendCode} disabled={isLoading}>
                <Text style={styles.resendLink}> Reenviar código</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {popupConfig.show && (
        <Animated.View style={[styles.popupContainer, { opacity: popupFade, transform: [{ translateY: popupSlide }] }]}>
          <View style={[styles.popupContent, { borderLeftColor: popupConfig.type === 'success' ? '#2ECC71' : '#E74C3C' }]}>
            <Ionicons
              name={popupConfig.type === 'success' ? 'checkmark-circle' : 'alert-circle'}
              size={24}
              color={popupConfig.type === 'success' ? '#2ECC71' : '#E74C3C'}
            />
            <Text style={[styles.popupText, { fontFamily: 'Nunito_600SemiBold' }]}>{popupConfig.message}</Text>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

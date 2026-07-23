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
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import styles from './styles';
import authService from '../authService';
import { BRAND } from '../../../theme';

export default function ForgotPassword() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const triggerPopup = (message, type = 'success', shouldNavigate = false) => {
    setPopupConfig({ show: true, message, type });
    Animated.parallel([
      Animated.timing(popupFade, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(popupSlide, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      Animated.timing(popupFade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setPopupConfig((prev) => ({ ...prev, show: false }));
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
      triggerPopup('Código enviado! Verifique a sua caixa de entrada.', 'success', true);
    } catch (error) {
      // Fallback seguro (OWASP): não revela se o e-mail existe.
      triggerPopup('Se o e-mail existir, enviaremos um código. Verifique sua caixa.', 'success', true);
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
            <Logo height={24} />
            <Text style={styles.stepLabel}>Etapa 1 de 3</Text>
          </View>

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <View style={styles.illustration}>
              <Ionicons name="mail-outline" size={52} color={BRAND.blue} />
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>Esqueceu a senha?</Text>
              <Text style={styles.description}>
                Não se preocupe. Informe o e-mail da sua conta e enviaremos um código de verificação.
              </Text>

              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={19} color={BRAND.inkSoft} style={{ paddingLeft: 14 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu e-mail"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  editable={!isLoading}
                />
              </View>
              <Text style={styles.helper}>Use o mesmo e-mail cadastrado na Nima.</Text>

              <TouchableOpacity style={styles.button} onPress={handleSendCode} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Receber código  →</Text>}
              </TouchableOpacity>

              <View style={styles.expireNote}>
                <Ionicons name="shield-checkmark-outline" size={14} color={BRAND.inkSoft} />
                <Text style={styles.expireNoteText}>O código expira em 10 minutos.</Text>
              </View>

              <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={20} color={BRAND.blue} />
                <Text style={styles.infoText}>
                  Enviaremos um código de 6 dígitos. Verifique também a caixa de spam.
                </Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Lembrou da senha?</Text>
              <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
                <Text style={styles.backToLogin}>← Voltar para o login</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.support}>
              <Ionicons name="headset-outline" size={15} color={BRAND.inkSoft} />
              <Text style={styles.supportText}>
                Não consegue acessar o e-mail? <Text style={styles.supportLink}>Fale com o suporte.</Text>
              </Text>
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

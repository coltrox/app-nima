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

export default function ResetPassword() {
  const navigation = useNavigation();
  const route = useRoute();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [popupConfig, setPopupConfig] = useState({ show: false, message: '', type: 'success' });

  const email = route.params?.email;
  const code = route.params?.code;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const popupFade = useRef(new Animated.Value(0)).current;
  const popupSlide = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const triggerPopup = (message, type = 'success', callback = null) => {
    setPopupConfig({ show: true, message, type });
    Animated.parallel([
      Animated.timing(popupFade, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(popupSlide, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
    setTimeout(() => {
      Animated.timing(popupFade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setPopupConfig((prev) => ({ ...prev, show: false }));
        if (callback) callback();
      });
    }, 3000);
  };

  // Mesmos critérios do cadastro: 8 caracteres · 1 número · 1 letra maiúscula
  const criterios = {
    tamanho: password.length >= 8,
    numero: /\d/.test(password),
    maiuscula: /[A-Z]/.test(password),
  };
  const forca = Object.values(criterios).filter(Boolean).length;
  const forcaRotulo = ['', 'Fraca', 'Média', 'Forte'][forca];
  const forcaCor = ['#E4E7EC', '#E74C3C', BRAND.honey, BRAND.success][forca];

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
    if (forca < 3) {
      triggerPopup('A senha precisa de 8 caracteres, 1 número e 1 letra maiúscula.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(email, code, pwr);
      triggerPopup('Senha alterada com sucesso!', 'success', () => {
        navigation.navigate('Login');
      });
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || (typeof error === 'string' ? error : 'Erro ao alterar a senha.');
      triggerPopup(msg, 'error');
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
            <Text style={styles.stepLabel}>Etapa 3 de 3</Text>
          </View>

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <View style={styles.illustration}>
              <Ionicons name="lock-closed-outline" size={52} color={BRAND.blue} />
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>Nova senha</Text>
              <Text style={styles.description}>
                Crie uma senha nova. Por segurança, não reutilize uma senha usada anteriormente.
              </Text>

              <Text style={styles.label}>Nova senha</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={19} color={BRAND.inkSoft} style={{ paddingLeft: 14 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Digite a nova senha"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={securePassword}
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setSecurePassword(!securePassword)}>
                  <Ionicons name={securePassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={BRAND.inkSoft} />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Confirmar nova senha</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={19} color={BRAND.inkSoft} style={{ paddingLeft: 14 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Repita a nova senha"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={secureConfirm}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setSecureConfirm(!secureConfirm)}>
                  <Ionicons name={secureConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color={BRAND.inkSoft} />
                </TouchableOpacity>
              </View>

              {password.length > 0 && (
                <>
                  <View style={styles.strengthRow}>
                    {[1, 2, 3].map((n) => (
                      <View key={n} style={[styles.strengthBar, forca >= n && { backgroundColor: forcaCor }]} />
                    ))}
                  </View>
                  <Text style={[styles.strengthLabel, { color: forcaCor }]}>{forcaRotulo}</Text>
                </>
              )}

              <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleResetPassword} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Alterar senha  →</Text>}
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Precisa de ajuda?</Text>
              <TouchableOpacity disabled={isLoading}>
                <Text style={styles.supportLink}> Fale com o suporte.</Text>
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

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
import { styles } from './styles';
import authService from '../authService';
import { BRAND } from '../../../theme';

// Máscara visual 000.000.000-00 — o authService limpa antes de enviar.
const maskCpf = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3}\.\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3}\.\d{3}\.\d{3})(\d{1,2})$/, '$1-$2');
};

export default function Register({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [popupConfig, setPopupConfig] = useState({ show: false, message: '', type: 'success' });

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

  // Critérios do design: 8 caracteres · 1 número · 1 letra maiúscula
  const criterios = {
    tamanho: password.length >= 8,
    numero: /\d/.test(password),
    maiuscula: /[A-Z]/.test(password),
  };
  const forca = Object.values(criterios).filter(Boolean).length;
  const forcaRotulo = ['', 'Fraca', 'Média', 'Forte'][forca];
  const forcaCor = ['#E4E7EC', '#E74C3C', BRAND.honey, BRAND.success][forca];

  const handleRegister = async () => {
    const nomeCompleto = fullName.trim();
    const emailLimpo = email.trim();
    const cpfLimpo = cpf.trim();
    const pwr = password.trim();
    const conf = confirmPassword.trim();

    if (!nomeCompleto || !emailLimpo || !cpfLimpo || !pwr || !conf) {
      triggerPopup('Por favor, preencha todos os campos.', 'error');
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
    if (!acceptedTerms) {
      triggerPopup('Aceite os Termos de Uso para continuar.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({
        nome: nomeCompleto,
        email: emailLimpo,
        cpf: cpfLimpo,
        password: pwr,
      });

      triggerPopup('Conta criada com sucesso!', 'success', () => {
        navigation.navigate('Login');
      });
    } catch (errorMessage) {
      triggerPopup(String(errorMessage), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const Campo = ({ label, icon, children, helper }) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name={icon} size={19} color={BRAND.inkSoft} style={styles.inputIcon} />
        {children}
      </View>
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} disabled={isLoading}>
                <Ionicons name="chevron-back" size={24} color={BRAND.ink} />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="paw" size={22} color={BRAND.blue} />
                <Text style={styles.logoText}>Nima</Text>
              </View>
              <Text style={styles.topLabel}>Cadastro</Text>
            </View>
            <Text style={styles.slogan}>Encontros que viram lar.</Text>

            <View style={styles.card}>
              <Text style={styles.title}>Crie sua conta</Text>
              <Text style={styles.subtitle}>Comece uma nova história com a Nima</Text>

              <Campo label="Nome completo" icon="person-outline">
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu nome completo"
                  placeholderTextColor="#9CA3AF"
                  value={fullName}
                  onChangeText={setFullName}
                  editable={!isLoading}
                />
              </Campo>

              <Campo label="E-mail" icon="mail-outline">
                <TextInput
                  style={styles.input}
                  placeholder="seuemail@exemplo.com"
                  keyboardType="email-address"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  editable={!isLoading}
                />
              </Campo>

              <Campo label="CPF" icon="card-outline" helper="Usado para proteger adoções e doações.">
                <TextInput
                  style={styles.input}
                  placeholder="000.000.000-00"
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                  value={cpf}
                  onChangeText={(v) => setCpf(maskCpf(v))}
                  maxLength={14}
                  editable={!isLoading}
                />
              </Campo>

              <Campo label="Senha" icon="lock-closed-outline">
                <TextInput
                  style={styles.input}
                  placeholder="Crie uma senha forte"
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={BRAND.inkSoft} />
                </TouchableOpacity>
              </Campo>

              <Campo label="Confirmar senha" icon="lock-closed-outline">
                <TextInput
                  style={styles.input}
                  placeholder="Repita a senha"
                  secureTextEntry={!showConfirm}
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirm(!showConfirm)}>
                  <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color={BRAND.inkSoft} />
                </TouchableOpacity>
              </Campo>

              {password.length > 0 && (
                <>
                  <View style={styles.strengthRow}>
                    {[1, 2, 3].map((n) => (
                      <View key={n} style={[styles.strengthBar, forca >= n && { backgroundColor: forcaCor }]} />
                    ))}
                  </View>
                  <Text style={[styles.strengthLabel, { color: forcaCor }]}>{forcaRotulo}</Text>
                  <View style={styles.checksRow}>
                    {[
                      ['tamanho', '8 caracteres'],
                      ['numero', '1 número'],
                      ['maiuscula', '1 letra maiúscula'],
                    ].map(([chave, rotulo]) => (
                      <View key={chave} style={styles.checkItem}>
                        <Ionicons
                          name={criterios[chave] ? 'checkmark-circle' : 'ellipse-outline'}
                          size={15}
                          color={criterios[chave] ? BRAND.success : '#B9C2CE'}
                        />
                        <Text style={styles.checkText}>{rotulo}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}

              <TouchableOpacity
                style={styles.termsRow}
                activeOpacity={0.7}
                onPress={() => setAcceptedTerms(!acceptedTerms)}
                disabled={isLoading}
              >
                <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                  {acceptedTerms && <Ionicons name="checkmark" size={15} color="#fff" />}
                </View>
                <Text style={styles.termsText}>
                  Li e aceito os <Text style={styles.link}>Termos de Uso</Text> e a{' '}
                  <Text style={styles.link}>Política de Privacidade</Text>.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleRegister} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Criar conta  →</Text>}
              </TouchableOpacity>

              <View style={styles.secureNote}>
                <Ionicons name="shield-checkmark-outline" size={14} color={BRAND.inkSoft} />
                <Text style={styles.secureNoteText}>Seus dados são protegidos e criptografados.</Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Já possui uma conta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
                <Text style={styles.loginLink}>Entrar</Text>
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

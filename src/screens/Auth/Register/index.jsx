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
import Logo from '../../components/Logo';
// Renomeado no import: já existe um wrapper local chamado `Campo` neste arquivo.
import CampoTexto from '../../components/Campo';
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
              <Logo height={24} />
              <Text style={styles.topLabel}>Cadastro</Text>
            </View>
            <Text style={styles.slogan}>Encontros que viram lar.</Text>

            <View style={styles.card}>
              <Text style={styles.title}>Crie sua conta</Text>
              <Text style={styles.subtitle}>Comece uma nova história com a Nima</Text>

              {/* Campos padronizados do app: a borda fica no wrapper (não no
                  TextInput), altura mínima de toque e olho da senha com hitSlop. */}
              <CampoTexto
                rotulo="Nome completo"
                icone="person-outline"
                placeholder="Digite seu nome completo"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                textContentType="name"
                editable={!isLoading}
                containerStyle={{ marginBottom: 16 }}
              />

              <CampoTexto
                rotulo="E-mail"
                icone="mail-outline"
                placeholder="seuemail@exemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
                containerStyle={{ marginBottom: 16 }}
              />

              <CampoTexto
                rotulo="CPF"
                icone="card-outline"
                placeholder="000.000.000-00"
                keyboardType="numeric"
                value={cpf}
                onChangeText={(v) => setCpf(maskCpf(v))}
                maxLength={14}
                editable={!isLoading}
                containerStyle={{ marginBottom: 16 }}
              />

              <CampoTexto
                rotulo="Senha"
                icone="lock-closed-outline"
                placeholder="Crie uma senha forte"
                senha
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
                containerStyle={{ marginBottom: 16 }}
              />

              <CampoTexto
                rotulo="Confirmar senha"
                icone="lock-closed-outline"
                placeholder="Repita a senha"
                senha
                autoCapitalize="none"
                autoCorrect={false}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!isLoading}
                erro={
                  confirmPassword.length > 0 && confirmPassword !== password
                    ? 'As senhas não conferem.'
                    : undefined
                }
                containerStyle={{ marginBottom: 16 }}
              />

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

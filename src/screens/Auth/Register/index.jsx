import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  Animated, 
  Easing, 
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';
import authService from '../authService';

const { width, height } = Dimensions.get('window');

export default function Register({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Configuração alinhada com o padrão Nima
  const [popupConfig, setPopupConfig] = useState({ show: false, message: '', type: 'success' });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current; 
  const pawFadeAnim = useRef(new Animated.Value(0)).current;
  const popupFade = useRef(new Animated.Value(0)).current;
  const popupSlide = useRef(new Animated.Value(10)).current;

  const PAW_X = width * 0.68;
  const PAW_Y = height * 0.12;
  const PAW_ROTATION = '25deg';

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

    // Regra de validação: mínimo de 6 caracteres, contendo pelo menos uma letra e um número
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(pwr)) {
      triggerPopup('A senha deve conter no mínimo 6 caracteres, incluindo letras e números.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({ 
        nome: nomeCompleto, 
        email: emailLimpo, 
        cpf: cpfLimpo, 
        password: pwr 
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

  return (
    <LinearGradient colors={['#05082b', '#0a1550', '#0d2680', '#1a3fae']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1 }} pointerEvents="box-none">
                
                <Animated.View 
                  pointerEvents="none" 
                  style={[styles.pawFixed, {
                    top: PAW_Y,
                    left: PAW_X,
                    opacity: pawFadeAnim,
                    transform: [{ rotate: PAW_ROTATION }]
                  }]}
                >
                  <Ionicons name="paw" size={width * 0.22} color="#FFFFFF" />
                </Animated.View>

                <Animated.View style={{ opacity: fadeAnim, paddingHorizontal: 20, marginTop: 20 }}>
                  <TouchableOpacity 
                    style={styles.backBtn} 
                    onPress={() => navigation.goBack()}
                    disabled={isLoading}
                  >
                    <Ionicons name="chevron-back" size={24} color="#000" />
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View style={[styles.animatedContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                  <View style={styles.headerContainer}>
                    <Text style={[styles.titleLarge, { fontFamily: 'Nunito_800ExtraBold' }]}>Olá! Cadastre-se</Text>
                    <Text style={[styles.titleLarge, { fontFamily: 'Nunito_800ExtraBold' }]}>para começar</Text>
                  </View>

                  <View style={styles.form}>
                    <TextInput 
                      style={styles.inputLarge} 
                      placeholder="Nome Completo" 
                      placeholderTextColor="#9CA3AF" 
                      value={fullName}
                      onChangeText={setFullName}
                      editable={!isLoading}
                    />
                    <TextInput 
                      style={styles.inputLarge} 
                      placeholder="Email" 
                      keyboardType="email-address" 
                      placeholderTextColor="#9CA3AF" 
                      autoCapitalize="none" 
                      value={email}
                      onChangeText={setEmail}
                      editable={!isLoading}
                    />
                    <TextInput 
                      style={styles.inputLarge} 
                      placeholder="CPF" 
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF" 
                      value={cpf}
                      onChangeText={setCpf}
                      maxLength={14}
                      editable={!isLoading}
                    />
                    <TextInput 
                      style={styles.inputLarge} 
                      placeholder="Senha" 
                      secureTextEntry 
                      placeholderTextColor="#9CA3AF" 
                      value={password}
                      onChangeText={setPassword}
                      editable={!isLoading}
                    />
                    <TextInput 
                      style={styles.inputLarge} 
                      placeholder="Confirmar Senha" 
                      secureTextEntry 
                      placeholderTextColor="#9CA3AF" 
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      editable={!isLoading}
                    />
                    
                    <TouchableOpacity 
                      style={styles.buttonDark} 
                      activeOpacity={0.8} 
                      onPress={handleRegister}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#FFF" />
                      ) : (
                        <Text style={[styles.buttonTextLarge, { fontFamily: 'Nunito_700Bold' }]}>Registrar</Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={styles.footer}>
                    <Text style={[styles.footerText, { fontFamily: 'Nunito_400Regular' }]}>Lembrou da senha? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
                      <Text style={[styles.loginLinkLarge, { fontFamily: 'Nunito_700Bold' }]}>Faça Login!</Text>
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
            <Text style={[styles.popupText, { fontFamily: 'Nunito_700Bold' }]}>{popupConfig.message}</Text>
          </View>
        </Animated.View>
      )}
    </LinearGradient>
  );
}
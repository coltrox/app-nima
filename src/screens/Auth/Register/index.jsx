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
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { styles } from './styles';
import authService from '../authService';

const { width, height } = Dimensions.get('window');

export default function Register({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

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

  const triggerPopup = (message, success = false) => {
    setPopupMsg(message);
    setIsSuccess(success);
    setShowPopup(true);

    Animated.parallel([
      Animated.timing(popupFade, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(popupSlide, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(popupFade, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(popupSlide, { toValue: 10, duration: 300, useNativeDriver: true })
      ]).start(() => {
        setShowPopup(false);
        if (success) navigation.navigate('Login');
      });
    }, 3000);
  };

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      triggerPopup('Por favor, preencha todos os campos.', false);
      return;
    }
    if (password !== confirmPassword) {
      triggerPopup('As senhas não coincidem.', false);
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({ username, email, password });
      triggerPopup('Conta criada com sucesso!', true);
    } catch (error) {
      triggerPopup(String(error), false);
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
            {/* pointerEvents="box-none" permite clicar nos filhos mesmo com o Touchable em volta */}
            <View style={{ flex: 1 }} pointerEvents="box-none">
                
                {/* A PATA AGORA IGNORA CLIQUES E NÃO BLOQUEIA O FUNDO */}
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
                      placeholder="Nome de Usuário" 
                      placeholderTextColor="#9CA3AF" 
                      autoCapitalize="none" 
                      value={username}
                      onChangeText={setUsername}
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

                  <View style={styles.dividerContainer}>
                    <View style={styles.line} />
                    <Text style={[styles.dividerText, { fontFamily: 'Nunito_600SemiBold' }]}>Ou registre com</Text>
                    <View style={styles.line} />
                  </View>

                  <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialSquare} disabled={isLoading}><FontAwesome5 name="facebook-f" size={22} color="#1877F2" /></TouchableOpacity>
                    <TouchableOpacity style={styles.socialSquare} disabled={isLoading}><FontAwesome5 name="google" size={22} color="#DB4437" /></TouchableOpacity>
                    <TouchableOpacity style={styles.socialSquare} disabled={isLoading}><FontAwesome5 name="apple" size={22} color="black" /></TouchableOpacity>
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

      {showPopup && (
        <Animated.View style={[styles.popupContainer, { opacity: popupFade, transform: [{ translateY: popupSlide }] }]}>
          <View style={styles.popupContent}>
            <Ionicons 
              name={isSuccess ? "checkmark-circle" : "alert-circle"} 
              size={24} 
              color={isSuccess ? "#4ADE80" : "#F87171"} 
            />
            <Text style={[styles.popupText, { fontFamily: 'Nunito_700Bold' }]}>{popupMsg}</Text>
          </View>
        </Animated.View>
      )}
    </LinearGradient>
  );
}
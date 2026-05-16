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
  Keyboard,
  ScrollView,
  ActivityIndicator,
  Alert
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
  
  // 1. Alterado para 6 posições
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef([]);

  const email = route.params?.email;

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

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // 2. Lógica de foco para 6 campos
    if (text !== '' && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    
    // 3. Verificação de 6 dígitos
    if (verificationCode.length < 6) {
      Alert.alert('Erro', 'Por favor, insira o código de 6 dígitos.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.verifyCode(email, verificationCode);
      navigation.navigate('ResetPassword', { email, code: verificationCode });
    } catch (error) {
      Alert.alert('Código Inválido', error);
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
                <Text style={[styles.titleLarge, { fontFamily: 'Nunito_800ExtraBold' }]}>Verificação</Text>
                
                <Text style={[styles.descriptionLarge, { fontFamily: 'Nunito_400Regular' }]}>
                  Insira o código de 6 dígitos enviado para o seu e-mail.
                </Text>

                <View style={styles.otpContainer} pointerEvents="box-none">
                  {code.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(el) => (inputs.current[index] = el)}
                      style={[styles.otpInput, { fontFamily: 'Nunito_700Bold' }]}
                      maxLength={1}
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

              <View style={{ flex: 1 }} pointerEvents="none" />

              <Animated.View style={[styles.footer, { opacity: fadeAnim, paddingBottom: 20, zIndex: 10 }]}>
                <Text style={[styles.footerTextLarge, { fontFamily: 'Nunito_400Regular' }]}>
                  Não recebeu? 
                </Text>
                <TouchableOpacity onPress={() => {}} disabled={isLoading}>
                  <Text style={[styles.resendLink, { fontFamily: 'Nunito_700Bold' }]}> Reenvie.</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
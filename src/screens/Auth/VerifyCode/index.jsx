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
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

const { width, height } = Dimensions.get('window');

export default function VerifyCode() {
  const navigation = useNavigation();
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = useRef([]);

  // Configurações da Pata (Mesma posição do Forgot/Register para consistência)
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

    // Move para o próximo input automaticamente
    if (text !== '' && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Move para o anterior ao apagar
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <LinearGradient colors={['#05082b', '#0a1550', '#0d2680', '#1a3fae']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ flex: 1 }}>
                
                {/* PATA BACKGROUND */}
                <Animated.View style={[styles.pawFixed, {
                  top: PAW_Y,
                  left: PAW_X,
                  opacity: pawFadeAnim,
                  transform: [{ rotate: PAW_ROTATION }]
                }]}>
                  <Ionicons name="paw" size={width * 0.22} color="#FFFFFF" />
                </Animated.View>

                <View style={styles.mainContent}>
                  {/* Botão Voltar */}
                  <Animated.View style={{ opacity: fadeAnim }}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                      <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>
                  </Animated.View>

                  {/* Títulos e Descrição */}
                  <Animated.View style={{ 
                    opacity: fadeAnim, 
                    transform: [{ translateY: slideAnim }],
                    marginTop: height * 0.05 
                  }}>
                    <Text style={[styles.titleLarge, { fontFamily: 'Nunito_800ExtraBold' }]}>Verificação em</Text>
                    <Text style={[styles.titleLarge, { fontFamily: 'Nunito_800ExtraBold' }]}>duas etapas</Text>
                    
                    <Text style={[styles.descriptionLarge, { fontFamily: 'Nunito_400Regular' }]}>
                      Insira o código de verificação que acabamos de enviar para o seu endereço de e-mail.
                    </Text>

                    {/* Container dos Quadrados de Código */}
                    <View style={styles.otpContainer}>
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
                        />
                      ))}
                    </View>

                    <TouchableOpacity style={styles.buttonVerify} activeOpacity={0.8}>
                      <Text style={[styles.buttonTextVerify, { fontFamily: 'Nunito_700Bold' }]}>Verificar</Text>
                    </TouchableOpacity>
                  </Animated.View>

                  <View style={{ flex: 1 }} />

                  {/* Footer Reenviar */}
                  <Animated.View style={[styles.footer, { opacity: fadeAnim, paddingBottom: 20 }]}>
                    <Text style={[styles.footerTextLarge, { fontFamily: 'Nunito_400Regular' }]}>
                      Não recebeu o código? 
                    </Text>
                    <TouchableOpacity onPress={() => {}}>
                      <Text style={[styles.resendLink, { fontFamily: 'Nunito_700Bold' }]}> Reenvie.</Text>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
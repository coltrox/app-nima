import React, { useEffect, useRef } from 'react';
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
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import styles from './styles';

const { width, height } = Dimensions.get('window');

export default function ForgotPassword() {
  const navigation = useNavigation();

  const PAW_X = width * 0.68;
  const PAW_Y = height * 0.12;
  const PAW_ROTATION = '25deg';

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current; 
  const pawFadeAnim = useRef(new Animated.Value(0)).current; // Nova animação para a pata

  useEffect(() => {
    Animated.parallel([
      // Fade do conteúdo principal
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800, 
        useNativeDriver: true,
      }),
      // Deslize para cima do conteúdo
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900, 
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Fade suave da pata para não "piscar" na tela
      Animated.timing(pawFadeAnim, {
        toValue: 1,
        duration: 1000, 
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <LinearGradient 
        colors={['#05082b', '#0a1550', '#0d2680', '#1a3fae']} 
        style={styles.container}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* PATA BACKGROUND - Agora com opacidade animada */}
            <Animated.View style={[styles.pawFixed, {
              top: PAW_Y,
              left: PAW_X, 
              opacity: pawFadeAnim, // Aplica o fade aqui
              transform: [{ rotate: PAW_ROTATION }]
            }]}>
              <Ionicons name="paw" size={width * 0.22} color="#FFFFFF" />
            </Animated.View>

            <View style={styles.mainContent}>
              {/* Cabeçalho */}
              <Animated.View style={{ opacity: fadeAnim }}>
                <TouchableOpacity 
                  style={styles.backBtn} 
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
              </Animated.View>

              {/* Conteúdo */}
              <Animated.View style={{ 
                opacity: fadeAnim, 
                transform: [{ translateY: slideAnim }],
                marginTop: height * 0.05 
              }}>
                <Text style={[styles.titleLarge, { fontFamily: 'Nunito_800ExtraBold' }]}>
                  Esqueceu
                </Text>
                <Text style={[styles.titleLarge, { fontFamily: 'Nunito_800ExtraBold' }]}>
                  a senha?
                </Text>
                
                <Text style={[styles.descriptionLarge, { fontFamily: 'Nunito_400Regular' }]}>
                  Não se preocupe! Isso acontece. Por favor, insira o e-mail da sua conta.
                </Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.inputLarge, { fontFamily: 'Nunito_400Regular' }]}
                    placeholder="Insira seu Email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  
                  <TouchableOpacity
                    style={styles.buttonLarge}
                    onPress={() => navigation.navigate('VerifyCode')}
                  >
                    <Text style={[styles.buttonTextLarge, { fontFamily: 'Nunito_700Bold' }]}>
                      Receber código
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>

              <View style={{ flex: 1 }} /> 
              
              {/* Footer */}
              <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                <Text style={[styles.footerTextLarge, { fontFamily: 'Nunito_400Regular' }]}>
                  Lembrou da senha? 
                </Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={[styles.loginLinkLarge, { fontFamily: 'Nunito_700Bold' }]}>
                    {" "}Faça Login!
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
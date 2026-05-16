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
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import styles from './styles';
import authService from '../authService';

const { width, height } = Dimensions.get('window');

export default function ForgotPassword() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const PAW_X = width * 0.68;
  const PAW_Y = height * 0.12;
  const PAW_ROTATION = '25deg';

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current; 
  const pawFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800, 
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900, 
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(pawFadeAnim, {
        toValue: 1,
        duration: 1000, 
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira o seu e-mail.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      navigation.navigate('VerifyCode', { email });
    } catch (error) {
      Alert.alert('Erro', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient 
      colors={['#05082b', '#0a1550', '#0d2680', '#1a3fae']} 
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Camada da Pata: zIndex negativo e pointerEvents none para não bloquear NADA */}
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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          pointerEvents="box-none"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="always"
            pointerEvents="box-none"
          >
            <View style={styles.mainContent} pointerEvents="box-none">
              
              <Animated.View style={{ opacity: fadeAnim, zIndex: 100 }}>
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
                zIndex: 200 
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

                <View style={styles.inputContainer} pointerEvents="box-none">
                  <TextInput
                    style={[styles.inputLarge, { fontFamily: 'Nunito_400Regular' }]}
                    placeholder="Insira seu Email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    editable={!isLoading}
                    autoFocus={Platform.OS === 'web'} // Ajuda na captura inicial do clique na web
                  />
                  
                  <TouchableOpacity
                    style={styles.buttonLarge}
                    onPress={handleSendCode}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <Text style={[styles.buttonTextLarge, { fontFamily: 'Nunito_700Bold' }]}>
                        Receber código
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </Animated.View>

              <View style={{ flex: 1 }} pointerEvents="none" /> 
              
              <Animated.View style={[styles.footer, { opacity: fadeAnim, zIndex: 100 }]}>
                <Text style={[styles.footerTextLarge, { fontFamily: 'Nunito_400Regular' }]}>
                  Lembrou da senha? 
                </Text>
                <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
                  <Text style={[styles.loginLinkLarge, { fontFamily: 'Nunito_700Bold' }]}>
                    {" "}Faça Login!
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
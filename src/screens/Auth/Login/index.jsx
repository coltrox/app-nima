import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { 
  useFonts, 
  Nunito_400Regular, 
  Nunito_600SemiBold, 
  Nunito_700Bold, 
  Nunito_800ExtraBold 
} from '@expo-google-fonts/nunito';

import styles from './styles';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const contentOpacity = useRef(new Animated.Value(1)).current; 
  const pawX = useRef(new Animated.Value(0)).current;
  const pawY = useRef(new Animated.Value(0)).current;
  const pawRotate = useRef(new Animated.Value(-10)).current;

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useFocusEffect(
    useCallback(() => {
      contentOpacity.setValue(1);
      pawX.setValue(0);
      pawY.setValue(0);
      pawRotate.setValue(-10);
    }, [])
  );

  if (!fontsLoaded) return null;

  const handleNavigation = (routeName) => {
    const targetX = width * 0.53; 
    const targetY = height * 0.04; 

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(pawX, {
        toValue: targetX,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(pawY, {
        toValue: targetY,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(pawRotate, {
        toValue: 25, 
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate(routeName);
    });
  };

  const pawRotateDeg = pawRotate.interpolate({
    inputRange: [-10, 25],
    outputRange: ['-10deg', '25deg'],
  });

  return (
    <LinearGradient
      colors={['#05082b', '#0a1550', '#0d2680', '#1a3fae']}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* 
            IMPORTANTE: 
            1. keyboardShouldPersistTaps="handled" permite que o toque passe para o ScrollView 
            2. TouchableWithoutFeedback dentro do ScrollView para fechar o teclado sem travar a rolagem
          */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled" 
            alwaysBounceVertical={false}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ flex: 1, width: '100%' }}>
                
                <View style={styles.logoContainer}>
                  <Animated.View style={[styles.pawWrapper, {
                    transform: [
                      { translateX: pawX },
                      { translateY: pawY },
                      { rotate: pawRotateDeg },
                    ],
                  }]}>
                    <Ionicons name="paw" size={width * 0.22} color="#FFFFFF" />
                  </Animated.View>

                  <Animated.View style={{ 
                    opacity: contentOpacity, 
                    flexDirection: 'row', 
                    alignItems: 'baseline',
                    paddingTop: 15 
                  }}>
                    <Text style={[styles.logoText, { fontFamily: 'Nunito_800ExtraBold' }]}>
                      N<Text style={{ fontWeight: 'normal' }}>ima</Text>
                    </Text>
                    <View style={styles.dot} />
                  </Animated.View>
                </View>

                <Animated.View style={{ opacity: contentOpacity, gap: height * 0.02 }}>
                  <Text style={[styles.welcomeText, { fontFamily: 'Nunito_600SemiBold' }]}>
                    Bem-vindo de volta!
                  </Text>

                  <TextInput
                    style={[styles.input, { fontFamily: 'Nunito_400Regular' }]}
                    placeholder="Email ou Nome de Usuário"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                  />

                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.inputWithIcon, { fontFamily: 'Nunito_400Regular' }]}
                      placeholder="Senha"
                      placeholderTextColor="#9CA3AF"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.bottomInputRow}>
                    <TouchableOpacity
                      style={styles.rememberContainer}
                      onPress={() => setRememberMe(!rememberMe)}
                    >
                      <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                        {rememberMe && <Ionicons name="checkmark" size={14} color="#fff" />}
                      </View>
                      <Text style={[styles.rememberText, { fontFamily: 'Nunito_400Regular' }]}>Lembrar-me</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleNavigation('ForgotPassword')}>
                      <Text style={[styles.forgotText, { fontFamily: 'Nunito_600SemiBold' }]}>Esqueceu a senha?</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.loginButton} activeOpacity={0.8}>
                    <Text style={[styles.loginButtonText, { fontFamily: 'Nunito_700Bold' }]}>Entrar</Text>
                  </TouchableOpacity>

                  <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={[styles.orText, { fontFamily: 'Nunito_600SemiBold' }]}>OU</Text>
                    <View style={styles.line} />
                  </View>

                  <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-google" size={20} color="#DB4437" />
                    <Text style={[styles.socialText, { fontFamily: 'Nunito_600SemiBold' }]}>Entrar com o Google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                    <Text style={[styles.socialText, { fontFamily: 'Nunito_600SemiBold' }]}>Entrar com o Facebook</Text>
                  </TouchableOpacity>

                  <View style={styles.footerRow}>
                    <Text style={[styles.footerText, { fontFamily: 'Nunito_400Regular' }]}>Ainda não tem uma conta? </Text>
                    <TouchableOpacity onPress={() => handleNavigation('Register')}>
                      <Text style={[styles.signupText, { fontFamily: 'Nunito_700Bold' }]}>Cadastre-se</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;
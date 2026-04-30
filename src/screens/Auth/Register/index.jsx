import React, { useEffect, useRef } from 'react';
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
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

export default function Register({ navigation }) {
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ flex: 1 }}>
                
                <Animated.View style={[styles.pawFixed, {
                  top: PAW_Y,
                  left: PAW_X,
                  opacity: pawFadeAnim,
                  transform: [{ rotate: PAW_ROTATION }]
                }]}>
                  <Ionicons name="paw" size={width * 0.22} color="#FFFFFF" />
                </Animated.View>

                <Animated.View style={{ opacity: fadeAnim, paddingHorizontal: 20, marginTop: 20 }}>
                  <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={22} color="#1E232C" />
                  </TouchableOpacity>
                </Animated.View>

                <Animated.View style={[styles.animatedContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                  <View style={styles.headerContainer}>
                    <Text style={[styles.titleLarge, { fontFamily: 'Nunito_800ExtraBold' }]}>Olá! Cadastre-se</Text>
                    <Text style={[styles.titleLarge, { fontFamily: 'Nunito_800ExtraBold' }]}>para começar</Text>
                  </View>

                  <View style={styles.form}>
                    <TextInput style={styles.inputLarge} placeholder="Nome de Usuário" placeholderTextColor="#9CA3AF" autoCapitalize="none" />
                    <TextInput style={styles.inputLarge} placeholder="Email" keyboardType="email-address" placeholderTextColor="#9CA3AF" autoCapitalize="none" />
                    <TextInput style={styles.inputLarge} placeholder="Senha" secureTextEntry placeholderTextColor="#9CA3AF" />
                    <TextInput style={styles.inputLarge} placeholder="Confirmar Senha" secureTextEntry placeholderTextColor="#9CA3AF" />
                    <TouchableOpacity style={styles.buttonDark} activeOpacity={0.8}><Text style={[styles.buttonTextLarge, { fontFamily: 'Nunito_700Bold' }]}>Registrar</Text></TouchableOpacity>
                  </View>

                  <View style={styles.dividerContainer}>
                    <View style={styles.line} /><Text style={[styles.dividerText, { fontFamily: 'Nunito_600SemiBold' }]}>Ou registre com</Text><View style={styles.line} />
                  </View>

                  <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialSquare}><FontAwesome5 name="facebook-f" size={22} color="#1877F2" /></TouchableOpacity>
                    <TouchableOpacity style={styles.socialSquare}><FontAwesome5 name="google" size={22} color="#DB4437" /></TouchableOpacity>
                    <TouchableOpacity style={styles.socialSquare}><FontAwesome5 name="apple" size={22} color="black" /></TouchableOpacity>
                  </View>

                  <View style={styles.footer}>
                    <Text style={[styles.footerText, { fontFamily: 'Nunito_400Regular' }]}>Lembrou da senha? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                      <Text style={[styles.loginLinkLarge, { fontFamily: 'Nunito_700Bold' }]}>Faça Login!</Text>
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
}
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

export default function ResetPassword() {
  const navigation = useNavigation();
  const [showPopup, setShowPopup] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pawFadeAnim = useRef(new Animated.Value(0)).current;
  const popupFade = useRef(new Animated.Value(0)).current;
  const popupSlide = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(pawFadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleResetPassword = () => {
    setShowPopup(true);
    Animated.parallel([
      Animated.timing(popupFade, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(popupSlide, { toValue: 0, friction: 8, useNativeDriver: true })
    ]).start();

    setTimeout(() => {
      Animated.timing(popupFade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setShowPopup(false);
        navigation.navigate('Login');
      });
    }, 3000);
  };

  return (
    <LinearGradient colors={['#05082b', '#0a1550', '#0d2680', '#1a3fae']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ flex: 1 }}>
                
                <Animated.View style={[styles.pawFixed, { top: height * 0.12, left: width * 0.68, opacity: pawFadeAnim, transform: [{ rotate: '25deg' }] }]}>
                  <Ionicons name="paw" size={width * 0.22} color="#FFFFFF" />
                </Animated.View>

                <View style={styles.mainContent}>
                  <Animated.View style={{ opacity: fadeAnim }}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                      <Ionicons name="chevron-back" size={24} color="#000" />
                    </TouchableOpacity>
                  </Animated.View>

                  <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], marginTop: height * 0.05 }}>
                    <Text style={[styles.titleLarge, { fontFamily: 'Nunito_800ExtraBold' }]}>Código foi</Text>
                    <Text style={[styles.titleLarge, { fontFamily: 'Nunito_800ExtraBold' }]}>verificado com</Text>
                    <Text style={[styles.titleLarge, { fontFamily: 'Nunito_800ExtraBold' }]}>sucesso!</Text>
                    
                    <Text style={[styles.descriptionLarge, { fontFamily: 'Nunito_400Regular' }]}>
                      Agora, por favor defina uma nova senha para sua conta.
                    </Text>

                    <View style={styles.inputSection}>
                      <TextInput style={[styles.inputField, { fontFamily: 'Nunito_400Regular' }]} placeholder="Nova Senha" placeholderTextColor="#9CA3AF" secureTextEntry />
                      <TextInput style={[styles.inputField, { fontFamily: 'Nunito_400Regular', marginTop: 15 }]} placeholder="Confirmar nova Senha" placeholderTextColor="#9CA3AF" secureTextEntry />

                      <TouchableOpacity style={styles.buttonReset} activeOpacity={0.8} onPress={handleResetPassword}>
                        <Text style={[styles.buttonTextReset, { fontFamily: 'Nunito_700Bold' }]}>Alterar senha</Text>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>

                  <View style={{ flex: 1 }} />

                  <Animated.View style={[styles.footer, { opacity: fadeAnim, paddingBottom: 20 }]}>
                    <Text style={[styles.footerTextLarge, { fontFamily: 'Nunito_400Regular' }]}>Precisa de ajuda? </Text>
                    <TouchableOpacity><Text style={[styles.helpLink, { fontFamily: 'Nunito_700Bold' }]}>Entre em Contato.</Text></TouchableOpacity>
                  </Animated.View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {showPopup && (
        <Animated.View style={[styles.popupContainer, { opacity: popupFade, transform: [{ translateY: popupSlide }] }]}>
          <View style={styles.popupContent}>
            <Ionicons name="checkmark-circle" size={24} color="#4ADE80" />
            <Text style={[styles.popupText, { fontFamily: 'Nunito_700Bold' }]}>Senha alterada com sucesso!</Text>
          </View>
        </Animated.View>
      )}
    </LinearGradient>
  );
}
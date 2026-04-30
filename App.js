import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Importação das suas telas
import Login from './src/screens/Auth/Login/index';
import Register from './src/screens/Auth/Register/index';
import ForgotPassword from './src/screens/Auth/ForgotPassword/index';
import VerifyCode from './src/screens/Auth/VerifyCode/index';
import ResetPassword from './src/screens/Auth/ResetPassword/index';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          // Mantém o estado da tela anterior, evitando flashes no gradiente
          freezeOnBlur: true, 
          animation: 'fade_from_bottom', 
        }}
      >
        {/* Tela Principal de Login */}
        <Stack.Screen name="Login" component={Login} />
        
        {/* Registro: Usa a animação padrão fade_from_bottom */}
        <Stack.Screen name="Register" component={Register} />

        {/* --- FLUXO DE RECUPERAÇÃO DE SENHA (ANIMAÇÃO DESATIVADA PARA MANTER A PATA FIXA) --- */}

        {/* 1. Inserir Email */}
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPassword} 
          options={{
            animation: 'none', 
          }}
        />

        {/* 2. Inserir Código OTP */}
        <Stack.Screen 
          name="VerifyCode" 
          component={VerifyCode} 
          options={{
            animation: 'none',
          }}
        />

        {/* 3. Redefinir Nova Senha */}
        <Stack.Screen 
          name="ResetPassword" 
          component={ResetPassword} 
          options={{
            animation: 'none',
          }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
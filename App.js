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

// Importação da Tela Home (Localizada na nova pasta App)
import Home from './src/screens/App/Home/index'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          freezeOnBlur: true, 
          animation: 'fade_from_bottom', 
        }}
      >
        {/* Grupo de Autenticação */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPassword} 
          options={{ animation: 'none' }}
        />
        <Stack.Screen 
          name="VerifyCode" 
          component={VerifyCode} 
          options={{ animation: 'none' }}
        />
        <Stack.Screen 
          name="ResetPassword" 
          component={ResetPassword} 
          options={{ animation: 'none' }}
        />

        {/* Grupo do Aplicativo (Logado) */}
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{
            animation: 'fade', // Transição suave para entrar no app
          }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}